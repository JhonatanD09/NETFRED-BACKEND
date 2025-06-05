const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputDir = path.join('D:/test', 'pdfs');



const generarPDF = (id, datos) => {

    console.log('📁 Creando carpeta en:', outputDir);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    return new Promise((resolve) => {
        const doc = new PDFDocument();
        const filePath = path.join(outputDir, `archivo_${id}.pdf`);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        const originalX = doc.x;
        const originalY = doc.y;

        doc.image('src/services/assets/download.png', 10, 10, { width: 300, height: 150 });

        const tabX = originalX + 300;

        doc.text('NIT: 9015626507', tabX, originalY);
        doc.text('Cra 3 #5/32', tabX, doc.y);
        doc.text('Centro La Belleza, Santander', tabX, doc.y);

        doc.moveDown();
        doc.x = originalX;

        doc.moveDown();
        doc.text(`Cuenta de cobro: `, {continued: true})
            .font('Helvetica-Bold')
            .text(` ${datos.cuenta}         `, {continued: true})
            .font('Helvetica')
            .text('FECHA: 10/02/2025', originalX + 200)

        doc.x = originalX;

        doc.moveDown();
        doc.text(`Nombre usuario: ${datos.nombre}`);
        doc.text(`Cédula: ${datos.cedula}`);
        doc.text(`Dirección: ${datos.direccion}`);
        doc.text(`Celular: ${datos.celular}`);

        doc.moveDown();
        doc.text(`Periodo de facturación: ${datos.periodo}`);
        doc.text(`Pago oportuno: ${datos.pagoOportuno}`);
        doc.text(`Fecha de suspensión: ${datos.suspension}`);

        doc.moveDown();
        doc.text('Detalle de cobro:', { underline: true });
        doc.text(`Descripción: ${datos.descripcion}`);
        doc.text(`Mes: ${datos.mes}`);
        doc.text(`Valor: $${datos.valor.toLocaleString()}`);

        doc.moveDown();
        doc.text(`Total: $${datos.valor.toLocaleString()}`, { bold: true });

        doc.moveDown();
        doc.fontSize(16).text('CANCELADO', { align: 'center' });
        doc.fontSize(10).text(`Fecha cancelación: ${datos.fechaCancelacion}`, { align: 'center' });

        doc.end();
        stream.on('finish', () => {
            resolve();
        });
    });
}


module.exports = {
    generarPDF
} 