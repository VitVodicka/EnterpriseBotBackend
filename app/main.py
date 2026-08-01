from typing import Annotated, List

from fastapi import FastAPI, File, Form, UploadFile
from tenacity import R
from app.models.introduction_models.company_introduction_model import CompanyIntroductionModel
from app.services.gemini.company_intent_extractor_service import CompanyIntentExtractorService
from app.services.gemini.evaluate_service import EvaluateService
from app.services.gemini.extract_service import ExtractService
from app.services.gemini.recommendation_service import RecommendationService
from app.models.extract_models.extracted_model import ExtractedModel
from app.models.evaluate_models.evaluated_model import EvaluatedModel

app = FastAPI()

@app.post("/upload-cvs")
#zapracovat na tom companyIntroduction: CompanyIntroductionModel,
async def upload(company_introduction: Annotated[str, Form()], files: List[UploadFile] = File(...), job_ad: str = Form("")):
    results = []
    
    for f in files:
        results.append({"filename": f.filename, "error": "Není PDF"})
        continue
    
    company_data = CompanyIntroductionModel.model_validate_json(company_introduction)


    print("počet:" + str(len(files)))
    job_info = await CompanyIntentExtractorService().extract_company_intent(job_ad, company_data)
    
    
    extracted_cvs: tuple[ExtractedModel, ExtractedModel] = await ExtractService().extract_cv_data(files=files)
    
    evaluated_cvs: tuple[EvaluatedModel, EvaluatedModel] = await EvaluateService().evaluate_cvs(extracted_cvs, job_info=job_info)
    recommendation = await RecommendationService().recommend(job_info=job_info, evaluated_cvs=evaluated_cvs)

    return recommendation