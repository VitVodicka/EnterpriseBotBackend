from typing import List
from fastapi import UploadFile
from google.genai import types


class FileConvertorHelper:
    
    @staticmethod
    async def convertFilesToParts(files: List[UploadFile]):
        parts = []
        for file in files:
            content = await file.read()
            parts.append(
                types.Part.from_bytes(
                    data=content,
                    mime_type="application/pdf"
                )
            )
        return parts