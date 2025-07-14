import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Shopping } from '../models/shopping.model';
import { ShoppingDetail } from '../models/shopping-detail.model';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportShoppingToPdf(shopping: Shopping, details: ShoppingDetail[]): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Encabezado
    doc.setFontSize(22);
    doc.text('BOLETA DE VENTA', pageWidth / 2, 20, { align: 'center' });
    
    // Logo o nombre de la empresa
    doc.setFontSize(16);
    doc.text('SISTEMA DE VENTAS', pageWidth / 2, 30, { align: 'center' });
    
    // Información de la boleta
    doc.setFontSize(12);
    doc.text('N° Boleta:', 20, 45);
    doc.text(`B-${String(shopping.id).padStart(6, '0')}`, 70, 45);
    doc.text('Fecha:', 20, 52);
    doc.text(`${new Date(shopping.shoppingDate).toLocaleDateString()}`, 70, 52);
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55);
    
    // Información del cliente
    doc.setFontSize(14);
    doc.text('DATOS DEL CLIENTE', 20, 65);
    doc.setFontSize(12);
    doc.text(`Nombre: ${shopping.client?.names || 'N/A'}`, 20, 75);
    doc.text(`DNI: ${shopping.client?.dni || 'N/A'}`, 20, 82);
    doc.text(`Dirección: ${shopping.client?.address || 'N/A'}`, 20, 89);
    
    // Línea separadora
    doc.line(20, 95, pageWidth - 20, 95);
    
    // Tabla de detalles
    const tableColumns = [
      { header: 'Producto', dataKey: 'product' },
      { header: 'Cantidad', dataKey: 'quantity' },
      { header: 'Precio Unit.', dataKey: 'unitPrice' },
      { header: 'Subtotal', dataKey: 'subtotal' }
    ];

    const tableRows = details.map(detail => ({
      product: detail.product?.productName || 'N/A',
      quantity: detail.quantity,
      unitPrice: `S/. ${detail.unitPrice.toFixed(2)}`,
      subtotal: `S/. ${(detail.quantity * detail.unitPrice).toFixed(2)}`
    }));

    autoTable(doc, {
      head: [tableColumns.map(col => col.header)],
      body: tableRows,
      startY: 100,
      theme: 'grid',
      headStyles: { 
        fillColor: [41, 128, 185], 
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 11
      },
      foot: [[
        { content: 'Total:', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 } },
        { content: `S/. ${shopping.total.toFixed(2)}`, styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 } }
      ]],
      margin: { left: 20, right: 20 }
    });

    // Pie de página
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    // Línea separadora
    doc.line(20, finalY + 10, pageWidth - 20, finalY + 10);
    
    // Información adicional
    doc.setFontSize(10);
    doc.text('Gracias por su preferencia', pageWidth / 2, finalY + 20, { align: 'center' });
    doc.text('Conserve su boleta para cualquier reclamo', pageWidth / 2, finalY + 27, { align: 'center' });
    
    // Información de la empresa
    doc.setFontSize(9);
    doc.text('SISTEMA DE VENTAS S.A.C', pageWidth / 2, finalY + 37, { align: 'center' });
    doc.text('RUC: 20123456789', pageWidth / 2, finalY + 43, { align: 'center' });
    doc.text('Av. Example 123 - Lima', pageWidth / 2, finalY + 49, { align: 'center' });
    
    // Guardar el PDF con nombre formateado
    const date = new Date(shopping.shoppingDate);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    doc.save(`boleta-${String(shopping.id).padStart(6, '0')}-${formattedDate}.pdf`);
  }

  // Exportar a Excel
  exportToExcel(data: any[], filename: string = 'export'): void {
    // Importar XLSX solo cuando se necesite
    import('xlsx').then(XLSX => {
      const worksheet: any = XLSX.utils.json_to_sheet(data);
      const workbook: any = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      // Buffer y descarga
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Crear elemento de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // Exportar a CSV
  exportToCSV(shoppings: Shopping[]): void {
    const replacer = (key: any, value: any) => value === null ? '' : value;
    const header = ['ID', 'Cliente', 'Fecha', 'Cantidad', 'Precio Unitario', 'Total', 'Estado'];
    const csv = shoppings.map(shopping => ({
      'ID': shopping.id,
      'Cliente': shopping.client.names,
      'Fecha': new Date(shopping.shoppingDate).toLocaleDateString(),
      'Cantidad': shopping.quantity,
      'Precio Unitario': shopping.unitPrice,
      'Total': shopping.total,
      'Estado': shopping.status === 'A' ? 'Activo' : 'Inactivo'
    }));

    const csvArray = [
      header.join(','),
      ...csv.map(row => header.map(fieldName => 
        JSON.stringify(row[fieldName as keyof typeof row], replacer)).join(','))
    ].join('\r\n');

    const data: Blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' });
    saveAs(data, 'shopping-list.csv');
  }
}
