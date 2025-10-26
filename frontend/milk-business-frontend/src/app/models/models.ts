export interface Route {
  id?: number;
  name: string;
}

export interface Supplier {
  id?: number;
  name: string;
}

export interface BusinessPoint {
  id?: number;
  route: number;
  route_name?: string;
  name: string;
}

export interface Product {
  id?: number;
  supplier: number;
  supplier_name?: string;
  name: string;
  crate_multiplier?: number;
}

export interface RouteRate {
  id?: number;
  route: number;
  product: number;
  route_name?: string;
  supplier_name?: string;
  product_name?: string;
  rate: number;
}

export interface DailySales {
  id?: number;
  route: number;
  route_name?: string;
  agent_name?: string;
  date: string;
  opening_balance: number;
  sales_amount: number;
  received_amount: number;
  other_deductions: number;
  total_liters: number;
  total_amount?: number;
  net_balance?: number;
}

export interface AgentCashFlow {
  id?: number;
  route: number;
  route_name?: string;
  date: string;
  inward_amount: number;
  outward_amount: number;
  closing_balance?: number;
}

export interface BankCashFlow {
  id?: number;
  date: string;
  credit_amount: number;
  debit_amount: number;
  description: string;
  net_amount?: number;
}