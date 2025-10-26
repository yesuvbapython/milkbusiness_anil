# SHREE NIMISHAMBA ENTERPRISES - Milk Business Management System

A comprehensive web application for managing milk business operations with Angular frontend and Django backend.

## Features

- **Route Management**: Manage 9 routes (M3-M11) with assigned business agents
- **Product Management**: Handle different milk varieties (Gowardhan, Start Milk, Curd, Doddle Milk)
- **Daily Sales Tracking**: Record opening balance, sales amount, received amount, and calculate net balance
- **Cash Flow Management**: 
  - Agent Cash Flow Statement (inward/outward amounts)
  - Bank Cash Flow Statement (credit/debit transactions)
  - Combined Cash Closing Balance calculation
- **Reporting**: Generate printable reports for selected dates and routes

## Business Logic

- **Crate Calculation**: 1 crate = 12 liters, 200ml = 60 units
- **Rate Management**: Manual rate setting per variety per route
- **Cash Balance**: Opening Balance + Sales Amount - Received Amount - Other Deductions = Net Balance
- **Cash Closing Balance**: Agent Cash Flow Total + Bank Cash Flow Total

## Setup Instructions

### Backend (Django)

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Setup initial data:
```bash
python manage.py setup_initial_data
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Start Django server:
```bash
python manage.py runserver
```

### Frontend (Angular)

1. Navigate to frontend directory:
```bash
cd frontend/milk-business-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start Angular development server:
```bash
ng serve
```

4. Access the application at `http://localhost:4200`

## API Endpoints

- `/api/routes/` - Route management
- `/api/varieties/` - Product varieties
- `/api/products/` - Products under varieties
- `/api/route-rates/` - Route-specific rates
- `/api/daily-sales/` - Daily sales entries
- `/api/agent-cashflow/` - Agent cash flow management
- `/api/bank-cashflow/` - Bank transactions
- `/api/daily-sales/cash_balance_report/` - Cash balance reports
- `/api/agent-cashflow/statement/` - Agent cash flow statements
- `/api/bank-cashflow/statement/` - Bank cash flow statements
- `/api/bank-cashflow/cash_closing_balance/` - Combined closing balance

## Usage

1. **Setup Routes and Rates**: Configure your 9 routes with agents and set rates for each variety
2. **Daily Operations**: Enter daily sales data for each route
3. **Cash Flow Management**: Record agent and bank transactions
4. **Generate Reports**: Create printable reports for any date range and route combination

## Technology Stack

- **Backend**: Django 4.2, Django REST Framework
- **Frontend**: Angular 17, TypeScript
- **Database**: SQLite (development), easily configurable for PostgreSQL/MySQL
- **Styling**: Custom CSS with responsive design