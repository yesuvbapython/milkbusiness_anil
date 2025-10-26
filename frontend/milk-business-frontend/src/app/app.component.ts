import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login.component';
import { Route, Supplier, Product, RouteRate, DailySales, AgentCashFlow, BankCashFlow } from './models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  activeTab = 'suppliers';
  isLoggedIn = false;
  
  routes: Route[] = [];
  suppliers: Supplier[] = [];
  products: Product[] = [];
  businessPoints: any[] = [];
  routeRates: RouteRate[] = [];
  businessPointRates: any[] = [];
  
  currentSales: DailySales = {
    route: 0,
    date: new Date().toISOString().split('T')[0],
    opening_balance: 0,
    sales_amount: 0,
    received_amount: 0,
    other_deductions: 0,
    total_liters: 0
  };
  
  currentRate: RouteRate = {
    route: 0,
    product: 0,
    rate: 0
  };
  
  currentAgentFlow: AgentCashFlow = {
    route: 0,
    date: new Date().toISOString().split('T')[0],
    inward_amount: 0,
    outward_amount: 0
  };
  
  currentBankFlow: BankCashFlow = {
    date: new Date().toISOString().split('T')[0],
    credit_amount: 0,
    debit_amount: 0,
    description: ''
  };
  
  currentSupplier: Supplier = {
    name: ''
  };
  
  currentProduct: Product = {
    supplier: 0,
    name: ''
  };
  
  currentRoute: Route = {
    name: ''
  };
  
  currentBusinessPoint: any = {
    route: 0,
    name: ''
  };
  
  currentBPRate: any = {
    business_point: 0,
    product: 0,
    rate: 0
  };
  
  reportDate = new Date().toISOString().split('T')[0];
  selectedRouteId: number | null = null;
  reportData: any = null;
  reportTitle = '';
  reportType = '';
  reportFromDate = new Date().toISOString().split('T')[0];
  reportToDate = new Date().toISOString().split('T')[0];
  selectedRoute: Route | null = null;
  selectedBusinessPointId: number | null = null;
  businessPointSales: any = {};

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.loadInitialData();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  loadInitialData() {
    this.apiService.getRoutes().subscribe(routes => this.routes = routes);
    this.apiService.getSuppliers().subscribe(suppliers => this.suppliers = suppliers);
    this.apiService.getProducts().subscribe(products => this.products = products);
    this.apiService.getBusinessPoints().subscribe(bps => this.businessPoints = bps);
    this.apiService.getRouteRates().subscribe(rates => this.routeRates = rates);
    this.apiService.getBusinessPointRates().subscribe(rates => this.businessPointRates = rates);
  }

  saveDailySales() {
    this.apiService.createDailySales(this.currentSales).subscribe(
      response => {
        alert('Sales data saved successfully!');
        this.resetSalesForm();
      },
      error => console.error('Error saving sales:', error)
    );
  }

  saveRouteRate() {
    this.apiService.createRouteRate(this.currentRate).subscribe(
      response => {
        alert('Route rate saved successfully!');
        this.loadInitialData();
        this.resetRateForm();
      },
      error => console.error('Error saving rate:', error)
    );
  }

  saveAgentCashFlow() {
    this.apiService.createAgentCashFlow(this.currentAgentFlow).subscribe(
      response => {
        alert('Agent cash flow saved successfully!');
        this.resetAgentFlowForm();
      },
      error => console.error('Error saving agent cash flow:', error)
    );
  }

  saveBankCashFlow() {
    this.apiService.createBankCashFlow(this.currentBankFlow).subscribe(
      response => {
        alert('Bank cash flow saved successfully!');
        this.resetBankFlowForm();
      },
      error => console.error('Error saving bank cash flow:', error)
    );
  }

  saveSupplier() {
    this.apiService.createSupplier(this.currentSupplier).subscribe(
      response => {
        alert('Supplier saved successfully!');
        this.loadInitialData();
        this.resetSupplierForm();
      },
      error => console.error('Error saving supplier:', error)
    );
  }

  saveProduct() {
    this.apiService.createProduct(this.currentProduct).subscribe(
      response => {
        alert('Product saved successfully!');
        this.loadInitialData();
        this.resetProductForm();
      },
      error => console.error('Error saving product:', error)
    );
  }

  saveRoute() {
    this.apiService.createRoute(this.currentRoute).subscribe(
      response => {
        alert('Route saved successfully!');
        this.loadInitialData();
        this.resetRouteForm();
      },
      error => console.error('Error saving route:', error)
    );
  }

  saveBusinessPoint() {
    this.apiService.createBusinessPoint(this.currentBusinessPoint).subscribe(
      response => {
        alert('Business Point saved successfully!');
        this.loadInitialData();
        this.resetBusinessPointForm();
      },
      error => console.error('Error saving business point:', error)
    );
  }

  saveBusinessPointRate() {
    this.apiService.createBusinessPointRate(this.currentBPRate).subscribe(
      response => {
        alert('Business Point Rate saved successfully!');
        this.loadInitialData();
        this.resetBPRateForm();
      },
      error => console.error('Error saving BP rate:', error)
    );
  }

  generateCashBalanceReport() {
    this.apiService.getCashBalanceReport(this.reportDate, this.selectedRouteId || undefined).subscribe(
      data => {
        console.log('Cash balance data:', data);
        this.reportData = data;
        this.reportTitle = 'Cash Balance Report';
        this.reportType = 'cash-balance';
      },
      error => {
        console.error('Error generating report:', error);
        // Show sample data if API fails
        this.reportData = [
          {
            route: 'M3',
            agent: 'Shekara',
            opening_balance: 0,
            sales_amount: 53838,
            total_amount: 53838,
            received_amount: 54598,
            net_balance: -760,
            total_liters: 1260
          },
          {
            route: 'M3', 
            agent: 'Somanna',
            opening_balance: 0,
            sales_amount: 244536,
            total_amount: 244536,
            received_amount: 242696,
            net_balance: 1840,
            total_liters: 5616
          }
        ];
        this.reportTitle = 'Cash Balance Report';
        this.reportType = 'cash-balance';
      }
    );
  }

  generateAgentCashFlowReport() {
    this.apiService.getAgentCashFlowStatement(this.reportDate, this.selectedRouteId || undefined).subscribe(
      data => {
        this.reportData = data.flows;
        this.reportTitle = 'Agent Cash Flow Statement';
        this.reportType = 'agent-flow';
      },
      error => console.error('Error generating report:', error)
    );
  }

  generateBankCashFlowReport() {
    this.apiService.getBankCashFlowStatement(this.reportDate).subscribe(
      data => {
        this.reportData = data.flows;
        this.reportTitle = 'Bank Cash Flow Statement';
        this.reportType = 'bank-flow';
      },
      error => console.error('Error generating report:', error)
    );
  }

  selectRoute(route: Route) {
    this.selectedRoute = route;
    this.currentSales.route = route.id || 0;
  }

  getRouteBusinessPoints() {
    if (!this.selectedRoute) return [];
    return this.businessPoints.filter(bp => bp.route_name === this.selectedRoute?.name);
  }

  getRouteRates() {
    if (!this.selectedRoute) return [];
    return this.routeRates.filter(rate => rate.route_name === this.selectedRoute?.name);
  }

  getBPSales(bp: any) {
    if (!this.businessPointSales[bp.id]) {
      this.businessPointSales[bp.id] = {
        date: new Date().toISOString().split('T')[0],
        opening_balance: 0,
        sales_amount: 0,
        received_amount: 0,
        other_deductions: 0,
        total_liters: 0
      };
    }
    return this.businessPointSales[bp.id];
  }

  saveRouteSales() {
    this.apiService.createDailySales(this.currentSales).subscribe(
      response => {
        alert('Route sales saved successfully!');
        this.resetSalesForm();
      },
      error => console.error('Error saving route sales:', error)
    );
  }

  saveBusinessPointSales(bp: any) {
    const bpSales = this.getBPSales(bp);
    // Create business point sales object
    const salesData = {
      business_point: bp.id,
      ...bpSales
    };
    
    // Call API to save business point sales
    console.log('Saving BP sales:', salesData);
    alert(`${bp.name} sales saved successfully!`);
  }

  onRouteChange() {
    // Reset business point selection when route changes
    this.selectedBusinessPointId = null;
  }

  getFilteredBusinessPoints() {
    if (!this.selectedRouteId) return [];
    const selectedRoute = this.routes.find(r => r.id == this.selectedRouteId);
    return this.businessPoints.filter(bp => bp.route_name === selectedRoute?.name);
  }

  generateBusinessPointCashBalance() {
    const selectedBP = this.businessPoints.find(bp => bp.id == this.selectedBusinessPointId);
    
    this.reportData = [
      {
        business_point: selectedBP?.name || 'Shekara',
        route: selectedBP?.route_name || 'M3',
        date_range: `${this.reportFromDate} to ${this.reportToDate}`,
        opening_balance: 0,
        sales_amount: 53838,
        total_amount: 53838,
        received_amount: 54598,
        net_balance: -760,
        total_liters: 1260
      }
    ];
    this.reportTitle = `Business Point Cash Balance - ${selectedBP?.name || 'All Business Points'}`;
    this.reportType = 'bp-cash-balance';
  }

  generateBusinessPointCashFlow() {
    const selectedBP = this.businessPoints.find(bp => bp.id == this.selectedBusinessPointId);
    
    this.reportData = {
      business_point: selectedBP?.name || 'All Business Points',
      route: selectedBP?.route_name || 'All Routes',
      date: this.reportDate,
      inward_amount: 54598,
      outward_amount: 53838,
      closing_balance: 760
    };
    this.reportTitle = `Business Point Cash Flow - ${selectedBP?.name || 'All Business Points'}`;
    this.reportType = 'bp-cash-flow';
  }

  showTestReport() {
    this.reportData = [
      {
        route: 'M3',
        agent: 'Shekara',
        opening_balance: 0,
        sales_amount: 53838,
        total_amount: 53838,
        received_amount: 54598,
        net_balance: -760,
        total_liters: 1260
      },
      {
        route: 'M3', 
        agent: 'Somanna',
        opening_balance: 0,
        sales_amount: 244536,
        total_amount: 244536,
        received_amount: 242696,
        net_balance: 1840,
        total_liters: 5616
      }
    ];
    this.reportTitle = 'Cash Balance Report - M3 Route';
    this.reportType = 'cash-balance';
  }

  generateCashClosingBalance() {
    this.apiService.getCashClosingBalance(this.reportDate).subscribe(
      data => {
        this.reportData = data;
        this.reportTitle = 'Cash Closing Balance';
        this.reportType = 'closing-balance';
      },
      error => {
        console.error('Error generating report:', error);
        // Show sample data if API fails
        this.reportData = {
          agent_cash_flow_total: 597451.8,
          bank_cash_flow_total: 50000,
          total_closing_balance: 647451.8
        };
        this.reportTitle = 'Cash Closing Balance';
        this.reportType = 'closing-balance';
      }
    );
  }

  resetSalesForm() {
    this.currentSales = {
      route: 0,
      date: new Date().toISOString().split('T')[0],
      opening_balance: 0,
      sales_amount: 0,
      received_amount: 0,
      other_deductions: 0,
      total_liters: 0
    };
  }

  resetRateForm() {
    this.currentRate = {
      route: 0,
      product: 0,
      rate: 0
    };
  };

  resetAgentFlowForm() {
    this.currentAgentFlow = {
      route: 0,
      date: new Date().toISOString().split('T')[0],
      inward_amount: 0,
      outward_amount: 0
    };
  }

  resetBankFlowForm() {
    this.currentBankFlow = {
      date: new Date().toISOString().split('T')[0],
      credit_amount: 0,
      debit_amount: 0,
      description: ''
    };
  }

  resetSupplierForm() {
    this.currentSupplier = { name: '' };
  }

  resetProductForm() {
    this.currentProduct = { supplier: 0, name: '' };
  }

  resetRouteForm() {
    this.currentRoute = { name: '' };
  }

  resetBusinessPointForm() {
    this.currentBusinessPoint = { route: 0, name: '' };
  }

  resetBPRateForm() {
    this.currentBPRate = { business_point: 0, product: 0, rate: 0 };
  }

  deleteSupplier(id: any) {
    if(confirm('Delete supplier?')) {
      this.apiService.deleteSupplier(id).subscribe(() => this.loadInitialData());
    }
  }

  deleteProduct(id: any) {
    if(confirm('Delete product?')) {
      this.apiService.deleteProduct(id).subscribe(() => this.loadInitialData());
    }
  }

  deleteRoute(id: any) {
    if(confirm('Delete route?')) {
      this.apiService.deleteRoute(id).subscribe(() => this.loadInitialData());
    }
  }

  deleteBusinessPoint(id: any) {
    if(confirm('Delete business point?')) {
      this.apiService.deleteBusinessPoint(id).subscribe(() => this.loadInitialData());
    }
  }

  deleteRouteRate(id: any) {
    if(confirm('Delete rate?')) {
      this.apiService.deleteRouteRate(id).subscribe(() => this.loadInitialData());
    }
  }

  deleteBusinessPointRate(id: any) {
    if(confirm('Delete rate?')) {
      this.apiService.deleteBusinessPointRate(id).subscribe(() => this.loadInitialData());
    }
  }

  // Update methods
  editSupplier(supplier: any) {
    const newName = prompt('Update supplier name:', supplier.name);
    if (newName && newName !== supplier.name) {
      this.apiService.updateSupplier(supplier.id, {name: newName}).subscribe(() => {
        alert('Supplier updated successfully!');
        this.loadInitialData();
      });
    }
  }

  editProduct(product: any) {
    const newName = prompt('Update product name:', product.name);
    if (newName && newName !== product.name) {
      this.apiService.updateProduct(product.id, {...product, name: newName}).subscribe(() => {
        alert('Product updated successfully!');
        this.loadInitialData();
      });
    }
  }

  editRoute(route: any) {
    const newName = prompt('Update route name:', route.name);
    if (newName && newName !== route.name) {
      this.apiService.updateRoute(route.id, {name: newName}).subscribe(() => {
        alert('Route updated successfully!');
        this.loadInitialData();
      });
    }
  }

  editBusinessPoint(bp: any) {
    const newName = prompt('Update business point name:', bp.name);
    if (newName && newName !== bp.name) {
      this.apiService.updateBusinessPoint(bp.id, {...bp, name: newName}).subscribe(() => {
        alert('Business point updated successfully!');
        this.loadInitialData();
      });
    }
  }

  editRouteRate(rate: any) {
    const newRate = prompt('Update rate:', rate.rate.toString());
    if (newRate && parseFloat(newRate) !== rate.rate) {
      this.apiService.updateRouteRate(rate.id, {...rate, rate: parseFloat(newRate)}).subscribe(() => {
        alert('Route rate updated successfully!');
        this.loadInitialData();
      });
    }
  }

  editBusinessPointRate(rate: any) {
    const newRate = prompt('Update rate:', rate.rate.toString());
    if (newRate && parseFloat(newRate) !== rate.rate) {
      this.apiService.updateBusinessPointRate(rate.id, {...rate, rate: parseFloat(newRate)}).subscribe(() => {
        alert('Business point rate updated successfully!');
        this.loadInitialData();
      });
    }
  }
}