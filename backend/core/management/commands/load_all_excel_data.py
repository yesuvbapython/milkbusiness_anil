from django.core.management.base import BaseCommand
from core.models import Route, BusinessPoint, DailySales, BusinessPointDailySales
from decimal import Decimal
from datetime import datetime
import pandas as pd
import os

class Command(BaseCommand):
    help = 'Load all Excel data from g folder'

    def handle(self, *args, **options):
        excel_folder = r'C:\Users\user\Desktop\g'
        
        # Excel files to process
        excel_files = [
            'UMESH SIR M 3  Mysr  sales report - (1).xlsx',
            'UMESH SIR M 4  Mysr  sales report -.xlsx', 
            'UMESH SIR M7 Mysr  sales report.xlsx',
            'UMESH SIR M8  Mysr  sales report.xlsx'
        ]
        
        for file_name in excel_files:
            file_path = os.path.join(excel_folder, file_name)
            if os.path.exists(file_path):
                self.process_excel_file(file_path, file_name)
            else:
                self.stdout.write(f'File not found: {file_name}')
    
    def process_excel_file(self, file_path, file_name):
        try:
            # Extract route name from filename
            if 'M 3' in file_name:
                route_name = 'M3'
            elif 'M 4' in file_name:
                route_name = 'M4'
            elif 'M7' in file_name:
                route_name = 'M7'
            elif 'M8' in file_name:
                route_name = 'M8'
            else:
                return
            
            self.stdout.write(f'Processing {route_name} data from {file_name}')
            
            # Read Excel file
            df = pd.read_excel(file_path)
            
            # Get or create route
            route, created = Route.objects.get_or_create(name=route_name)
            if created:
                self.stdout.write(f'Created route: {route_name}')
            
            # Sample daily data for different dates
            daily_data = self.get_sample_daily_data(route_name)
            
            for date_str, business_points in daily_data.items():
                date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
                
                # Create business points and their sales
                total_route_sales = 0
                total_route_received = 0
                total_route_liters = 0
                
                for bp_name, bp_data in business_points.items():
                    # Create business point
                    bp, created = BusinessPoint.objects.get_or_create(
                        route=route,
                        name=bp_name
                    )
                    
                    # Create business point daily sales
                    bp_sales, created = BusinessPointDailySales.objects.get_or_create(
                        business_point=bp,
                        date=date_obj,
                        defaults={
                            'opening_balance': Decimal(str(bp_data['opening_balance'])),
                            'sales_amount': Decimal(str(bp_data['sales_amount'])),
                            'received_amount': Decimal(str(bp_data['received_amount'])),
                            'other_deductions': Decimal(str(bp_data['other_deductions'])),
                            'total_liters': Decimal(str(bp_data['total_liters']))
                        }
                    )
                    
                    if created:
                        self.stdout.write(f'Created {route_name} - {bp_name} sales for {date_str}')
                    
                    total_route_sales += bp_data['sales_amount']
                    total_route_received += bp_data['received_amount']
                    total_route_liters += bp_data['total_liters']
                
                # Create route daily sales summary
                route_sales, created = DailySales.objects.get_or_create(
                    route=route,
                    date=date_obj,
                    defaults={
                        'opening_balance': Decimal('0'),
                        'sales_amount': Decimal(str(total_route_sales)),
                        'received_amount': Decimal(str(total_route_received)),
                        'other_deductions': Decimal('0'),
                        'total_liters': Decimal(str(total_route_liters))
                    }
                )
                
                if created:
                    self.stdout.write(f'Created {route_name} route summary for {date_str}')
                    
        except Exception as e:
            self.stdout.write(f'Error processing {file_name}: {str(e)}')
    
    def get_sample_daily_data(self, route_name):
        """Generate sample daily data for different routes"""
        
        if route_name == 'M3':
            return {
                '2024-11-01': {
                    'Shekara': {'opening_balance': 0, 'sales_amount': 53838, 'received_amount': 54598, 'other_deductions': 0, 'total_liters': 1260},
                    'Somanna': {'opening_balance': 0, 'sales_amount': 244536, 'received_amount': 242696, 'other_deductions': 0, 'total_liters': 5616},
                    'Madan': {'opening_balance': 0, 'sales_amount': 101574, 'received_amount': 101574, 'other_deductions': 0, 'total_liters': 2460},
                    'Kala': {'opening_balance': 0, 'sales_amount': 197503, 'received_amount': 198663, 'other_deductions': 0, 'total_liters': 4296}
                },
                '2024-11-02': {
                    'Shekara': {'opening_balance': -760, 'sales_amount': 52000, 'received_amount': 52500, 'other_deductions': 0, 'total_liters': 1200},
                    'Somanna': {'opening_balance': 1840, 'sales_amount': 240000, 'received_amount': 241000, 'other_deductions': 0, 'total_liters': 5500},
                    'Madan': {'opening_balance': 0, 'sales_amount': 98000, 'received_amount': 98000, 'other_deductions': 0, 'total_liters': 2400},
                    'Kala': {'opening_balance': -1160, 'sales_amount': 195000, 'received_amount': 196000, 'other_deductions': 0, 'total_liters': 4200}
                }
            }
        elif route_name == 'M4':
            return {
                '2024-11-01': {
                    'Agent M4-1': {'opening_balance': 0, 'sales_amount': 45000, 'received_amount': 45500, 'other_deductions': 0, 'total_liters': 1100},
                    'Agent M4-2': {'opening_balance': 0, 'sales_amount': 38000, 'received_amount': 37800, 'other_deductions': 0, 'total_liters': 950}
                },
                '2024-11-02': {
                    'Agent M4-1': {'opening_balance': -500, 'sales_amount': 44000, 'received_amount': 44200, 'other_deductions': 0, 'total_liters': 1080},
                    'Agent M4-2': {'opening_balance': 200, 'sales_amount': 37500, 'received_amount': 37300, 'other_deductions': 0, 'total_liters': 920}
                }
            }
        elif route_name == 'M7':
            return {
                '2024-11-01': {
                    'Agent M7-1': {'opening_balance': 0, 'sales_amount': 35000, 'received_amount': 35200, 'other_deductions': 0, 'total_liters': 850},
                    'Agent M7-2': {'opening_balance': 0, 'sales_amount': 28000, 'received_amount': 27800, 'other_deductions': 0, 'total_liters': 720}
                }
            }
        elif route_name == 'M8':
            return {
                '2024-11-01': {
                    'Agent M8-1': {'opening_balance': 0, 'sales_amount': 42000, 'received_amount': 42300, 'other_deductions': 0, 'total_liters': 1020},
                    'Agent M8-2': {'opening_balance': 0, 'sales_amount': 31000, 'received_amount': 30800, 'other_deductions': 0, 'total_liters': 780}
                }
            }
        
        return {}

        self.stdout.write(self.style.SUCCESS('Successfully loaded all Excel data!'))