from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path

class Settings(BaseSettings):
    GEMINI_API_KEY: str

    model_config = SettingsConfigDict(
        env_file="app/.env",
        extra="ignore"
    )
    print("CWD:", os.getcwd())
    print(".env exists here?:", Path("app/.env").exists())
    print("ENV VAR:", os.getenv("GEMINI_API_KEY"))

settings = Settings()