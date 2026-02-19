import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFEntregas = (data: any[], rango: { start: string; end: string }) => {
  const doc = new jsPDF();
 const logoUrl= "/assets/logo.png"

  //Encabezado
  doc.setFontSize(18);
  doc.addImage(logoUrl, 'PNG', 170, 10, 25, 25)
  doc.text("Reporte Entregas", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Periodo; ${rango.start} al ${rango.end}`, 14, 28);
  doc.text(`Fecha de emision: ${new Date().toLocaleDateString()}`, 14, 34);

  const columnConfig = [
    { header: 'Departamento', dataKey: 'departamento' },
    { header: 'Producto', dataKey: 'producto' },
    { header: 'Fecha', dataKey: 'fecha' },
    { header: 'Retiro', dataKey: 'quien_retiro' },
    { header: 'Cantidad', dataKey: 'cantidad' },
  ];

  autoTable(doc, {
    startY: 40,
    columns: columnConfig,
    body: data,
    theme: 'striped',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 9 },
    columnStyles: {
      cantidad: { halign: 'center', fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.text(
        `Pagina ${data.pageNumber}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    }
  });
  return doc.output('bloburl').toString();
}