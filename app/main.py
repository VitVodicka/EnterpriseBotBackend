from typing import Annotated, List

from fastapi import FastAPI, File, Form, UploadFile
from tenacity import R
from app.models.introductionModels.CompanyIntroductionModel import CompanyIntroductionModel
from app.services.gemini.CompanyIntentExtractorService import CompanyIntentExtractorService
from app.services.gemini.evaluateService import EvaluateService
from app.services.gemini.extractService import ExtractService
from app.services.gemini.reccomendationService import RecommendationService
from app.models.extractModels.ExtractedModel import ExtractedModel
from app.models.evaluateModels.EvaluatedModel import EvaluatedModel

app = FastAPI()

@app.post("/upload-cvs")
#zapracovat na tom companyIntroduction: CompanyIntroductionModel,
async def upload(companyIntroduction: Annotated[str, Form()],files: List[UploadFile] = File(...), jobAd: str = Form("")):
    results = []
    
    for f in files:
        results.append({"filename": f.filename, "error": "Není PDF"})
        continue
    
    company_data = CompanyIntroductionModel.model_validate_json(companyIntroduction)


    print("počet:"+str(len(files)))
    jobInfo = await CompanyIntentExtractorService().extractCompanyIntent(jobAd, company_data)
    
    
    extractedCVS: tuple[ExtractedModel, ExtractedModel] = await ExtractService().extractCVData(files=files)
    
    evaluatedCVS: tuple[EvaluatedModel, EvaluatedModel] = await EvaluateService().evaluateCVs(extractedCVS, jobInfo=jobInfo)
    reccomendation = await RecommendationService().recommend(jobInfo=jobInfo, evaluatedCVs=evaluatedCVS)

    return reccomendation