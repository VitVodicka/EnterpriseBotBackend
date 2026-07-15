from tkinter import E
from typing import List

from anyio.streams import file
from fastapi import FastAPI, File, UploadFile
from app.services.gemini.CompanyIntentExtractorService import CompanyIntentExtractorService
from app.services.gemini.extractService import ExtractService
from app.services.gemini.gemini import GeminiService
from app.models.extractModels.ExtractedModel import ExtractedModel
app = FastAPI()

@app.post("/upload-cvs")
async def upload(files: List[UploadFile] = File(...), jobAd:str=""):
    results = []
    
    for f in files:
        results.append({"filename": f.filename, "error": "Není PDF"})
        continue
    
    print("počet:"+str(len(files)))
    JobCandidate= await CompanyIntentExtractorService().extractCompanyIntent(jobAd)
    return await ExtractService().extractCVData(files=files)
    


    #return gemini.callGeminiPrompt("Kolik je 5 + 5")
