import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  // Export to CSV
  exportToCSV(data: any[], filename: string, columns?: string[]) {
    if (!data || data.length === 0) {
      alert('No data to export!');
      return;
    }

    const csvContent = this.convertToCSV(data, columns);
    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // Export to Excel (CSV format compatible with Excel)
  exportToExcel(data: any[], filename: string, columns?: string[]) {
    if (!data || data.length === 0) {
      alert('No data to export!');
      return;
    }

    const csvContent = this.convertToCSV(data, columns);
    this.downloadFile(csvContent, `${filename}.xlsx`, 'application/vnd.ms-excel');
  }

  private convertToCSV(data: any[], columns?: string[]): string {
    if (!columns) {
      columns = Object.keys(data[0]);
    }

    // Header row
    let csv = columns.join(',') + '\n';

    // Data rows
    data.forEach(row => {
      const values = columns!.map(col => {
        const key = this.getKeyFromColumn(col);
        let value = row[key] || '';
        
        // Handle special characters and commas
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""'); // Escape quotes
          if (value.includes(',') || value.includes('\n') || value.includes('"')) {
            value = `"${value}"`;
          }
        }
        
        return value;
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  }

  private getKeyFromColumn(column: string): string {
    return column.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w]/g, '');
  }

  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  }

  // Specific export methods for different report types
  exportCashBalanceReport(data: any[], dateRange?: string) {
    const columns = ['Route', 'Agent', 'Date', 'Opening Balance', 'Sales Amount', 'Received Amount', 'Net Balance', 'Total Liters'];
    const filename = `Cash_Balance_Report_${dateRange || new Date().toISOString().split('T')[0]}`;
    this.exportToCSV(data, filename, columns);
  }

  exportProductionReport(data: any[], dateRange?: string) {
    const columns = ['Date', 'Route', 'Supplier', 'Product', 'Crates Produced', 'Crates Distributed', 'Crates Remaining', 'Notes'];
    const filename = `Production_Report_${dateRange || new Date().toISOString().split('T')[0]}`;
    this.exportToCSV(data, filename, columns);
  }

  exportBusinessPointReport(data: any[], dateRange?: string) {
    const columns = ['Business Point', 'Route', 'Date', 'Opening Balance', 'Sales Amount', 'Received Amount', 'Net Balance'];
    const filename = `Business_Point_Report_${dateRange || new Date().toISOString().split('T')[0]}`;
    this.exportToCSV(data, filename, columns);
  }

  exportAgentCashFlow(data: any[], dateRange?: string) {
    const columns = ['Route', 'Date', 'Inward Amount', 'Outward Amount', 'Closing Balance'];
    const filename = `Agent_Cash_Flow_${dateRange || new Date().toISOString().split('T')[0]}`;
    this.exportToCSV(data, filename, columns);
  }

  exportBankCashFlow(data: any[], dateRange?: string) {
    const columns = ['Date', 'Credit Amount', 'Debit Amount', 'Description', 'Net Amount'];
    const filename = `Bank_Cash_Flow_${dateRange || new Date().toISOString().split('T')[0]}`;
    this.exportToCSV(data, filename, columns);
  }

  // Export with date range
  exportWithDateRange(data: any[], reportType: string, fromDate: string, toDate: string, format: 'csv' | 'excel' = 'csv') {
    const dateRange = `${fromDate}_to_${toDate}`;
    const filename = `${reportType}_${dateRange}`;
    
    if (format === 'excel') {
      this.exportToExcel(data, filename);
    } else {
      this.exportToCSV(data, filename);
    }
  }

  // Export all data summary
  exportSystemSummary(summaryData: any) {
    const data = [
      { Category: 'Routes', Count: summaryData.routes },
      { Category: 'Business Points', Count: summaryData.business_points },
      { Category: 'Suppliers', Count: summaryData.suppliers },
      { Category: 'Products', Count: summaryData.products },
      { Category: 'Route Rates', Count: summaryData.route_rates },
      { Category: 'Production Records', Count: summaryData.productions },
      { Category: 'Sales Records', Count: summaryData.daily_sales }
    ];
    
    const filename = `System_Summary_${new Date().toISOString().split('T')[0]}`;
    this.exportToCSV(data, filename, ['Category', 'Count']);
  }
}