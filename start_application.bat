@echo off
echo Starting SHREE NIMISHAMBA ENTERPRISES Application...
echo.

start "Django Backend" cmd /k "cd backend && pip install -r requirements.txt && python manage.py makemigrations && python manage.py migrate && python manage.py setup_initial_data && python manage.py runserver"

timeout /t 5 /nobreak >nul

start "Angular Frontend" cmd /k "cd frontend\milk-business-frontend && npm install && ng serve"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:4200
echo.
pause