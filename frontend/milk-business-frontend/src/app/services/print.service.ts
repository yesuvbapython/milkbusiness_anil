import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  printElement(elementId: string, title: string = 'Report') {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found for printing');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    const printContent = this.generatePrintHTML(element.innerHTML, title);
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  printData(data: any[], title: string, columns: string[]) {
    const tableHTML = this.generateTableHTML(data, columns);
    const printContent = this.generatePrintHTML(tableHTML, title);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  private generateTableHTML(data: any[], columns: string[]): string {
    let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
    
    // Header
    html += '<thead><tr>';
    columns.forEach(col => {
      html += `<th style="border: 1px solid #000; padding: 8px; background: #f0f0f0; font-weight: bold;">${col}</th>`;
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    data.forEach(row => {
      html += '<tr>';
      columns.forEach(col => {
        const key = col.toLowerCase().replace(/\s+/g, '_');
        const value = row[key] || row[col] || 'N/A';
        html += `<td style="border: 1px solid #000; padding: 8px;">${value}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    
    return html;
  }

  private generatePrintHTML(content: string, title: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #000;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
          }
          .company-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .report-title {
            font-size: 16px;
            margin-bottom: 10px;
          }
          .report-date {
            font-size: 12px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 12px;
          }
          th {
            background: #f0f0f0;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            border-top: 1px solid #000;
            padding-top: 10px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">SHREE NIMISHAMBA ENTERPRISES</div>
          <div style="font-size: 14px;">Milk Business Management System</div>
          <div class="report-title">${title}</div>
          <div class="report-date">Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        </div>
        
        <div class="content">
          ${content}
        </div>
        
        <div class="footer">
          <div>Page 1 of 1</div>
          <div>© ${new Date().getFullYear()} Shree Nimishamba Enterprises</div>
        </div>
      </body>
      </html>
    `;
  }

  // Quick print methods for common reports
  printCashBalanceReport(data: any[]) {
    const columns = ['Route', 'Agent', 'Opening Balance', 'Sales Amount', 'Received Amount', 'Net Balance', 'Total Liters'];
    this.printData(data, 'Cash Balance Report', columns);
  }

  printProductionReport(data: any[]) {
    const columns = ['Date', 'Route', 'Supplier', 'Product', 'Produced', 'Distributed', 'Remaining'];
    this.printData(data, 'Production Report', columns);
  }

  printBusinessPointReport(data: any[]) {
    const columns = ['Business Point', 'Route', 'Opening Balance', 'Sales Amount', 'Received Amount', 'Net Balance'];
    this.printData(data, 'Business Point Cash Balance Report', columns);
  }

  printAgentCashFlow(data: any[]) {
    const columns = ['Route', 'Date', 'Inward Amount', 'Outward Amount', 'Closing Balance'];
    this.printData(data, 'Agent Cash Flow Statement', columns);
  }

  printBankCashFlow(data: any[]) {
    const columns = ['Date', 'Credit Amount', 'Debit Amount', 'Description', 'Net Amount'];
    this.printData(data, 'Bank Cash Flow Statement', columns);
  }
}