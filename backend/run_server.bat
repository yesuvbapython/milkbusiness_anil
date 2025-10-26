@echo off
echo Setting up SHREE NIMISHAMBA ENTERPRISES Backend...
echo.

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo Setting up initial data...
python manage.py setup_initial_data

echo.
echo Starting Django server...
echo Backend will be available at http://localhost:8000
echo Admin panel at http://localhost:8000/admin
echo.
python manage.py runserver