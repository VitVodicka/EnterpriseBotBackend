from typing import List

from anyio.streams import file
from fastapi import FastAPI, File, UploadFile
from app.services.gemini.gemini import GeminiService
app = FastAPI()

@app.post("/upload-cvs")
async def upload(files: List[UploadFile] = File(...)):
    results = []
    for f in files:
        results.append({"filename": f.filename, "error": "Není PDF"})
        continue
    
    print("počet:"+str(len(files)))
    #return {"count": len(files)}
    gemini: GeminiService = GeminiService()
    firstCVResponse = await gemini.callGeminiPrompt("Ohodnot, kdo je nejlepší kandidát pro moji firmu", [files[0]])
    secondCVResponse = await gemini.callGeminiPrompt("Ohodnot, kdo je nejlepší kandidát pro moji firmu", [files[1]])
    return {"firstCVResponse": firstCVResponse, "secondCVResponse": secondCVResponse}
    
    
@app.post("/debug-upload")
async def debug_upload(files: List[UploadFile] = File(...)):
    return {"filenames": [f.filename for f in files]}




    #return gemini.callGeminiPrompt("Kolik je 5 + 5")
