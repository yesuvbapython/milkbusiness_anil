from rest_framework import serializers
from .models import (Route, BusinessPoint, Supplier, Product, RouteRate, BusinessPointRate,
                    CrateDistribution, BusinessPointCrateDistribution, DailySales, 
                    BusinessPointDailySales, AgentCashFlow, BankCashFlow, Production)

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class BusinessPointSerializer(serializers.ModelSerializer):
    route_name = serializers.CharField(source='route.name', read_only=True)
    
    class Meta:
        model = BusinessPoint
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    crate_multiplier = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'

class RouteRateSerializer(serializers.ModelSerializer):
    route_name = serializers.CharField(source='route.name', read_only=True)
    supplier_name = serializers.CharField(source='product.supplier.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = RouteRate
        fields = '__all__'

class BusinessPointRateSerializer(serializers.ModelSerializer):
    business_point_name = serializers.CharField(source='business_point.name', read_only=True)
    supplier_name = serializers.CharField(source='product.supplier.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = BusinessPointRate
        fields = '__all__'

class CrateDistributionSerializer(serializers.ModelSerializer):
    route_name = serializers.CharField(source='route.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_units = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = CrateDistribution
        fields = '__all__'

class BusinessPointCrateDistributionSerializer(serializers.ModelSerializer):
    business_point_name = serializers.CharField(source='business_point.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_units = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = BusinessPointCrateDistribution
        fields = '__all__'

class DailySalesSerializer(serializers.ModelSerializer):
    route_name = serializers.CharField(source='route.name', read_only=True)
    agent_name = serializers.CharField(source='route.agent_name', read_only=True)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    net_balance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = DailySales
        fields = '__all__'

class BusinessPointDailySalesSerializer(serializers.ModelSerializer):
    business_point_name = serializers.CharField(source='business_point.name', read_only=True)
    route_name = serializers.CharField(source='business_point.route.name', read_only=True)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    net_balance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = BusinessPointDailySales
        fields = '__all__'

class AgentCashFlowSerializer(serializers.ModelSerializer):
    route_name = serializers.CharField(source='route.name', read_only=True)
    closing_balance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = AgentCashFlow
        fields = '__all__'

class BankCashFlowSerializer(serializers.ModelSerializer):
    net_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = BankCashFlow
        fields = '__all__'

class ProductionSerializer(serializers.ModelSerializer):
    route_name = serializers.CharField(source='route.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_units_produced = serializers.IntegerField(read_only=True)
    total_units_distributed = serializers.IntegerField(read_only=True)
    total_units_remaining = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Production
        fields = '__all__'