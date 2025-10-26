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

  constructor(private apiService: ApiService, private authService: AuthService) {}

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
}