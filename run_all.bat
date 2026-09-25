@echo off
echo ========================================================
echo Starting CropGuard AI - Backend & Frontend
echo ========================================================

start "CropGuard FastAPI Backend" cmd /k "cd backend && .\.venv\Scripts\activate && uvicorn app.main:app --reload --port 8001"

timeout /t 2 /nobreak >nul

start "CropGuard React Frontend" cmd /k "cd frontend && npm run dev"

echo Backend launching on http://localhost:8001
echo Frontend launching on http://localhost:5173
echo ========================================================
