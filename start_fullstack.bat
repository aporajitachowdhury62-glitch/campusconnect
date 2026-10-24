@echo off
echo ========================================================
echo Launching CampusConnect Full-Stack (Backend + Frontend)
echo ========================================================

start "CampusConnect Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && if exist ".venv\Scripts\python.exe" (.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload) else (python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload)"

start "CampusConnect Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo - Frontend: http://localhost:5173/
echo - Backend Docs: http://localhost:8000/docs
echo ========================================================
timeout /t 5
