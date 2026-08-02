from functools import partial
from typing import Annotated, List, TypeVar, Union, Dict
from pydantic import BaseModel


from fastapi import UploadFile, Form

from app.models.extract_models.extracted_model import ExtractedModel
from app.helper.file_service_helper import FileService
from app.services.gemini.gemini import GeminiService


class ExtractService:
    def __init__(self, gemini_service: GeminiService):
        self.gemini_service = gemini_service

    async def extract_cv_data(self, files: List[UploadFile]) -> tuple[ExtractedModel, ExtractedModel]:
        extract_prompt = FileService().read_file('app/prompts/extract_cv.txt')
        # breakpoint se nezavolal a nějak to nextrahuje cv
        # potential problem in validatejson in gemini.py
        if len(files) == 2:
            first_cv_response = await self.gemini_service.call_gemini_prompt(extract_prompt, [files[0]], ExtractedModel)
            second_cv_response = await self.gemini_service.call_gemini_prompt(extract_prompt, [files[1]], ExtractedModel)
            return (first_cv_response, second_cv_response)
        else:
            raise ValueError("Musí být nahrány 2 soubory")
        
