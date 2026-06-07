import os
import sys
from typing import List
from anyio.streams import file
from dotenv import load_dotenv
from fastapi import File, UploadFile
from google import genai
from google.genai import types
from app.helper import fileConvertorHelper
from app.core.config import settings
from app.models import UserModel


class GeminiService():
    def __init__(self):
        self.__client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def callGeminiPrompt(self, prompt: str, files: List[UploadFile]):
        if len(files) > 0:
            files_parts = await fileConvertorHelper.FileConvertorHelper.convertFilesToParts(files=files)
            system_introduction = self._load_system_instruction()
            response = self._generate_content_response(UserModel, files_parts, system_introduction, temperature=0.7)
            return response.text

    def _load_system_instruction(self) -> str:
        with open('app/prompts/system_instruction.txt', 'r', encoding='utf-8') as file:
            return file.read()

    def _generate_content_response(self, model, files_parts, system_instruction: str, temperature: float):
        return self.__client.models.generate_content(
            model="gemini-3.5-flash",
            contents=[types.Content(parts=files_parts, role="user")],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                system_instruction=system_instruction,
                candidate_count=1,
                #response_schema=model.model_json_schema(),
                temperature=temperature,
                safety_settings=[
                types.SafetySetting(
                    category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                ),
                types.SafetySetting(
                    category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                ),
                types.SafetySetting(
                    category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                ),
                types.SafetySetting(
                    category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                ),
                ]
            )
        )
    