@echo off
cd /d "C:\milk_business_app\backend"
start "Backend" cmd /k "python manage.py runserver"

cd /d "C:\milk_business_app\frontend\milk-business-frontend"
start "Frontend" cmd /k "ng serve"

echo Backend: http://localhost:8000
echo Frontend: http://localhost:4200