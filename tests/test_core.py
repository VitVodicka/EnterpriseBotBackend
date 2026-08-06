import io

import pytest
from fastapi import HTTPException, UploadFile
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

from app.helper.request_validation import UploadRequestValidator
from app.services.gemini.gemini import GeminiService
from app.main import app
from app.deps import (
    get_intent_extractor_service,
    get_extract_service,
    get_evaluate_service,
    get_recommendation_service,
)
from tests.conftest import make_fake_pdf


def test_validate_company_json_rejects_invalid_json():
    broken_json = '{"company_type": "s.r.o.", "industry": "IT"'

    with pytest.raises(HTTPException) as exc_info:
        UploadRequestValidator.validate_company_json(broken_json)

    assert exc_info.value.status_code == 400
    assert "Neplatný JSON" in exc_info.value.detail


def test_validate_rejects_pdf_with_too_many_pages(valid_company_introduction):
    pdf_bytes = make_fake_pdf(6)
    fake_file = UploadFile(
        filename="cv.pdf",
        file=io.BytesIO(pdf_bytes),
        headers={"content-type": "application/pdf"},
    )

    with pytest.raises(HTTPException) as exc_info:
        UploadRequestValidator.validate(
            company_introduction=valid_company_introduction,
            files=[fake_file],
            job_ad="Hledáme vývojáře",
        )

    assert exc_info.value.status_code == 400
    assert "více než" in exc_info.value.detail


def test_validate_accepts_pdf_at_exact_page_limit(valid_company_introduction):
    pdf_bytes = make_fake_pdf(5)
    fake_file = UploadFile(
        filename="cv.pdf",
        file=io.BytesIO(pdf_bytes),
        headers={"content-type": "application/pdf"},
    )

    UploadRequestValidator.validate(
        company_introduction=valid_company_introduction,
        files=[fake_file],
        job_ad="Hledáme vývojáře",
    )


@pytest.mark.asyncio
async def test_get_health_gemini_success():
    service = GeminiService.__new__(GeminiService)

    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(return_value=MagicMock())
    service._GeminiService__client = mock_client

    result = await service.get_health_gemini()

    assert result["available"] is True
    assert result["model"] == "gemini-3.5-flash"


client = TestClient(app)


def test_upload_cvs_happy_path(valid_company_introduction):
    mock_intent = AsyncMock()
    mock_intent.extract_company_intent.return_value = {"role": "Python developer"}

    mock_extract = AsyncMock()
    mock_extract.extract_cv_data.return_value = ({"name": "Jan"}, {"name": "Petr"})

    mock_evaluate = AsyncMock()
    mock_evaluate.evaluate_cvs.return_value = ({"score": 8}, {"score": 6})

    mock_recommend = AsyncMock()
    mock_recommend.recommend.return_value = {"winner": "Jan", "reason": "lepší zkušenosti"}

    app.dependency_overrides[get_intent_extractor_service] = lambda: mock_intent
    app.dependency_overrides[get_extract_service] = lambda: mock_extract
    app.dependency_overrides[get_evaluate_service] = lambda: mock_evaluate
    app.dependency_overrides[get_recommendation_service] = lambda: mock_recommend

    pdf_bytes = make_fake_pdf(1)

    response = client.post(
        "/v1/upload-cvs",
        data={
            "company_introduction": valid_company_introduction,
            "job_ad": "Hledáme Python vývojáře",
        },
        files=[("files", ("cv1.pdf", pdf_bytes, "application/pdf"))],
    )

    assert response.status_code == 200
    assert response.json() == {"winner": "Jan", "reason": "lepší zkušenosti"}

    app.dependency_overrides.clear()
