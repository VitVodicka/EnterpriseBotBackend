import io
from typing import List

from fastapi import HTTPException, UploadFile
from pypdf import PdfReader

from app.models.introduction_models.company_introduction_model import CompanyIntroductionModel


class UploadRequestValidator:
    ALLOWED_EXTENSION = ".pdf"
    ALLOWED_CONTENT_TYPE = "application/pdf"
    MAX_Pages = 5

    @classmethod
    def validate(cls, company_introduction: str, files: List[UploadFile], job_ad: str) -> None:
        if not company_introduction or not company_introduction.strip():
            raise HTTPException(status_code=400, detail="Pole company_introduction je povinné")

        if not files:
            raise HTTPException(status_code=400, detail="Musí být nahrán alespoň jeden soubor")


        for uploaded_file in files:
            if not uploaded_file.filename:
                raise HTTPException(status_code=400, detail="Název souboru je povinný")

            filename_lower = uploaded_file.filename.lower()
            if not filename_lower.endswith(cls.ALLOWED_EXTENSION):
                raise HTTPException(status_code=400, detail=f"Nepodporovaný typ souboru: {uploaded_file.filename}. Očekává se PDF.")

            if uploaded_file.content_type != cls.ALLOWED_CONTENT_TYPE:
                raise HTTPException(
                    status_code=400,
                    detail=f"Nepodporovaný MIME typ: {uploaded_file.content_type}. Očekává se {cls.ALLOWED_CONTENT_TYPE}.",
                )

            reader = PdfReader(io.BytesIO(uploaded_file.file.read()))
            if len(reader.pages) > cls.MAX_Pages:
                raise HTTPException(status_code=400, detail=f"PDF soubor {uploaded_file.filename} má více než {cls.MAX_Pages} stránek")
            uploaded_file.file.seek(0)

        if not job_ad or not job_ad.strip():
            raise HTTPException(status_code=400, detail="Pole job_ad je povinné")

    @staticmethod
    def validate_company_json(company_introduction: str) -> CompanyIntroductionModel:
        try:
            return CompanyIntroductionModel.model_validate_json(company_introduction)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Neplatný JSON v company_introduction: {exc}") from exc
