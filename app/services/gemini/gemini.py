from typing import Any, List

from fastapi import UploadFile
from google import genai
from google.genai import types
from app.helper import file_convertor_helper
from app.services.file_service import FileService
from app.core.config import settings


class GeminiService:
    def __init__(self):
        self.__client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def call_gemini_prompt(self, prompt: str, files: List[UploadFile], model):
        # TODO look for returning types

        if len(files) == 1:
            files_parts = await file_convertor_helper.FileConvertorHelper.convert_files_to_parts(files=files) + [types.Part(text=prompt)]
        else:
            files_parts = [types.Part(text=prompt)]

        system_introduction = FileService().read_file('app/prompts/system_instruction.txt')
        response = self.generate_content_response(model, files_parts, system_introduction, temperature=0.7)
        print(type(response.text))

        return model.model_validate_json(response.text)


    def generate_content_response(self, model: Any, files_parts, system_instruction: str, temperature: float):
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
    