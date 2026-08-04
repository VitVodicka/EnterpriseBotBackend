# EnterpriseBotBackend

Tento projekt je FastAPI backend pro zpracování CV, analýzu pracovních inzerátů a doporučení vhodných kandidátů pomocí Gemini AI.

## Funkce

- nahrání CV souborů
- zpracování popisu práce
- extrakce dat z CV
- evaluace kandidátů
- doporučení vhodných kandidátů

## Požadavky

- Python 3.10+
- virtuální prostředí

## Instalace

1. Vytvořte virtuální prostředí:

```bash
python -m venv venv
```

2. Aktivujte prostředí:

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

3. Nainstalujte závislosti:

```bash
pip install fastapi uvicorn pydantic pydantic-settings google-genai python-multipart
```

## Konfigurace

Vytvořte soubor [app/.env](app/.env) a vložte svůj klíč pro Gemini:

```env
GEMINI_API_KEY=your_api_key_here
```

> Ujistěte se, že soubor existuje ve složce [app](app).

## Spuštění aplikace

Z kořenového adresáře projektu spusťte:

```bash
uvicorn app.main:app --reload
```

Aplikace bude dostupná na:

- http://127.0.0.1:8000

## API endpointy

### Health check

```http
GET /v1/health
```

Vrací informace o dostupnosti Gemini.

### Nahrání CV a zpracování

```http
POST /v1/upload-cvs
```

Požaduje formulářová data:

- `company_introduction` - JSON text s informacemi o společnosti
- `files` - nahrané soubory CV
- `job_ad` - text pracovní nabídky

## Struktura projektu

- [app/api](app/api) - API routery
- [app/core](app/core) - konfigurace aplikace
- [app/helper](app/helper) - pomocné funkce
- [app/models](app/models) - Pydantic modely
- [app/services](app/services) - služby pro Gemini a zpracování dat

## Časté problémy

- chybí soubor [app/.env](app/.env)
- chybí nebo je neplatný `GEMINI_API_KEY`
- endpoint vrací `422` - problém s formulářovými daty nebo chybějícími soubory
- Gemini vrací chybu `429`, `403` nebo `503` - problém s limitem, klíčem nebo službou
