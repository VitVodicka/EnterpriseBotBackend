from functools import partial
from typing import Annotated, List, TypeVar
from pydantic import BaseModel


from fastapi import UploadFile, Form

from app.models.extractModels.ExtractedModel import ExtractedModel
from app.services.fileService import FileService
from app.services.gemini.gemini import GeminiService


class ExtractService():
    def __init__(self):
        self.geminiService = GeminiService()   
         
    T = TypeVar("T", bound=BaseModel)


    async def extractCVData(self, files: List[UploadFile]):
        
        extractPrompt = FileService().readFile('app/prompts/extract_cv.txt')

        if(len(files) == 2):
            firstCVResponse = await self.geminiService.callGeminiPrompt(extractPrompt, [files[0]], ExtractedModel )
            secondCVResponse = await self.geminiService.callGeminiPrompt(extractPrompt, [files[1]], ExtractedModel)
            return {"firstCVResponse": firstCVResponse, "secondCVResponse": secondCVResponse}
        else:
            return {"error": "Musí být nahrány 2 soubory"}
        
