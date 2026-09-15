@echo off
echo Spoustim desideo Backend a Frontend...
start "desideo Backend (FastAPI)" cmd /k ".\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
start "desideo Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo Aplikace bezi!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000

