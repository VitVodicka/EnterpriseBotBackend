from typing import Any, List

from fastapi import UploadFile
from google import genai
from google.genai import types
from app.helper import fileConvertorHelper
from app.services.fileService import FileService
from app.core.config import settings


class GeminiService():
    def __init__(self):
        self.__client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def callGeminiPrompt(self, prompt: str, files: List[UploadFile],model):
        #TODO look for returning types

        if len(files) == 2:
            files_parts = await fileConvertorHelper.FileConvertorHelper.convertFilesToParts(files=files) + [types.Part(text=prompt)]
        else:
            files_parts = [types.Part(text=prompt)]

        system_introduction = FileService().readFile('app/prompts/system_instruction.txt')
        response = self._generate_content_response(model, files_parts, system_introduction, temperature=0.7)
        print(type(response.text))
            #TODO convertovat na dump json

        return model.model_validate_json(response.text)


    def _generate_content_response(self, model: Any, files_parts, system_instruction: str, temperature: float):
        #TODO if it is high demand
        #TODO for real test it is needed paid version 
        return self.__client.models.generate_content(
            model="gemini-3.5-flash",
            contents=[types.Content(parts=files_parts, role="user")],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                system_instruction=system_instruction,
                candidate_count=1,
                response_schema=model.model_json_schema(),
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
    