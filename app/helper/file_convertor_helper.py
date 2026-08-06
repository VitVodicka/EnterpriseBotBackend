from typing import List
from fastapi import HTTPException, UploadFile
from google.genai import types


class FileConvertorHelper:
    @staticmethod
    async def convert_files_to_parts(files: List[UploadFile]):
        parts = []
        for file in files:
            if not file.filename:
                raise HTTPException(status_code=400, detail="Název souboru je povinný")
            if not file.filename.lower().endswith(".pdf"):
                raise HTTPException(status_code=400, detail=f"Nepodporovaný typ souboru: {file.filename}. Očekává se PDF.")
            if file.content_type != "application/pdf":
                raise HTTPException(status_code=400, detail=f"Nepodporovaný MIME typ: {file.content_type}. Očekává se application/pdf.")

            await file.seek(0)
            content = await file.read()
            if not content:
                raise HTTPException(status_code=400, detail=f"Soubor {file.filename} je prázdný nebo se nepodařilo načíst.")

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