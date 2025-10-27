import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route, Supplier, Product, RouteRate, DailySales, AgentCashFlow, BankCashFlow, Production } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // Routes
  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(`${this.baseUrl}/routes/`);
  }

  createRoute(route: Route): Observable<Route> {
    return this.http.post<Route>(`${this.baseUrl}/routes/`, route);
  }

  // Suppliers
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/suppliers/`);
  }

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.baseUrl}/suppliers/`, supplier);
  }

  // Business Points
  getBusinessPoints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/business-points/`);
  }

  createBusinessPoint(businessPoint: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/business-points/`, businessPoint);
  }

  // Business Point Rates
  getBusinessPointRates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/business-point-rates/`);
  }

  createBusinessPointRate(rate: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/business-point-rates/`, rate);
  }

  // Delete methods
  deleteSupplier(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/suppliers/${id}/`);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}/`);
  }

  deleteRoute(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/routes/${id}/`);
  }

  deleteBusinessPoint(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/business-points/${id}/`);
  }

  deleteRouteRate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/route-rates/${id}/`);
  }

  deleteBusinessPointRate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/business-point-rates/${id}/`);
  }

  // Update methods
  updateSupplier(id: number, supplier: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/suppliers/${id}/`, supplier);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}/`, product);
  }

  updateRoute(id: number, route: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/routes/${id}/`, route);
  }

  updateBusinessPoint(id: number, bp: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/business-points/${id}/`, bp);
  }

  updateBusinessPointRate(id: number, rate: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/business-point-rates/${id}/`, rate);
  }

  // Products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products/`, product);
  }

  // Route Rates
  getRouteRates(): Observable<RouteRate[]> {
    return this.http.get<RouteRate[]>(`${this.baseUrl}/route-rates/`);
  }

  createRouteRate(routeRate: RouteRate): Observable<RouteRate> {
    return this.http.post<RouteRate>(`${this.baseUrl}/route-rates/`, routeRate);
  }

  updateRouteRate(id: number, routeRate: RouteRate): Observable<RouteRate> {
    return this.http.put<RouteRate>(`${this.baseUrl}/route-rates/${id}/`, routeRate);
  }

  // Daily Sales
  getDailySales(): Observable<DailySales[]> {
    return this.http.get<DailySales[]>(`${this.baseUrl}/daily-sales/`);
  }

  createDailySales(sales: DailySales): Observable<DailySales> {
    return this.http.post<DailySales>(`${this.baseUrl}/daily-sales/`, sales);
  }

  updateDailySales(id: number, sales: DailySales): Observable<DailySales> {
    return this.http.put<DailySales>(`${this.baseUrl}/daily-sales/${id}/`, sales);
  }

  getCashBalanceReport(date?: string, routeId?: number): Observable<any[]> {
    let params = '';
    if (date) params += `date=${date}&`;
    if (routeId) params += `route_id=${routeId}&`;
    return this.http.get<any[]>(`${this.baseUrl}/daily-sales/cash_balance_report/?${params}`);
  }

  // Agent Cash Flow
  getAgentCashFlow(): Observable<AgentCashFlow[]> {
    return this.http.get<AgentCashFlow[]>(`${this.baseUrl}/agent-cashflow/`);
  }

  createAgentCashFlow(flow: AgentCashFlow): Observable<AgentCashFlow> {
    return this.http.post<AgentCashFlow>(`${this.baseUrl}/agent-cashflow/`, flow);
  }

  getAgentCashFlowStatement(date?: string, routeId?: number): Observable<any> {
    let params = '';
    if (date) params += `date=${date}&`;
    if (routeId) params += `route_id=${routeId}&`;
    return this.http.get<any>(`${this.baseUrl}/agent-cashflow/statement/?${params}`);
  }

  // Bank Cash Flow
  getBankCashFlow(): Observable<BankCashFlow[]> {
    return this.http.get<BankCashFlow[]>(`${this.baseUrl}/bank-cashflow/`);
  }

  createBankCashFlow(flow: BankCashFlow): Observable<BankCashFlow> {
    return this.http.post<BankCashFlow>(`${this.baseUrl}/bank-cashflow/`, flow);
  }

  getBankCashFlowStatement(date?: string): Observable<any> {
    let params = date ? `date=${date}` : '';
    return this.http.get<any>(`${this.baseUrl}/bank-cashflow/statement/?${params}`);
  }

  getCashClosingBalance(date?: string): Observable<any> {
    let params = date ? `date=${date}` : '';
    return this.http.get<any>(`${this.baseUrl}/bank-cashflow/cash_closing_balance/?${params}`);
  }

  // Production methods
  getProductions(): Observable<Production[]> {
    return this.http.get<Production[]>(`${this.baseUrl}/production/`);
  }

  createProduction(production: Production): Observable<Production> {
    return this.http.post<Production>(`${this.baseUrl}/production/`, production);
  }

  updateProduction(id: number, production: Production): Observable<Production> {
    return this.http.put<Production>(`${this.baseUrl}/production/${id}/`, production);
  }

  deleteProduction(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/production/${id}/`);
  }

  getProductionSummary(date?: string, routeId?: number): Observable<any[]> {
    let params = '';
    if (date) params += `date=${date}&`;
    if (routeId) params += `route_id=${routeId}&`;
    return this.http.get<any[]>(`${this.baseUrl}/production/production_summary/?${params}`);
  }

  // Enhanced sales methods
  deleteDailySales(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/daily-sales/${id}/`);
  }

  // Business Point Daily Sales
  getBusinessPointDailySales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/business-point-daily-sales/`);
  }

  createBusinessPointDailySales(sales: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/business-point-daily-sales/`, sales);
  }

  updateBusinessPointDailySales(id: number, sales: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/business-point-daily-sales/${id}/`, sales);
  }

  deleteBusinessPointDailySales(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/business-point-daily-sales/${id}/`);
  }

  getBusinessPointCashBalanceReport(date?: string, businessPointId?: number): Observable<any[]> {
    let params = '';
    if (date) params += `date=${date}&`;
    if (businessPointId) params += `business_point_id=${businessPointId}&`;
    return this.http.get<any[]>(`${this.baseUrl}/business-point-daily-sales/cash_balance_report/?${params}`);
  }
}