from django.core.management.base import BaseCommand
from core.models import Route, Product, RouteRate
from decimal import Decimal

class Command(BaseCommand):
    help = 'Load rates from Excel data for M3 route'

    def handle(self, *args, **options):
        # Excel rates data for M3 route (from row 5 - RATE column)
        rates_data = [
            {'supplier': 'GOWARDHAN', 'product': 'TM 225', 'rate': 46.3},
            {'supplier': 'GOWARDHAN', 'product': 'TM 500', 'rate': 44.5},
            {'supplier': 'GOWARDHAN', 'product': 'TM 450', 'rate': 44.3},
            {'supplier': 'GOWARDHAN', 'product': 'TM LTR', 'rate': 46.3},
            {'supplier': 'VITAL', 'product': 'VITAL', 'rate': 62.0},
            {'supplier': 'FRESH LIFE', 'product': '200ML', 'rate': 11.5},
            {'supplier': 'FRESH LIFE', 'product': '500ML', 'rate': 48.0},
            {'supplier': 'FRESH LIFE', 'product': '1000G', 'rate': 62.5},
            {'supplier': 'T SPECIAL', 'product': 'TM 500', 'rate': 59.0},
            {'supplier': 'T SPECIAL', 'product': 'TM1000', 'rate': 44.6},
            {'supplier': 'DFCM', 'product': 'DFCM', 'rate': 61.8},
            {'supplier': 'DSTD', 'product': 'DSTD', 'rate': 54.0},
            {'supplier': 'DSTD', 'product': '200G', 'rate': 11.0},
            {'supplier': 'DSTD', 'product': '1000', 'rate': 46.0},
            {'supplier': 'B MILK', 'product': 'B MILK', 'rate': 9.5},
            {'supplier': 'B MILK', 'product': '500G', 'rate': 44.0},
            {'supplier': 'TM', 'product': 'TM', 'rate': 38.0},
            {'supplier': 'FCM', 'product': 'FCM', 'rate': 48.0},
        ]
        
        try:
            m3_route = Route.objects.get(name='M3')
            
            for rate_data in rates_data:
                try:
                    product = Product.objects.get(
                        supplier__name=rate_data['supplier'],
                        name=rate_data['product']
                    )
                    
                    route_rate, created = RouteRate.objects.get_or_create(
                        route=m3_route,
                        product=product,
                        defaults={'rate': Decimal(str(rate_data['rate']))}
                    )
                    
                    if created:
                        self.stdout.write(f'Created rate: M3 - {product.supplier.name} {product.name} - Rs.{rate_data["rate"]}')
                    else:
                        route_rate.rate = Decimal(str(rate_data['rate']))
                        route_rate.save()
                        self.stdout.write(f'Updated rate: M3 - {product.supplier.name} {product.name} - Rs.{rate_data["rate"]}')
                        
                except Product.DoesNotExist:
                    self.stdout.write(f'Product not found: {rate_data["supplier"]} - {rate_data["product"]}')
                    
        except Route.DoesNotExist:
            self.stdout.write('M3 route not found. Run setup_initial_data first.')

        self.stdout.write(self.style.SUCCESS('Successfully loaded Excel rates!'))