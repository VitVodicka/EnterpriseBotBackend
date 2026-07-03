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

    if(len(files) == 2):
        firstCVResponse = await gemini.callGeminiPrompt("Extrahuj důležité parametry podle struktury z daného cv", [files[0]])
        secondCVResponse = await gemini.callGeminiPrompt("Extrahuj důležité parametry podle struktury z daného cv", [files[1]])
        return {"firstCVResponse": firstCVResponse, "secondCVResponse": secondCVResponse}
    else:
        return {"error": "Musí být nahrány 2 soubory"}
    
    



    #return gemini.callGeminiPrompt("Kolik je 5 + 5")
