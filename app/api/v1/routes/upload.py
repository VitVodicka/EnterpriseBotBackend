from typing import Annotated, List

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.models.introduction_models.company_introduction_model import CompanyIntroductionModel
from app.services.gemini.company_intent_extractor_service import CompanyIntentExtractorService
from app.services.gemini.evaluate_service import EvaluateService
from app.services.gemini.extract_service import ExtractService
from app.services.gemini.gemini import GeminiService
from app.services.gemini.recommendation_service import RecommendationService
from app.models.extract_models.extracted_model import ExtractedModel
from app.models.evaluate_models.evaluated_model import EvaluatedModel

from app.deps import (
    get_gemini_service,
    get_intent_extractor_service,
    get_extract_service,
    get_evaluate_service,
    get_recommendation_service,
)

router = APIRouter(prefix="/v1", tags=["cv"])


@router.post("/upload-cvs")
async def upload(
    company_introduction: Annotated[str, Form()],
    files: List[UploadFile] = File(...),
    job_ad: str = Form(""),
    intent_service: CompanyIntentExtractorService = Depends(get_intent_extractor_service),
    extract_service: ExtractService = Depends(get_extract_service),
    evaluate_service: EvaluateService = Depends(get_evaluate_service),
    recommendation_service: RecommendationService = Depends(get_recommendation_service),
):
    company_data = CompanyIntroductionModel.model_validate_json(company_introduction)

    job_info = await intent_service.extract_company_intent(job_ad, company_data)
    extracted_cvs: tuple[ExtractedModel, ExtractedModel] = await extract_service.extract_cv_data(files=files)
    evaluated_cvs: tuple[EvaluatedModel, EvaluatedModel] = await evaluate_service.evaluate_cvs(extracted_cvs, job_info=job_info)
    recommendation = await recommendation_service.recommend(job_info=job_info, evaluated_cvs=evaluated_cvs)

    return recommendation

@router.get("/health")
async def health(gemini_service: GeminiService = Depends(get_gemini_service)):
    health_status = await gemini_service.get_health_gemini()
    return health_status