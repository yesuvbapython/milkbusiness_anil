from django.core.management.base import BaseCommand
from core.models import Route, Supplier, Product, RouteRate
from decimal import Decimal

class Command(BaseCommand):
    help = 'Load data from Excel structure'

    def handle(self, *args, **options):
        # Create suppliers based on Excel data
        suppliers_data = [
            'GOWARDHAN', 'VITAL', 'FRESH LIFE', 'T SPECIAL', 'DFCM', 'DSTD', 
            'LASSI', 'B MILK', 'STD', 'AFCM', 'FCM', 'TM'
        ]
        
        for supplier_name in suppliers_data:
            supplier, created = Supplier.objects.get_or_create(name=supplier_name)
            if created:
                self.stdout.write(f'Created supplier: {supplier.name}')

        # Create products with varieties
        products_data = [
            {'supplier': 'GOWARDHAN', 'products': ['TM 225', 'TM 500', 'TM 450', 'TM LTR']},
            {'supplier': 'VITAL', 'products': ['VITAL']},
            {'supplier': 'FRESH LIFE', 'products': ['200ML', '500ML', '1000G']},
            {'supplier': 'T SPECIAL', 'products': ['TM 500', 'TM1000']},
            {'supplier': 'DFCM', 'products': ['DFCM']},
            {'supplier': 'DSTD', 'products': ['DSTD', '200G', '1000', '450d']},
            {'supplier': 'LASSI', 'products': ['LASSI']},
            {'supplier': 'B MILK', 'products': ['B MILK', '500G']},
            {'supplier': 'STD', 'products': ['STD']},
            {'supplier': 'AFCM', 'products': ['AFCM', '200', '500', '1000']},
            {'supplier': 'FCM', 'products': ['FCM']},
            {'supplier': 'TM', 'products': ['TM', '200G', '500G']},
        ]
        
        for supplier_data in products_data:
            try:
                supplier = Supplier.objects.get(name=supplier_data['supplier'])
                for product_name in supplier_data['products']:
                    product, created = Product.objects.get_or_create(
                        supplier=supplier,
                        name=product_name
                    )
                    if created:
                        self.stdout.write(f'Created product: {supplier.name} - {product.name}')
            except Supplier.DoesNotExist:
                continue

        # Create sample rates for M3 route based on Excel data
        try:
            m3_route = Route.objects.get(name='M3')
            rates_data = [
                {'supplier': 'GOWARDHAN', 'rate': 46.3},
                {'supplier': 'VITAL', 'rate': 62.0},
                {'supplier': 'FRESH LIFE', 'rate': 48.0},
                {'supplier': 'T SPECIAL', 'rate': 59.0},
                {'supplier': 'DFCM', 'rate': 61.8},
                {'supplier': 'DSTD', 'rate': 54.0},
                {'supplier': 'B MILK', 'rate': 9.5},
                {'supplier': 'FCM', 'rate': 48.0},
                {'supplier': 'TM', 'rate': 38.0},
            ]
            
            for rate_data in rates_data:
                try:
                    supplier = Supplier.objects.get(name=rate_data['supplier'])
                    route_rate, created = RouteRate.objects.get_or_create(
                        route=m3_route,
                        supplier=supplier,
                        defaults={'rate': Decimal(str(rate_data['rate']))}
                    )
                    if created:
                        self.stdout.write(f'Created rate: {m3_route.name} - {supplier.name} - ₹{rate_data["rate"]}')
                except Supplier.DoesNotExist:
                    continue
        except Route.DoesNotExist:
            self.stdout.write('M3 route not found. Run setup_initial_data first.')

        self.stdout.write(self.style.SUCCESS('Successfully loaded Excel data!'))