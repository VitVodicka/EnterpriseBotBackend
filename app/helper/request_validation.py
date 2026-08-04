from typing import List

from fastapi import HTTPException, UploadFile

from app.models.introduction_models.company_introduction_model import CompanyIntroductionModel


class UploadRequestValidator:
    ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}

    @classmethod
    def validate(cls, company_introduction: str, files: List[UploadFile], job_ad: str) -> None:
        if not company_introduction or not company_introduction.strip():
            raise HTTPException(status_code=400, detail="Pole company_introduction je povinné")

        if not files:
            raise HTTPException(status_code=400, detail="Musí být nahrán alespoň jeden soubor")

        for uploaded_file in files:
            if not isinstance(uploaded_file, UploadFile):
                raise HTTPException(status_code=400, detail="Každý vstup v poli files musí být nahraný soubor")

            if not uploaded_file.filename:
                raise HTTPException(status_code=400, detail="Název souboru je povinný")

            filename_lower = uploaded_file.filename.lower()
            if not any(filename_lower.endswith(ext) for ext in cls.ALLOWED_EXTENSIONS):
                raise HTTPException(status_code=400, detail=f"Nepodporovaný typ souboru: {uploaded_file.filename}")

        if not job_ad or not job_ad.strip():
            raise HTTPException(status_code=400, detail="Pole job_ad je povinné")

    @staticmethod
    def validate_company_json(company_introduction: str) -> CompanyIntroductionModel:
        try:
            return CompanyIntroductionModel.model_validate_json(company_introduction)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Neplatný JSON v company_introduction: {exc}") from exc
