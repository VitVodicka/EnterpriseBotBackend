from functools import partial
from typing import Annotated, List, TypeVar, Union, Dict
from pydantic import BaseModel


from fastapi import UploadFile, Form

from app.models.extractModels.ExtractedModel import ExtractedModel
from app.services.fileService import FileService
from app.services.gemini.gemini import GeminiService


class ExtractService():
    def __init__(self):
        self.geminiService = GeminiService()   
         
    T = TypeVar("T", bound=BaseModel)


    async def extractCVData(self, files: List[UploadFile]) -> tuple[ExtractedModel, ExtractedModel]:
        
        extractPrompt = FileService().readFile('app/prompts/extract_cv.txt')
        #breakpoint se nezavolal a nějak to nextrahuje cv
        # potenitial problem in validatejson in gemini.py
        if(len(files) == 2):
            firstCVResponse = await self.geminiService.callGeminiPrompt(extractPrompt, [files[0]], ExtractedModel )
            secondCVResponse = await self.geminiService.callGeminiPrompt(extractPrompt, [files[1]], ExtractedModel)
            return (firstCVResponse, secondCVResponse)
        else:
            raise ValueError("Musí být nahrány 2 soubory")
        
