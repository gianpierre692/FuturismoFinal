import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

class UniversalExportService {
  // Excel Export Methods
  exportToExcel(data, filename = 'export', sheetName = 'Datos') {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      
      // Auto-size columns
      const colWidths = this.calculateColumnWidths(data);
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      // Generate buffer and save
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${filename}_${this.getCurrentDate()}.xlsx`);
      
      return { success: true, message: 'Archivo Excel exportado correctamente' };
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      return { success: false, error: error.message };
    }
  }

  exportMultiSheetExcel(sheetsData, filename = 'export') {
    try {
      const workbook = XLSX.utils.book_new();
      
      sheetsData.forEach(({ data, sheetName }) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const colWidths = this.calculateColumnWidths(data);
        worksheet['!cols'] = colWidths;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${filename}_${this.getCurrentDate()}.xlsx`);
      
      return { success: true, message: 'Archivo Excel multi-hoja exportado correctamente' };
    } catch (error) {
      console.error('Error exporting multi-sheet Excel:', error);
      return { success: false, error: error.message };
    }
  }

  // Excel Import Methods
  importFromExcel(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const result = {};
            workbook.SheetNames.forEach(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              result[sheetName] = jsonData;
            });
            
            resolve({ success: true, data: result, message: 'Archivo importado correctamente' });
          } catch (parseError) {
            reject({ success: false, error: 'Error al procesar el archivo Excel' });
          }
        };
        reader.onerror = () => reject({ success: false, error: 'Error al leer el archivo' });
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject({ success: false, error: error.message });
      }
    });
  }

  // PDF Export Methods
  exportToPDF(data, options = {}) {
    try {
      const {
        filename = 'export',
        title = 'Reporte de Datos',
        orientation = 'portrait',
        format = 'a4',
        columns = null,
        showHeader = true,
        showFooter = true
      } = options;

      const doc = new jsPDF(orientation, 'mm', format);
      
      // Header
      if (showHeader) {
        this.addPDFHeader(doc, title);
      }
      
      // Prepare columns and data
      const tableColumns = columns || this.generateColumnsFromData(data);
      const tableData = this.prepareTableData(data, tableColumns);
      
      // Add table
      doc.autoTable({
        head: [tableColumns.map(col => col.title || col.header || col)],
        body: tableData,
        startY: showHeader ? 40 : 20,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246], // Blue
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Light gray
        },
        margin: { top: 20, right: 14, bottom: 20, left: 14 },
      });
      
      // Footer
      if (showFooter) {
        this.addPDFFooter(doc);
      }
      
      doc.save(`${filename}_${this.getCurrentDate()}.pdf`);
      
      return { success: true, message: 'Archivo PDF exportado correctamente' };
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // Statistics Export Methods
  exportUsersToExcel(users) {
    const processedUsers = users.map(user => ({
      'ID': user.id,
      'Nombre': `${user.firstName} ${user.lastName}`,
      'Email': user.email,
      'Teléfono': user.phone || 'N/A',
      'Rol': user.role,
      'Estado': user.status === 'activo' ? 'Activo' : 'Inactivo',
      'Empresa': user.company || 'N/A',
      'Último Login': user.lastLogin ? new Date(user.lastLogin).toLocaleString('es-PE') : 'Nunca',
      'Fecha Creación': new Date(user.createdAt).toLocaleString('es-PE'),
      'Tipo Guía': user.guideType || 'N/A',
      'RUC': user.ruc || 'N/A'
    }));
    
    return this.exportToExcel(processedUsers, 'usuarios', 'Usuarios');
  }

  exportUsersToPDF(users) {
    const processedUsers = users.map(user => [
      user.id,
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.role,
      user.status === 'activo' ? 'Activo' : 'Inactivo',
      user.company || 'N/A',
      user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-PE') : 'Nunca'
    ]);

    const columns = [
      'ID', 'Nombre', 'Email', 'Rol', 'Estado', 'Empresa', 'Último Login'
    ];

    return this.exportToPDF(processedUsers, {
      filename: 'usuarios',
      title: 'Reporte de Usuarios',
      columns: columns.map(col => ({ header: col }))
    });
  }

  exportReservationsToExcel(reservations) {
    const processedReservations = reservations.map(reservation => ({
      'ID': reservation.id,
      'Cliente': reservation.clientName,
      'Email': reservation.clientEmail,
      'Teléfono': reservation.clientPhone || 'N/A',
      'Servicio': reservation.serviceName,
      'Fecha': new Date(reservation.date).toLocaleDateString('es-PE'),
      'Hora': reservation.time,
      'Personas': reservation.participants,
      'Estado': reservation.status,
      'Precio': `S/ ${reservation.price}`,
      'Guía Asignado': reservation.assignedGuide || 'Sin asignar',
      'Agencia': reservation.agency || 'Directo',
      'Fecha Creación': new Date(reservation.createdAt).toLocaleString('es-PE'),
      'Observaciones': reservation.notes || 'Ninguna'
    }));
    
    return this.exportToExcel(processedReservations, 'reservaciones', 'Reservaciones');
  }

  exportReservationsToPDF(reservations) {
    const processedReservations = reservations.map(reservation => [
      reservation.id,
      reservation.clientName,
      reservation.serviceName,
      new Date(reservation.date).toLocaleDateString('es-PE'),
      reservation.participants,
      reservation.status,
      `S/ ${reservation.price}`,
      reservation.assignedGuide || 'Sin asignar'
    ]);

    const columns = [
      'ID', 'Cliente', 'Servicio', 'Fecha', 'Personas', 'Estado', 'Precio', 'Guía'
    ];

    return this.exportToPDF(processedReservations, {
      filename: 'reservaciones',
      title: 'Reporte de Reservaciones',
      columns: columns.map(col => ({ header: col }))
    });
  }

  exportGuidesToExcel(guides) {
    const processedGuides = guides.map(guide => ({
      'ID': guide.id,
      'Nombre': `${guide.firstName} ${guide.lastName}`,
      'Email': guide.email,
      'Teléfono': guide.phone || 'N/A',
      'Tipo': guide.guideType,
      'Estado': guide.status === 'activo' ? 'Activo' : 'Inactivo',
      'Especialidades': guide.specialties ? guide.specialties.join(', ') : 'N/A',
      'Idiomas': guide.languages ? guide.languages.join(', ') : 'N/A',
      'Calificación': guide.rating || 'N/A',
      'Tours Completados': guide.completedTours || 0,
      'Disponible': guide.available ? 'Sí' : 'No',
      'Fecha Registro': new Date(guide.createdAt).toLocaleString('es-PE')
    }));
    
    return this.exportToExcel(processedGuides, 'guias', 'Guías');
  }

  exportGuidesToPDF(guides) {
    const processedGuides = guides.map(guide => [
      guide.id,
      `${guide.firstName} ${guide.lastName}`,
      guide.email,
      guide.guideType,
      guide.status === 'activo' ? 'Activo' : 'Inactivo',
      guide.specialties ? guide.specialties.slice(0, 2).join(', ') : 'N/A',
      guide.rating || 'N/A',
      guide.completedTours || 0
    ]);

    const columns = [
      'ID', 'Nombre', 'Email', 'Tipo', 'Estado', 'Especialidades', 'Rating', 'Tours'
    ];

    return this.exportToPDF(processedGuides, {
      filename: 'guias',
      title: 'Reporte de Guías',
      columns: columns.map(col => ({ header: col }))
    });
  }

  // Utility Methods
  calculateColumnWidths(data) {
    if (!data || data.length === 0) return [];
    
    const keys = Object.keys(data[0]);
    return keys.map(key => {
      const maxLength = Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      );
      return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
    });
  }

  generateColumnsFromData(data) {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }

  prepareTableData(data, columns) {
    return data.map(row => 
      columns.map(col => {
        const key = col.dataKey || col.key || col;
        return String(row[key] || '');
      })
    );
  }

  addPDFHeader(doc, title) {
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(title, 14, 25);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, 14, 32);
    doc.text('Futurismo Tours - Sistema de Gestión', 14, 37);
  }

  addPDFFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      
      const pageHeight = doc.internal.pageSize.height;
      doc.text(`Página ${i} de ${pageCount}`, 14, pageHeight - 10);
      doc.text(`Futurismo Tours © ${new Date().getFullYear()}`, doc.internal.pageSize.width - 50, pageHeight - 10);
    }
  }

  getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0].replace(/-/g, '');
  }

  // Template Methods for different data types
  getUserExportTemplate() {
    return {
      'ID': '',
      'Nombre': '',
      'Apellido': '',
      'Email': '',
      'Teléfono': '',
      'Rol': '',
      'Estado': '',
      'Empresa': '',
      'Tipo Guía': '',
      'RUC': ''
    };
  }

  getReservationExportTemplate() {
    return {
      'Cliente': '',
      'Email': '',
      'Teléfono': '',
      'Servicio': '',
      'Fecha': '',
      'Hora': '',
      'Personas': '',
      'Precio': '',
      'Observaciones': ''
    };
  }

  getGuideExportTemplate() {
    return {
      'Nombre': '',
      'Apellido': '',
      'Email': '',
      'Teléfono': '',
      'Tipo': '',
      'Especialidades': '',
      'Idiomas': '',
      'Precio por Hora': ''
    };
  }

  // Template download methods
  downloadUserTemplate() {
    const template = [this.getUserExportTemplate()];
    return this.exportToExcel(template, 'plantilla_usuarios', 'Plantilla');
  }

  downloadReservationTemplate() {
    const template = [this.getReservationExportTemplate()];
    return this.exportToExcel(template, 'plantilla_reservaciones', 'Plantilla');
  }

  downloadGuideTemplate() {
    const template = [this.getGuideExportTemplate()];
    return this.exportToExcel(template, 'plantilla_guias', 'Plantilla');
  }
}

export default new UniversalExportService();