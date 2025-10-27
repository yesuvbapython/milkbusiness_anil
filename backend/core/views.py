from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from datetime import datetime
from .models import (Route, BusinessPoint, Supplier, Product, RouteRate, BusinessPointRate,
                    CrateDistribution, BusinessPointCrateDistribution, DailySales, 
                    BusinessPointDailySales, AgentCashFlow, BankCashFlow, Production)
from .serializers import (RouteSerializer, BusinessPointSerializer, SupplierSerializer, ProductSerializer, 
                         RouteRateSerializer, BusinessPointRateSerializer, CrateDistributionSerializer,
                         BusinessPointCrateDistributionSerializer, DailySalesSerializer, 
                         BusinessPointDailySalesSerializer, AgentCashFlowSerializer, BankCashFlowSerializer, ProductionSerializer)

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class BusinessPointViewSet(viewsets.ModelViewSet):
    queryset = BusinessPoint.objects.all()
    serializer_class = BusinessPointSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class RouteRateViewSet(viewsets.ModelViewSet):
    queryset = RouteRate.objects.all()
    serializer_class = RouteRateSerializer

class BusinessPointRateViewSet(viewsets.ModelViewSet):
    queryset = BusinessPointRate.objects.all()
    serializer_class = BusinessPointRateSerializer

class CrateDistributionViewSet(viewsets.ModelViewSet):
    queryset = CrateDistribution.objects.all()
    serializer_class = CrateDistributionSerializer

class BusinessPointCrateDistributionViewSet(viewsets.ModelViewSet):
    queryset = BusinessPointCrateDistribution.objects.all()
    serializer_class = BusinessPointCrateDistributionSerializer

class DailySalesViewSet(viewsets.ModelViewSet):
    queryset = DailySales.objects.all()
    serializer_class = DailySalesSerializer
    
    @action(detail=False, methods=['get'])
    def cash_balance_report(self, request):
        date = request.query_params.get('date')
        route_id = request.query_params.get('route_id')
        
        queryset = self.queryset
        if date:
            queryset = queryset.filter(date=date)
        if route_id:
            queryset = queryset.filter(route_id=route_id)
            
        data = []
        for sale in queryset:
            data.append({
                'route': sale.route.name,
                'agent': sale.route.agent_name,
                'date': sale.date,
                'opening_balance': sale.opening_balance,
                'sales_amount': sale.sales_amount,
                'total_amount': sale.total_amount,
                'received_amount': sale.received_amount,
                'net_balance': sale.net_balance,
                'total_liters': sale.total_liters
            })
        
        return Response(data)

class BusinessPointDailySalesViewSet(viewsets.ModelViewSet):
    queryset = BusinessPointDailySales.objects.all()
    serializer_class = BusinessPointDailySalesSerializer
    
    @action(detail=False, methods=['get'])
    def cash_balance_report(self, request):
        date = request.query_params.get('date')
        business_point_id = request.query_params.get('business_point_id')
        
        queryset = self.queryset
        if date:
            queryset = queryset.filter(date=date)
        if business_point_id:
            queryset = queryset.filter(business_point_id=business_point_id)
            
        data = []
        for sale in queryset:
            data.append({
                'business_point': sale.business_point.name,
                'route': sale.business_point.route.name,
                'date': sale.date,
                'opening_balance': sale.opening_balance,
                'sales_amount': sale.sales_amount,
                'total_amount': sale.total_amount,
                'received_amount': sale.received_amount,
                'net_balance': sale.net_balance,
                'total_liters': sale.total_liters
            })
        
        return Response(data)

class AgentCashFlowViewSet(viewsets.ModelViewSet):
    queryset = AgentCashFlow.objects.all()
    serializer_class = AgentCashFlowSerializer
    
    @action(detail=False, methods=['get'])
    def statement(self, request):
        date = request.query_params.get('date')
        route_id = request.query_params.get('route_id')
        
        queryset = self.queryset
        if date:
            queryset = queryset.filter(date=date)
        if route_id:
            queryset = queryset.filter(route_id=route_id)
            
        data = []
        total_closing_balance = 0
        
        for flow in queryset:
            closing_balance = flow.closing_balance
            total_closing_balance += closing_balance
            data.append({
                'route': flow.route.name,
                'date': flow.date,
                'inward_amount': flow.inward_amount,
                'outward_amount': flow.outward_amount,
                'closing_balance': closing_balance
            })
        
        return Response({
            'flows': data,
            'total_closing_balance': total_closing_balance
        })

class BankCashFlowViewSet(viewsets.ModelViewSet):
    queryset = BankCashFlow.objects.all()
    serializer_class = BankCashFlowSerializer
    
    @action(detail=False, methods=['get'])
    def statement(self, request):
        date = request.query_params.get('date')
        
        queryset = self.queryset
        if date:
            queryset = queryset.filter(date=date)
            
        total_credit = queryset.aggregate(Sum('credit_amount'))['credit_amount__sum'] or 0
        total_debit = queryset.aggregate(Sum('debit_amount'))['debit_amount__sum'] or 0
        closing_balance = total_credit - total_debit
        
        return Response({
            'flows': BankCashFlowSerializer(queryset, many=True).data,
            'total_credit': total_credit,
            'total_debit': total_debit,
            'closing_balance': closing_balance
        })
    
    @action(detail=False, methods=['get'])
    def cash_closing_balance(self, request):
        date = request.query_params.get('date')
        
        # Agent cash flow total
        agent_flows = AgentCashFlow.objects.all()
        if date:
            agent_flows = agent_flows.filter(date=date)
        agent_total = sum(flow.closing_balance for flow in agent_flows)
        
        # Bank cash flow total
        bank_flows = self.queryset
        if date:
            bank_flows = bank_flows.filter(date=date)
        bank_credit = bank_flows.aggregate(Sum('credit_amount'))['credit_amount__sum'] or 0
        bank_debit = bank_flows.aggregate(Sum('debit_amount'))['debit_amount__sum'] or 0
        bank_total = bank_credit - bank_debit
        
        total_closing_balance = agent_total + bank_total
        
        return Response({
            'date': date,
            'agent_cash_flow_total': agent_total,
            'bank_cash_flow_total': bank_total,
            'total_closing_balance': total_closing_balance
        })

class ProductionViewSet(viewsets.ModelViewSet):
    queryset = Production.objects.all()
    serializer_class = ProductionSerializer
    
    @action(detail=False, methods=['get'])
    def production_summary(self, request):
        date = request.query_params.get('date')
        route_id = request.query_params.get('route_id')
        
        queryset = self.queryset
        if date:
            queryset = queryset.filter(date=date)
        if route_id:
            queryset = queryset.filter(route_id=route_id)
            
        data = []
        for production in queryset:
            data.append({
                'route': production.route.name,
                'supplier': production.supplier.name,
                'product': production.product.name,
                'date': production.date,
                'crates_produced': production.crates_produced,
                'crates_distributed': production.crates_distributed,
                'crates_remaining': production.crates_remaining,
                'total_units_produced': production.total_units_produced,
                'total_units_distributed': production.total_units_distributed,
                'total_units_remaining': production.total_units_remaining,
                'notes': production.notes
            })
        
        return Response(data)