from django.contrib import admin
from .models import (Route, BusinessPoint, Supplier, Product, RouteRate, BusinessPointRate,
                    CrateDistribution, BusinessPointCrateDistribution, DailySales, 
                    BusinessPointDailySales, AgentCashFlow, BankCashFlow)

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(BusinessPoint)
class BusinessPointAdmin(admin.ModelAdmin):
    list_display = ['name', 'route']

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'supplier', 'crate_multiplier']

@admin.register(RouteRate)
class RouteRateAdmin(admin.ModelAdmin):
    list_display = ['route', 'product', 'rate']

@admin.register(BusinessPointRate)
class BusinessPointRateAdmin(admin.ModelAdmin):
    list_display = ['business_point', 'product', 'rate']

@admin.register(CrateDistribution)
class CrateDistributionAdmin(admin.ModelAdmin):
    list_display = ['route', 'supplier', 'product', 'date', 'crates_given', 'total_units']

@admin.register(BusinessPointCrateDistribution)
class BusinessPointCrateDistributionAdmin(admin.ModelAdmin):
    list_display = ['business_point', 'supplier', 'product', 'date', 'crates_given', 'total_units']

@admin.register(DailySales)
class DailySalesAdmin(admin.ModelAdmin):
    list_display = ['route', 'date', 'sales_amount', 'received_amount', 'net_balance']

@admin.register(BusinessPointDailySales)
class BusinessPointDailySalesAdmin(admin.ModelAdmin):
    list_display = ['business_point', 'date', 'sales_amount', 'received_amount', 'net_balance']

@admin.register(AgentCashFlow)
class AgentCashFlowAdmin(admin.ModelAdmin):
    list_display = ['route', 'date', 'inward_amount', 'outward_amount', 'closing_balance']

@admin.register(BankCashFlow)
class BankCashFlowAdmin(admin.ModelAdmin):
    list_display = ['date', 'credit_amount', 'debit_amount', 'net_amount', 'description']