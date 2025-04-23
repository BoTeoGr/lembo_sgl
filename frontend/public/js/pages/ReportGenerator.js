// ReportGenerator.js
// Lógica reutilizable para generación y descarga de reportes en cualquier listado
// Uso: importar y llamar a ReportGenerator.generateReport({columns, data, format, filename})

const ReportGenerator = {
    generateReport: function({ columns, data, format = 'excel', filename = 'reporte' }) {
        if (format === 'excel' || format === 'csv') {
            const csv = this._toCSV(columns, data);
            this._downloadFile(csv, `${filename}.${format === 'excel' ? 'xlsx' : 'csv'}`, 'text/csv');
        } else if (format === 'pdf') {
            this._toPDF(columns, data, filename);
        } else {
            alert('Formato no soportado');
        }
    },
    _toCSV: function(columns, data) {
        const header = columns.map(col => col.header).join(',');
        const rows = data.map(row => columns.map(col => row[col.key]).join(','));
        return [header, ...rows].join('\r\n');
    },
    _downloadFile: function(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    _toPDF: function(columns, data, filename) {
        // Requiere jsPDF y autoTable (debe estar incluido en el HTML)
        if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
            alert('jsPDF y autoTable no están cargados.');
            return;
        }
        const doc = new (window.jspdf?.jsPDF || window.jsPDF)();
        const headers = [columns.map(col => col.header)];
        const rows = data.map(row => columns.map(col => row[col.key]));
        if (doc.autoTable) {
            doc.autoTable({ head: headers, body: rows });
        } else if (window.jspdf && window.jspdf.autoTable) {
            window.jspdf.autoTable(doc, { head: headers, body: rows });
        } else {
            alert('autoTable no está disponible en jsPDF.');
            return;
        }
        doc.save(`${filename}.pdf`);
    }
};

// Exportar para uso con import (ESModules) o global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportGenerator;
} else {
    window.ReportGenerator = ReportGenerator;
}
