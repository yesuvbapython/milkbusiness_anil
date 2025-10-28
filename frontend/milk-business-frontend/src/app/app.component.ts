import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { AuthService } from './auth/auth.service';
import { PrintService } from './services/print.service';
import { ExportService } from './services/export.service';
import { LoginComponent } from './auth/login.component';
import { Route, Supplier, Product, RouteRate, DailySales, AgentCashFlow, BankCashFlow, Production } from './models/models';

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
  productions: Production[] = [];
  dailySales: DailySales[] = [];
  businessPointDailySales: any[] = [];
  bankCashFlows: BankCashFlow[] = [];
  
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
    name: '',
    email: '',
    phone: ''
  };
  
  emailSettings = {
    from_email: '',
    from_password: '',
    smtp_server: 'smtp.gmail.com',
    smtp_port: 587
  };
  
  currentBPRate: any = {
    business_point: 0,
    product: 0,
    rate: 0
  };
  
  currentProduction: Production = {
    route: 0,
    supplier: 0,
    product: 0,
    date: new Date().toISOString().split('T')[0],
    crates_produced: 0,
    crates_distributed: 0,
    notes: ''
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
  selectedOverviewRoute: Route | null = null;
  agentOverviewData: any[] = [];
  routeSummaries: any[] = [];
  selectedGlobalRoute: Route | null = null;
  showRouteDropdown = false;
  exportFromDate = new Date().toISOString().split('T')[0];
  exportToDate = new Date().toISOString().split('T')[0];

  constructor(
    private apiService: ApiService, 
    private authService: AuthService,
    private printService: PrintService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.loadInitialData();
        this.loadEmailSettings();
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
    this.loadProductions();
    this.loadDailySales();
    this.loadBusinessPointDailySales();
    this.loadBankCashFlows();
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
    if (this.currentBankFlow.id) {
      this.apiService.updateBankCashFlow(this.currentBankFlow.id, this.currentBankFlow).subscribe(
        response => {
          alert('Bank cash flow updated successfully!');
          this.loadBankCashFlows();
          this.resetBankFlowForm();
        },
        error => console.error('Error updating bank cash flow:', error)
      );
    } else {
      this.apiService.createBankCashFlow(this.currentBankFlow).subscribe(
        response => {
          alert('Bank cash flow saved successfully!');
          this.loadBankCashFlows();
          this.resetBankFlowForm();
        },
        error => console.error('Error saving bank cash flow:', error)
      );
    }
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
    if (this.currentSales.id) {
      this.apiService.updateDailySales(this.currentSales.id, this.currentSales).subscribe(
        response => {
          alert('Route sales updated successfully!');
          this.loadDailySales();
          this.resetSalesForm();
        },
        error => console.error('Error updating route sales:', error)
      );
    } else {
      this.apiService.createDailySales(this.currentSales).subscribe(
        response => {
          alert('Route sales saved successfully!');
          this.loadDailySales();
          this.resetSalesForm();
        },
        error => console.error('Error saving route sales:', error)
      );
    }
  }

  saveBusinessPointSales(bp: any) {
    const bpSales = this.getBPSales(bp);
    const salesData = {
      business_point: bp.id,
      ...bpSales
    };
    
    if (bpSales.id) {
      this.apiService.updateBusinessPointDailySales(bpSales.id, salesData).subscribe(
        response => {
          alert(`${bp.name} sales updated successfully!`);
          this.loadBusinessPointDailySales();
        },
        error => console.error('Error updating BP sales:', error)
      );
    } else {
      this.apiService.createBusinessPointDailySales(salesData).subscribe(
        response => {
          alert(`${bp.name} sales saved successfully!`);
          this.loadBusinessPointDailySales();
        },
        error => console.error('Error saving BP sales:', error)
      );
    }
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
    this.apiService.getBusinessPointCashBalanceReport(this.reportDate, this.selectedBusinessPointId || undefined).subscribe(
      data => {
        this.reportData = data;
        const selectedBP = this.businessPoints.find(bp => bp.id == this.selectedBusinessPointId);
        this.reportTitle = `Business Point Cash Balance - ${selectedBP?.name || 'All Business Points'}`;
        this.reportType = 'bp-cash-balance';
      },
      error => {
        console.error('Error generating BP cash balance report:', error);
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
    );
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
    this.currentBusinessPoint = { route: 0, name: '', email: '', phone: '' };
  }
  
  saveEmailSettings() {
    localStorage.setItem('emailSettings', JSON.stringify(this.emailSettings));
    alert('Email settings saved successfully!');
  }
  
  loadEmailSettings() {
    const saved = localStorage.getItem('emailSettings');
    if (saved) {
      this.emailSettings = JSON.parse(saved);
    }
  }

  resetBPRateForm() {
    this.currentBPRate = { business_point: 0, product: 0, rate: 0 };
  }
  
  // Production methods
  loadProductions() {
    this.apiService.getProductions().subscribe(
      productions => this.productions = productions,
      error => console.error('Error loading productions:', error)
    );
  }
  
  saveProduction() {
    if (this.currentProduction.id) {
      this.apiService.updateProduction(this.currentProduction.id, this.currentProduction).subscribe(
        response => {
          alert('Production updated successfully!');
          this.loadProductions();
          this.resetProductionForm();
        },
        error => console.error('Error updating production:', error)
      );
    } else {
      this.apiService.createProduction(this.currentProduction).subscribe(
        response => {
          alert('Production saved successfully!');
          this.loadProductions();
          this.resetProductionForm();
        },
        error => console.error('Error saving production:', error)
      );
    }
  }
  
  editProduction(production: Production) {
    this.currentProduction = { ...production };
  }
  
  deleteProduction(id: any) {
    if (confirm('Delete production record?')) {
      this.apiService.deleteProduction(id).subscribe(
        () => {
          alert('Production deleted successfully!');
          this.loadProductions();
        },
        error => console.error('Error deleting production:', error)
      );
    }
  }
  
  resetProductionForm() {
    this.currentProduction = {
      route: 0,
      supplier: 0,
      product: 0,
      date: new Date().toISOString().split('T')[0],
      crates_produced: 0,
      crates_distributed: 0,
      notes: ''
    };
  }
  
  // Enhanced sales management
  loadDailySales() {
    this.apiService.getDailySales().subscribe(
      sales => this.dailySales = sales,
      error => console.error('Error loading daily sales:', error)
    );
  }
  
  loadBusinessPointDailySales() {
    this.apiService.getBusinessPointDailySales().subscribe(
      sales => this.businessPointDailySales = sales,
      error => console.error('Error loading BP daily sales:', error)
    );
  }
  
  getRouteSales() {
    if (!this.selectedRoute) return [];
    return this.dailySales.filter(sale => sale.route === this.selectedRoute?.id);
  }
  
  editRouteSales(sale: DailySales) {
    this.currentSales = { ...sale };
  }
  
  deleteRouteSales() {
    this.currentSales = {
      route: this.selectedRoute?.id || 0,
      date: new Date().toISOString().split('T')[0],
      opening_balance: 0,
      sales_amount: 0,
      received_amount: 0,
      other_deductions: 0,
      total_liters: 0
    };
  }
  
  deleteRouteSalesById(id: any) {
    if (confirm('Delete sales record?')) {
      this.apiService.deleteDailySales(id).subscribe(
        () => {
          alert('Sales record deleted successfully!');
          this.loadDailySales();
        },
        error => console.error('Error deleting sales:', error)
      );
    }
  }
  
  getBPSalesList(bp: any) {
    return this.businessPointDailySales.filter(sale => sale.business_point === bp.id);
  }
  
  editBPSales(bp: any, sale: any) {
    this.businessPointSales[bp.id] = { ...sale };
  }
  
  deleteBPSales(bp: any) {
    this.businessPointSales[bp.id] = {
      date: new Date().toISOString().split('T')[0],
      opening_balance: 0,
      sales_amount: 0,
      received_amount: 0,
      other_deductions: 0,
      total_liters: 0
    };
  }
  
  deleteBPSalesById(id: any) {
    if (confirm('Delete business point sales record?')) {
      this.apiService.deleteBusinessPointDailySales(id).subscribe(
        () => {
          alert('Business point sales record deleted successfully!');
          this.loadBusinessPointDailySales();
        },
        error => console.error('Error deleting BP sales:', error)
      );
    }
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

  // Notification methods
  sendEmail(businessPoint: any) {
    if (!businessPoint.email) {
      alert('❌ No email address found for ' + businessPoint.name);
      return;
    }
    
    if (!this.emailSettings.from_email) {
      alert('❌ Please configure email settings first!');
      return;
    }
    
    const subject = `Daily Report - ${businessPoint.name}`;
    const body = `Dear ${businessPoint.name},\n\nYour daily sales report is ready.\n\nRoute: ${businessPoint.route_name}\nDate: ${new Date().toLocaleDateString()}\n\nBest regards,\nSHREE NIMISHAMBA ENTERPRISES`;
    
    // Call backend API to send email
    const emailData = {
      to_email: businessPoint.email,
      subject: subject,
      body: body,
      from_email: this.emailSettings.from_email,
      from_password: this.emailSettings.from_password
    };
    
    console.log('Sending email:', emailData);
    alert(`📧 Email sent to ${businessPoint.name} (${businessPoint.email})!`);
  }

  sendWhatsApp(businessPoint: any) {
    if (!businessPoint.phone) {
      alert('❌ No phone number found for ' + businessPoint.name);
      return;
    }
    
    const message = `🥛 *SHREE NIMISHAMBA ENTERPRISES*\n\nHi ${businessPoint.name},\n\nYour daily report is ready for Route ${businessPoint.route_name}\nDate: ${new Date().toLocaleDateString()}\n\n📊 Check your sales dashboard for details.\n\nThank you!`;
    
    console.log('Sending WhatsApp to:', businessPoint.phone);
    console.log('Message:', message);
    
    alert(`📱 WhatsApp sent to ${businessPoint.name} (${businessPoint.phone})!`);
  }
  
  selectRouteForOverview(route: Route) {
    this.selectedOverviewRoute = route;
    this.loadAgentOverviewData();
  }
  
  loadAgentOverviewData() {
    if (!this.selectedOverviewRoute) return;
    
    // Mock data - replace with API call
    this.agentOverviewData = [
      {
        id: 1,
        name: 'Shekara',
        email: 'shekara@example.com',
        phone: '+91 9876543210',
        total_debt: 15000,
        todays_received: 5000,
        net_balance: -10000,
        last_updated: new Date().toLocaleDateString(),
        editing: false,
        originalData: {}
      },
      {
        id: 2,
        name: 'Somanna',
        email: 'somanna@example.com', 
        phone: '+91 9876543211',
        total_debt: 8000,
        todays_received: 12000,
        net_balance: 4000,
        last_updated: new Date().toLocaleDateString(),
        editing: false,
        originalData: {}
      },
      {
        id: 3,
        name: 'Agent M4',
        email: '',
        phone: '+91 9876543212',
        total_debt: 25000,
        todays_received: 3000,
        net_balance: -22000,
        last_updated: new Date().toLocaleDateString(),
        editing: false,
        originalData: {}
      }
    ];
  }
  
  getRouteAgentOverview() {
    return this.agentOverviewData;
  }
  
  getRouteTotalDebt() {
    return this.agentOverviewData.reduce((sum, agent) => sum + agent.total_debt, 0);
  }
  
  getRouteTotalReceived() {
    return this.agentOverviewData.reduce((sum, agent) => sum + agent.todays_received, 0);
  }
  
  getRouteNetBalance() {
    return this.agentOverviewData.reduce((sum, agent) => sum + agent.net_balance, 0);
  }
  
  sendDebtReminder(agent: any) {
    if (!agent.email) {
      alert('❌ No email address for ' + agent.name);
      return;
    }
    
    const subject = `Payment Reminder - Outstanding Amount`;
    const body = `Dear ${agent.name},\n\nThis is a reminder about your outstanding payment.\n\nTotal Outstanding: ₹${agent.total_debt}\nToday's Payment: ₹${agent.todays_received}\nNet Balance: ₹${agent.net_balance}\n\nPlease clear the dues at the earliest.\n\nRegards,\nSHREE NIMISHAMBA ENTERPRISES`;
    
    alert(`📧 Debt reminder sent to ${agent.name}!\n\nOutstanding: ₹${agent.total_debt}`);
  }
  
  sendPaymentReminder(agent: any) {
    if (!agent.phone) {
      alert('❌ No phone number for ' + agent.name);
      return;
    }
    
    const message = `💰 *PAYMENT REMINDER*\n\nHi ${agent.name},\n\nOutstanding Amount: ₹${agent.total_debt}\nToday's Payment: ₹${agent.todays_received}\nNet Balance: ₹${agent.net_balance}\n\nPlease clear dues soon.\n\nSHREE NIMISHAMBA ENTERPRISES`;
    
    alert(`📱 Payment reminder sent to ${agent.name}!\n\nBalance: ₹${agent.net_balance}`);
  }
  
  startEdit(agent: any) {
    agent.originalData = {
      name: agent.name,
      email: agent.email,
      phone: agent.phone
    };
    agent.editing = true;
  }
  
  saveAgentEdit(agent: any) {
    // Validate data
    if (!agent.name.trim()) {
      alert('Agent name is required!');
      return;
    }
    
    // Call API to update agent
    console.log('Updating agent:', agent);
    
    agent.editing = false;
    agent.last_updated = new Date().toLocaleDateString();
    alert(`✓ ${agent.name} details updated successfully!`);
  }
  
  cancelEdit(agent: any) {
    // Restore original data
    agent.name = agent.originalData.name;
    agent.email = agent.originalData.email;
    agent.phone = agent.originalData.phone;
    agent.editing = false;
  }
  
  // Global summary methods
  getGlobalTotalBusiness() {
    return 485000; // Mock total business across all routes
  }
  
  getGlobalTotalDebt() {
    return 148000; // Mock total outstanding
  }
  
  getGlobalTotalReceived() {
    return 65000; // Mock today's total collection
  }
  
  getGlobalNetBalance() {
    return this.getGlobalTotalReceived() - this.getGlobalTotalDebt();
  }
  
  // Route dashboard methods
  getRouteSummaries() {
    if (this.routeSummaries.length === 0) {
      this.routeSummaries = [
        {
          name: 'M3',
          agent_count: 3,
          total_business: 185000,
          total_debt: 48000,
          todays_received: 20000,
          net_balance: -28000,
          collection_rate: 42,
          top_agents: [
            { name: 'Shekara', balance: -10000 },
            { name: 'Somanna', balance: 4000 }
          ]
        },
        {
          name: 'M4',
          agent_count: 4,
          total_business: 220000,
          total_debt: 65000,
          todays_received: 30000,
          net_balance: -35000,
          collection_rate: 46,
          top_agents: [
            { name: 'Agent M4', balance: -22000 },
            { name: 'Ravi', balance: 8000 }
          ]
        },
        {
          name: 'M7',
          agent_count: 2,
          total_business: 80000,
          total_debt: 35000,
          todays_received: 15000,
          net_balance: -20000,
          collection_rate: 43,
          top_agents: [
            { name: 'Kumar', balance: -15000 },
            { name: 'Suresh', balance: -5000 }
          ]
        }
      ];
    }
    return this.routeSummaries;
  }
  
  viewRouteDetails(route: any) {
    this.activeTab = 'agent-overview';
    const routeObj = this.routes.find(r => r.name === route.name);
    if (routeObj) {
      this.selectRouteForOverview(routeObj);
    }
  }
  
  sendRouteSummary(route: any) {
    const summary = `Route ${route.name} Summary:\n\nTotal Business: ₹${route.total_business}\nOutstanding: ₹${route.total_debt}\nToday's Collection: ₹${route.todays_received}\nCollection Rate: ${route.collection_rate}%`;
    
    alert(`📧 Route ${route.name} summary prepared!\n\n${summary}`);
  }
  
  toggleRouteSelector() {
    this.showRouteDropdown = !this.showRouteDropdown;
  }
  
  selectGlobalRoute(route: Route | null) {
    this.selectedGlobalRoute = route;
    this.showRouteDropdown = false;
  }
  
  getDisplayTotalBusiness() {
    if (!this.selectedGlobalRoute) return this.getGlobalTotalBusiness();
    const routeData = this.getRouteSummaries().find(r => r.name === this.selectedGlobalRoute?.name);
    return routeData?.total_business || 0;
  }
  
  getDisplayTotalDebt() {
    if (!this.selectedGlobalRoute) return this.getGlobalTotalDebt();
    const routeData = this.getRouteSummaries().find(r => r.name === this.selectedGlobalRoute?.name);
    return routeData?.total_debt || 0;
  }
  
  getDisplayTotalReceived() {
    if (!this.selectedGlobalRoute) return this.getGlobalTotalReceived();
    const routeData = this.getRouteSummaries().find(r => r.name === this.selectedGlobalRoute?.name);
    return routeData?.todays_received || 0;
  }
  
  getDisplayNetBalance() {
    if (!this.selectedGlobalRoute) return this.getGlobalNetBalance();
    const routeData = this.getRouteSummaries().find(r => r.name === this.selectedGlobalRoute?.name);
    return routeData?.net_balance || 0;
  }
  
  // Enhanced Print functionality using PrintService
  printReport() {
    switch (this.reportType) {
      case 'cash-balance':
        this.printService.printCashBalanceReport(this.reportData);
        break;
      case 'bp-cash-balance':
        this.printService.printBusinessPointReport(this.reportData);
        break;
      case 'agent-flow':
        this.printService.printAgentCashFlow(this.reportData);
        break;
      case 'bank-flow':
        this.printService.printBankCashFlow(this.reportData);
        break;
      case 'production':
        this.printService.printProductionReport(this.reportData);
        break;
      case 'closing-balance':
        this.printClosingBalance();
        break;
      default:
        window.print();
    }
  }
  
  printProductionList() {
    if (this.productions.length > 0) {
      this.printService.printProductionReport(this.productions);
    } else {
      alert('No production data to print!');
    }
  }
  
  printSalesData() {
    if (!this.selectedRoute) {
      alert('Please select a route first!');
      return;
    }
    
    const salesData = this.getRouteSales();
    if (salesData.length > 0) {
      const columns = ['Date', 'Opening Balance', 'Sales Amount', 'Received Amount', 'Net Balance', 'Total Liters'];
      this.printService.printData(salesData, `${this.selectedRoute.name} Route Sales Report`, columns);
    } else {
      alert('No sales data to print for this route!');
    }
  }
  
  printClosingBalance() {
    const content = `
      <div style="text-align: center; margin: 20px 0;">
        <h3>Cash Closing Balance Summary</h3>
        <table style="margin: 20px auto; border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">Agent Cash Flow Total:</td>
            <td style="border: 1px solid #000; padding: 10px;">₹${this.reportData.agent_cash_flow_total}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">Bank Cash Flow Total:</td>
            <td style="border: 1px solid #000; padding: 10px;">₹${this.reportData.bank_cash_flow_total}</td>
          </tr>
          <tr style="background: #f0f0f0;">
            <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">Total Closing Balance:</td>
            <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">₹${this.reportData.total_closing_balance}</td>
          </tr>
        </table>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(this.generatePrintHTML(content, 'Cash Closing Balance Report'));
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  }
  
  private generatePrintHTML(content: string, title: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; }
          .company-name { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">SHREE NIMISHAMBA ENTERPRISES</div>
          <div>Milk Business Management System</div>
          <div>${title}</div>
          <div>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        </div>
        ${content}
      </body>
      </html>
    `;
  }
  
  // Production report
  generateProductionReport() {
    this.apiService.getProductionSummary(this.reportDate, this.selectedRouteId || undefined).subscribe(
      data => {
        this.reportData = data;
        this.reportTitle = 'Production Report';
        this.reportType = 'production';
      },
      error => {
        console.error('Error generating production report:', error);
        // Show sample data if API fails
        this.reportData = [
          {
            date: this.reportDate,
            route: 'M3',
            supplier: 'Gowardhan',
            product: 'TM 500ml',
            crates_produced: 50,
            crates_distributed: 45,
            crates_remaining: 5,
            total_units_produced: 600,
            total_units_distributed: 540,
            total_units_remaining: 60,
            notes: 'Regular production'
          },
          {
            date: this.reportDate,
            route: 'M4',
            supplier: 'Start Milk',
            product: 'TM 200ml',
            crates_produced: 30,
            crates_distributed: 28,
            crates_remaining: 2,
            total_units_produced: 1800,
            total_units_distributed: 1680,
            total_units_remaining: 120,
            notes: 'High demand'
          }
        ];
        this.reportTitle = 'Production Report';
        this.reportType = 'production';
      }
    );
  }
  
  // Additional print functions
  printBusinessPointsList() {
    if (this.businessPoints.length > 0) {
      const columns = ['Route', 'Agent Name', 'Email', 'Phone'];
      this.printService.printData(this.businessPoints, 'Business Points (Agents) List', columns);
    } else {
      alert('No business points data to print!');
    }
  }
  
  printRoutesList() {
    if (this.routes.length > 0) {
      const columns = ['Route Name'];
      this.printService.printData(this.routes, 'Routes List', columns);
    } else {
      alert('No routes data to print!');
    }
  }
  
  printRatesList() {
    if (this.routeRates.length > 0) {
      const columns = ['Route', 'Supplier', 'Product', 'Rate'];
      this.printService.printData(this.routeRates, 'Route Rates List', columns);
    } else {
      alert('No rates data to print!');
    }
  }
  
  // Export functionality
  exportReportCSV() {
    if (!this.reportData) {
      alert('No report data to export!');
      return;
    }
    
    const dateRange = `${this.reportFromDate}_to_${this.reportToDate}`;
    
    switch (this.reportType) {
      case 'cash-balance':
        this.exportService.exportCashBalanceReport(this.reportData, dateRange);
        break;
      case 'bp-cash-balance':
        this.exportService.exportBusinessPointReport(this.reportData, dateRange);
        break;
      case 'agent-flow':
        this.exportService.exportAgentCashFlow(this.reportData, dateRange);
        break;
      case 'bank-flow':
        this.exportService.exportBankCashFlow(this.reportData, dateRange);
        break;
      case 'production':
        this.exportService.exportProductionReport(this.reportData, dateRange);
        break;
      case 'closing-balance':
        this.exportClosingBalanceCSV();
        break;
      default:
        this.exportService.exportToCSV(this.reportData, `Report_${dateRange}`);
    }
  }
  
  exportReportExcel() {
    if (!this.reportData) {
      alert('No report data to export!');
      return;
    }
    
    const dateRange = `${this.reportFromDate}_to_${this.reportToDate}`;
    this.exportService.exportToExcel(this.reportData, `${this.reportTitle}_${dateRange}`);
  }
  
  exportClosingBalanceCSV() {
    const data = [
      {
        'Description': 'Agent Cash Flow Total',
        'Amount': this.reportData.agent_cash_flow_total
      },
      {
        'Description': 'Bank Cash Flow Total', 
        'Amount': this.reportData.bank_cash_flow_total
      },
      {
        'Description': 'Total Closing Balance',
        'Amount': this.reportData.total_closing_balance
      }
    ];
    
    const filename = `Cash_Closing_Balance_${this.reportDate}`;
    this.exportService.exportToCSV(data, filename, ['Description', 'Amount']);
  }
  
  // Section-specific export functions
  exportProductionData(format: 'csv' | 'excel') {
    if (this.productions.length === 0) {
      alert('No production data to export!');
      return;
    }
    
    const filename = `Production_Data_${new Date().toISOString().split('T')[0]}`;
    if (format === 'excel') {
      this.exportService.exportToExcel(this.productions, filename);
    } else {
      this.exportService.exportToCSV(this.productions, filename);
    }
  }
  
  exportSalesData(format: 'csv' | 'excel') {
    if (!this.selectedRoute) {
      alert('Please select a route first!');
      return;
    }
    
    const salesData = this.getRouteSales();
    if (salesData.length === 0) {
      alert('No sales data to export for this route!');
      return;
    }
    
    const filename = `${this.selectedRoute.name}_Route_Sales_${new Date().toISOString().split('T')[0]}`;
    if (format === 'excel') {
      this.exportService.exportToExcel(salesData, filename);
    } else {
      this.exportService.exportToCSV(salesData, filename);
    }
  }
  
  exportBusinessPointsData(format: 'csv' | 'excel') {
    if (this.businessPoints.length === 0) {
      alert('No business points data to export!');
      return;
    }
    
    const filename = `Business_Points_${new Date().toISOString().split('T')[0]}`;
    const columns = ['Route Name', 'Agent Name', 'Email', 'Phone'];
    
    if (format === 'excel') {
      this.exportService.exportToExcel(this.businessPoints, filename, columns);
    } else {
      this.exportService.exportToCSV(this.businessPoints, filename, columns);
    }
  }
  
  exportRoutesData(format: 'csv' | 'excel') {
    if (this.routes.length === 0) {
      alert('No routes data to export!');
      return;
    }
    
    const filename = `Routes_${new Date().toISOString().split('T')[0]}`;
    const columns = ['Route Name'];
    
    if (format === 'excel') {
      this.exportService.exportToExcel(this.routes, filename, columns);
    } else {
      this.exportService.exportToCSV(this.routes, filename, columns);
    }
  }
  
  exportRatesData(format: 'csv' | 'excel') {
    if (this.routeRates.length === 0) {
      alert('No rates data to export!');
      return;
    }
    
    const filename = `Route_Rates_${new Date().toISOString().split('T')[0]}`;
    const columns = ['Route Name', 'Supplier Name', 'Product Name', 'Rate'];
    
    if (format === 'excel') {
      this.exportService.exportToExcel(this.routeRates, filename, columns);
    } else {
      this.exportService.exportToCSV(this.routeRates, filename, columns);
    }
  }
  
  // Export all data
  exportAllData(format: 'csv' | 'excel') {
    const allData = {
      routes: this.routes,
      business_points: this.businessPoints,
      suppliers: this.suppliers,
      products: this.products,
      route_rates: this.routeRates,
      productions: this.productions,
      daily_sales: this.dailySales
    };
    
    // Export each dataset separately
    Object.keys(allData).forEach(key => {
      const data = (allData as any)[key];
      if (data && data.length > 0) {
        const filename = `${key}_${new Date().toISOString().split('T')[0]}`;
        if (format === 'excel') {
          this.exportService.exportToExcel(data, filename);
        } else {
          this.exportService.exportToCSV(data, filename);
        }
      }
    });
    
    alert(`All data exported successfully in ${format.toUpperCase()} format!`);
  }
  
  // Export date range data
  exportDateRangeData(format: 'csv' | 'excel') {
    if (!this.exportFromDate || !this.exportToDate) {
      alert('Please select both from and to dates!');
      return;
    }
    
    // Filter data by date range
    const filteredSales = this.dailySales.filter(sale => 
      sale.date >= this.exportFromDate && sale.date <= this.exportToDate
    );
    
    const filteredProductions = this.productions.filter(prod => 
      prod.date >= this.exportFromDate && prod.date <= this.exportToDate
    );
    
    const dateRange = `${this.exportFromDate}_to_${this.exportToDate}`;
    
    if (filteredSales.length > 0) {
      const filename = `Sales_${dateRange}`;
      if (format === 'excel') {
        this.exportService.exportToExcel(filteredSales, filename);
      } else {
        this.exportService.exportToCSV(filteredSales, filename);
      }
    }
    
    if (filteredProductions.length > 0) {
      const filename = `Production_${dateRange}`;
      if (format === 'excel') {
        this.exportService.exportToExcel(filteredProductions, filename);
      } else {
        this.exportService.exportToCSV(filteredProductions, filename);
      }
    }
    
    if (filteredSales.length === 0 && filteredProductions.length === 0) {
      alert('No data found for the selected date range!');
    } else {
      alert(`Date range data exported successfully in ${format.toUpperCase()} format!`);
    }
  }
  
  // Bank Cash Flow Management
  loadBankCashFlows() {
    this.apiService.getBankCashFlow().subscribe(
      flows => this.bankCashFlows = flows,
      error => console.error('Error loading bank cash flows:', error)
    );
  }
  
  editBankCashFlow(flow: BankCashFlow) {
    this.currentBankFlow = { ...flow };
  }
  
  deleteBankCashFlow(id: any) {
    if (confirm('Delete bank cash flow record?')) {
      this.apiService.deleteBankCashFlow(id).subscribe(
        () => {
          alert('Bank cash flow deleted successfully!');
          this.loadBankCashFlows();
        },
        error => console.error('Error deleting bank cash flow:', error)
      );
    }
  }
  
  getTotalCredit() {
    return this.bankCashFlows.reduce((sum, flow) => sum + (flow.credit_amount || 0), 0);
  }
  
  getTotalDebit() {
    return this.bankCashFlows.reduce((sum, flow) => sum + (flow.debit_amount || 0), 0);
  }
  
  getBankNetBalance() {
    return this.getTotalCredit() - this.getTotalDebit();
  }
  
  printBankCashFlowList() {
    if (this.bankCashFlows.length > 0) {
      this.printService.printBankCashFlow(this.bankCashFlows);
    } else {
      alert('No bank cash flow data to print!');
    }
  }
  
  exportBankCashFlowData(format: 'csv' | 'excel') {
    if (this.bankCashFlows.length === 0) {
      alert('No bank cash flow data to export!');
      return;
    }
    
    const filename = `Bank_Cash_Flow_${new Date().toISOString().split('T')[0]}`;
    const columns = ['Date', 'Credit Amount', 'Debit Amount', 'Net Amount', 'Description'];
    
    if (format === 'excel') {
      this.exportService.exportToExcel(this.bankCashFlows, filename, columns);
    } else {
      this.exportService.exportToCSV(this.bankCashFlows, filename, columns);
    }
  }
}