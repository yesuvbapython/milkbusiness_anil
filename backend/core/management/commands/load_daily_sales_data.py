from django.core.management.base import BaseCommand
from core.models import Route, BusinessPoint, DailySales, BusinessPointDailySales
from decimal import Decimal
from datetime import datetime

class Command(BaseCommand):
    help = 'Load daily sales data from Excel analysis'

    def handle(self, *args, **options):
        # Create business points for M3 route from Excel data
        try:
            m3_route = Route.objects.get(name='M3')
            
            # Business points from M3 sheet
            business_points_data = [
                'Shekara', 'Somanna', 'Madan', 'Kala', 'Ravi', 'Kumar', 'Prasad'
            ]
            
            for bp_name in business_points_data:
                bp, created = BusinessPoint.objects.get_or_create(
                    route=m3_route,
                    name=bp_name
                )
                if created:
                    self.stdout.write(f'Created business point: {bp.name}')
            
            # Sample daily sales data for M3 route (Nov 1, 2024)
            daily_sales_data = [
                {
                    'business_point': 'Shekara',
                    'date': '2024-11-01',
                    'opening_balance': 0,
                    'sales_amount': 53838,
                    'received_amount': 54598,
                    'other_deductions': 0,
                    'total_liters': 1260
                },
                {
                    'business_point': 'Somanna', 
                    'date': '2024-11-01',
                    'opening_balance': 0,
                    'sales_amount': 244536,
                    'received_amount': 242696,
                    'other_deductions': 0,
                    'total_liters': 5616
                },
                {
                    'business_point': 'Madan',
                    'date': '2024-11-01', 
                    'opening_balance': 0,
                    'sales_amount': 101574.6,
                    'received_amount': 101574.6,
                    'other_deductions': 0,
                    'total_liters': 2460
                },
                {
                    'business_point': 'Kala',
                    'date': '2024-11-01',
                    'opening_balance': 0,
                    'sales_amount': 197503.2,
                    'received_amount': 198663.2,
                    'other_deductions': 0,
                    'total_liters': 4296
                }
            ]
            
            # Create business point daily sales
            for sales_data in daily_sales_data:
                try:
                    bp = BusinessPoint.objects.get(
                        route=m3_route,
                        name=sales_data['business_point']
                    )
                    
                    bp_sales, created = BusinessPointDailySales.objects.get_or_create(
                        business_point=bp,
                        date=datetime.strptime(sales_data['date'], '%Y-%m-%d').date(),
                        defaults={
                            'opening_balance': Decimal(str(sales_data['opening_balance'])),
                            'sales_amount': Decimal(str(sales_data['sales_amount'])),
                            'received_amount': Decimal(str(sales_data['received_amount'])),
                            'other_deductions': Decimal(str(sales_data['other_deductions'])),
                            'total_liters': Decimal(str(sales_data['total_liters']))
                        }
                    )
                    
                    if created:
                        self.stdout.write(f'Created sales: {bp.name} - {sales_data["date"]} - Rs.{sales_data["sales_amount"]}')
                    
                except BusinessPoint.DoesNotExist:
                    self.stdout.write(f'Business point not found: {sales_data["business_point"]}')
            
            # Create route-level summary for M3
            total_sales = sum(Decimal(str(s['sales_amount'])) for s in daily_sales_data)
            total_received = sum(Decimal(str(s['received_amount'])) for s in daily_sales_data)
            total_liters = sum(Decimal(str(s['total_liters'])) for s in daily_sales_data)
            
            route_sales, created = DailySales.objects.get_or_create(
                route=m3_route,
                date=datetime.strptime('2024-11-01', '%Y-%m-%d').date(),
                defaults={
                    'opening_balance': Decimal('0'),
                    'sales_amount': total_sales,
                    'received_amount': total_received,
                    'other_deductions': Decimal('0'),
                    'total_liters': total_liters
                }
            )
            
            if created:
                self.stdout.write(f'Created route sales: M3 - 2024-11-01 - Rs.{total_sales}')
                
        except Route.DoesNotExist:
            self.stdout.write('M3 route not found. Run setup_initial_data first.')

        self.stdout.write(self.style.SUCCESS('Successfully loaded daily sales data!'))