from typing import Any, List

from fastapi import HTTPException, UploadFile
from google import genai
from google.genai import types
import httpx
from pydantic import ValidationError
from app.helper.file_convertor_helper import FileConvertorHelper
from app.helper.file_service_helper import FileService
from app.core.config import settings
from google.genai import errors as genai_errors


class GeminiService:
    def __init__(self):
        self.__client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def call_gemini_prompt(self, prompt: str, files: List[UploadFile], model):
        try:
            if len(files) == 1:
                files_parts = await FileConvertorHelper.convert_files_to_parts(files=files) + [types.Part(text=prompt)]
            else:
                files_parts = [types.Part(text=prompt)]

            system_introduction = FileService().read_file('app/prompts/system_instruction.txt')
            response = await self.generate_content_response(model, files_parts, system_introduction, temperature=0.7)
            response_text = response.text

            if not response_text or not response_text.strip():
                raise HTTPException(status_code=502, detail="Gemini vrátil prázdnou odpověď")

            try:
                return model.model_validate_json(response_text)
            except ValidationError as exc:
                raise HTTPException(status_code=502, detail=f"Gemini vrátil nevalidní JSON odpověď: {exc}") from exc

        except genai_errors.ClientError as e:
            status = getattr(e, "code", None)
            if status == 429:
                raise HTTPException(status_code=429, detail="Gemini rate limit exceeded")
            elif status == 403:
                raise HTTPException(status_code=403, detail="Gemini quota exceeded or invalid key")
            elif status == 404:
                raise HTTPException(status_code=502, detail="Gemini model not found")
            raise HTTPException(status_code=502, detail=f"Gemini client error: {e}")
        except genai_errors.ServerError as e:
            raise HTTPException(status_code=503, detail=f"Gemini server error: {e}")


    async def get_health_gemini(self):
        try:
            response = await self.__client.aio.models.generate_content(
                #contents is a file + text prompt, role is user, config is how many candidates, max tokens
                model="gemini-3.5-flash",
                contents=[types.Content(parts=[types.Part(text="ping")], role="user")],
                config=types.GenerateContentConfig(
                    candidate_count=1,
                    max_output_tokens=5,
                ),
            )

            return {
                "available": True,
                "model": "gemini-3.5-flash",
            }

        except genai_errors.ClientError as e:
            # 4xx chyby - rozlišíme podle status kódu
            status = getattr(e, "code", None)

            if status == 429:
                reason = "rate_limit_exceeded"
            elif status == 403:
                reason = "quota_or_permission_denied"
            elif status == 404:
                reason = "model_not_found"
            else:
                reason = "client_error"

            return {
                "available": False,
                "model": "gemini-3.5-flash",
                "status_code": status,
                "error": reason,
                "detail": str(e),
            }

        except genai_errors.ServerError as e:
            # 5xx chyby - Gemini API má vlastní výpadek
            return {
                "available": False,
                "model": "gemini-3.5-flash",
                "status_code": getattr(e, "code", None),
                "error": "gemini_server_error",
                "detail": str(e),
            }

        except Exception as e:
            return {
                "available": False,
                "model": "gemini-3.5-flash",
                "error": "unknown_error",
                "detail": str(e),
            }

    async def generate_content_response(self, model: Any, files_parts, system_instruction: str, temperature: float):
        """
        
        Generates content using the Gemini API with the specified model, files, system instruction, and temperature(how much should it be correct), response type=json to return.
        safety settings, what to block(4 levels High to None)
        contents is a file + text prompt, role is user, config is how many candidates, max tokens
        """

      
        return await self.__client.aio.models.generate_content(
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
    