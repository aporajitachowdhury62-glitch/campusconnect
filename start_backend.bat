@echo off
echo Starting CampusConnect Backend Server...
cd /d "%~dp0backend"
if exist ".venv\Scripts\python.exe" (
    echo Using virtual environment...
    .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
) else (
    echo Virtualenv not found, using global python...
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
)
pause
