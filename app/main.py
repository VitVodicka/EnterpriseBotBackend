from typing import List

from fastapi import FastAPI, File, UploadFile
from app.services.gemini.gemini import GeminiService
app = FastAPI()

@app.post("/upload-cvs")
async def upload(files: List[UploadFile] = File(...)):
    #return {"count": len(files)}
    gemini: GeminiService = GeminiService()
    return await gemini.callGeminiPrompt("Ohodnot, kdo je nejlepší kandidát pro moji firmu", files);
    
    
    #return gemini.callGeminiPrompt("Kolik je 5 + 5")
