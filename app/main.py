from typing import Annotated, List

from fastapi import FastAPI, File, Form, UploadFile
from app.models.introductionModels.CompanyIntroductionModel import CompanyIntroductionModel
from app.services.gemini.CompanyIntentExtractorService import CompanyIntentExtractorService
from app.services.gemini.extractService import ExtractService

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
    
    print(jobInfo)
    return await ExtractService().extractCVData(files=files)
    


    #return gemini.callGeminiPrompt("Kolik je 5 + 5")
