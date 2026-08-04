from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    GEMINI_API_KEY: str

    model_config = SettingsConfigDict(
        env_file="app/.env",
        extra="ignore"
    )
    print("CWD:", os.getcwd())
    print(".env exists here?:", Path("app/.env").exists())
    print("ENV VAR:", os.getenv("GEMINI_API_KEY"))

try:
    settings = Settings()
except Exception as e:
    raise RuntimeError(
        f"Nepodařilo se načíst konfiguraci. Zkontroluj, že soubor {ENV_PATH} "
        f"existuje a obsahuje GEMINI_API_KEY. Detail chyby: {e}"
    ) from e