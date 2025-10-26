from django.core.management.base import BaseCommand
from core.models import Route, BusinessPoint, Supplier, Product

class Command(BaseCommand):
    help = 'Setup initial data for SHREE NIMISHAMBA ENTERPRISES'

    def handle(self, *args, **options):
        # Create routes
        routes_data = ['M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9']
        
        for route_name in routes_data:
            route, created = Route.objects.get_or_create(name=route_name)
            if created:
                self.stdout.write(f'Created route: {route.name}')

        # Create business points (agents)
        business_points_data = [
            {'route': 'M3', 'name': 'Shekara'},
            {'route': 'M3', 'name': 'Agent M3-2'},
            {'route': 'M4', 'name': 'Agent M4'},
            {'route': 'M4', 'name': 'Agent M4-2'},
            {'route': 'M5', 'name': 'Agent M5'},
            {'route': 'M6', 'name': 'Agent M6'},
            {'route': 'M7', 'name': 'Agent M7'},
            {'route': 'M8', 'name': 'Agent M8'},
            {'route': 'M9', 'name': 'Agent M9'},
        ]
        
        for bp_data in business_points_data:
            route = Route.objects.get(name=bp_data['route'])
            bp, created = BusinessPoint.objects.get_or_create(
                route=route,
                name=bp_data['name']
            )
            if created:
                self.stdout.write(f'Created business point: {bp.name}')

        # Create suppliers
        suppliers_data = ['Gowardhan', 'Gowardhan Curd', 'Start Milk', 'Curd', 'Doddle Milk']
        
        for supplier_name in suppliers_data:
            supplier, created = Supplier.objects.get_or_create(name=supplier_name)
            if created:
                self.stdout.write(f'Created supplier: {supplier.name}')

        # Create products
        products_data = [
            {'supplier': 'Gowardhan', 'name': 'TM 225 gms'},
            {'supplier': 'Gowardhan', 'name': 'TM 500 gms'},
            {'supplier': 'Start Milk', 'name': 'TM 225 gms'},
            {'supplier': 'Start Milk', 'name': '200 STAR'},
            {'supplier': 'Curd', 'name': '200 gms'},
            {'supplier': 'Curd', 'name': '400 gms'},
            {'supplier': 'Doddle Milk', 'name': 'TM 225 gms'},
            {'supplier': 'Doddle Milk', 'name': 'TM 500 gms'},
        ]
        
        for product_data in products_data:
            supplier = Supplier.objects.get(name=product_data['supplier'])
            product, created = Product.objects.get_or_create(
                supplier=supplier,
                name=product_data['name']
            )
            if created:
                self.stdout.write(f'Created product: {product.supplier.name} - {product.name} (multiplier: {product.crate_multiplier})')

        self.stdout.write(self.style.SUCCESS('Successfully setup initial data!'))