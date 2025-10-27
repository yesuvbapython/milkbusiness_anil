from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (RouteViewSet, BusinessPointViewSet, SupplierViewSet, ProductViewSet, 
                   RouteRateViewSet, BusinessPointRateViewSet, CrateDistributionViewSet,
                   BusinessPointCrateDistributionViewSet, DailySalesViewSet, 
                   BusinessPointDailySalesViewSet, AgentCashFlowViewSet, BankCashFlowViewSet, ProductionViewSet)

router = DefaultRouter()
router.register(r'routes', RouteViewSet)
router.register(r'business-points', BusinessPointViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'products', ProductViewSet)
router.register(r'route-rates', RouteRateViewSet)
router.register(r'business-point-rates', BusinessPointRateViewSet)
router.register(r'crate-distribution', CrateDistributionViewSet)
router.register(r'business-point-crate-distribution', BusinessPointCrateDistributionViewSet)
router.register(r'daily-sales', DailySalesViewSet)
router.register(r'business-point-daily-sales', BusinessPointDailySalesViewSet)
router.register(r'agent-cashflow', AgentCashFlowViewSet)
router.register(r'bank-cashflow', BankCashFlowViewSet)
router.register(r'production', ProductionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]