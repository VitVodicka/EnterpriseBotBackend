from typing import List
from fastapi import UploadFile
from google.genai import types


class FileConvertorHelper:
    
    @staticmethod
    async def convert_files_to_parts(files: List[UploadFile]):
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
    
    @staticmethod
    def format_skill_list(skills: list[str]) -> str:
        return "\n".join(f"- {s}" for s in skills) if skills else "Neuvedeno."

    @staticmethod
    def clean_unknown(value: str) -> str:
        return "neuvedeno" if not value or value.strip().lower() == "unknown" else value