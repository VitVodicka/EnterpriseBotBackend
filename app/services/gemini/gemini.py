import os
from typing import List
from dotenv import load_dotenv
from fastapi import File, UploadFile
from google import genai
from google.genai import types
from app.helper import fileConvertorHelper
from app.core.config import settings


class GeminiService():
    def __init__(self):

        self.__client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    async def callGeminiPrompt(self, prompt:str, files: List[UploadFile] ):
        
        if(len(files)>0):
            files_parts = await fileConvertorHelper.FileConvertorHelper.convertFilesToParts(files=files)

            response = self.__client.models.generate_content(
                model="gemini-3.5-flash",
                contents=[types.Content(parts=files_parts, role="user")]
            )
            return response.text

        
    