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

        doc.fontSize(8)
       

        doc.image('src/services/assets/fondo.jpeg', 0, 0, { width: 620, height: 900 });

        doc.image('src/services/assets/logo.jpg', 75, 10, { width: 200, height: 120 });

        const tabX = originalX + 300;

        doc.text('NIT: 9015626507', tabX, originalY);
        doc.text('Cra 3 #5/32', tabX, doc.y);
        doc.text('Centro La Belleza, Santander', tabX, doc.y);

        doc.moveDown(2);
        doc.x = originalX;

        doc.moveDown(2);

        doc.x = originalX;

        doc.moveDown();

        const infoTabla = [
            ['Cod. Pago', datos.cuenta],
            ['Nombre', datos.nombre],
            ['Dirección', datos.direccion],
            ['Celular', datos.celular],
            ['Periodo', datos.periodo],
        ];


        dibujarTablaInfo({ doc, data: infoTabla, width : 200 });

        const infoTablaFechas = [
            ['Fecha', datos.fecha],
            ['Periodo de facturacion', datos.periodo],
            ['Pago oportuno', datos.pagoOportuno],
            ['Fecha suspencion', datos.suspension],
            ['Telefonos', '3173632087 - 3209419285'],
        ];


        dibujarTablaInfo({ doc, data: infoTablaFechas, width : 240 , xInit : 300, yInit: 146 });

        doc.x = originalX;
        doc.moveDown()

        dibujarTablaMovimientos({ doc, data: datos })
        doc.x = originalX;

        const datosResumen = [
            'SUBTOTAL', datos.subTotal,
            'IVA', datos.impuesto +' %',
            'DESCUENTOS', 0,
            'TOTAL', datos.valor_iva +  datos.subTotal
        ];

        const startX = 306; // posición X donde empieza la tabla

        dibujarTablaGenerica({ doc, rows: 4, columns: 2, data: datosResumen, startX, width: 234 });
        //EL GRACIAS
        doc
            .save()
            .fillColor('#cceaf7')
            .rect(71, 402, 234, 40)
            .fill()
            .restore();
        doc.
            font('Helvetica-BoldOblique')
            .text('Gracias por su confianza', 110, 416)

        //METODOS DE PAGO
        doc
            .rect(71, 441, 235, 79)
            .strokeColor('black')
            .stroke();

        doc.
            font('Helvetica-BoldOblique')
            .text('REALIZA TUS PAGOS MÁS FÁCIL Y RÁPIDO A TRAVÉS DE: ', 72, 445)

        doc.
            font('Helvetica-BoldOblique')
            .fillColor('#3552e2')
            .text('NEQUI: 3144316001', 72, 498)
            .text('DAVIPLATA: 3128740072', 72, 508)

        //LINEA DE ATENCION AL CLIENTE 
        doc
            .rect(306, 481, 234, 39)
            .strokeColor('black')
            .stroke();
        doc.fontSize(10)
        doc
            .fillColor('black')
            .font('Helvetica-Bold')
            .text('LÍNEA DE ATENCIÓN AL CLIENTE:', 336, 492)
            .text('3144316001', 386, 505)

        //separador
        doc.y = 525
        doc.x = originalX

        doc
            .moveTo(0, doc.y + 20)                  
            .lineTo(doc.page.width, doc.y + 20)    
            .dash(5, { space: 5 })
            .stroke();

        //desprendible 

        doc.fontSize(8)
        doc.undash();

         const infoTablaFechasDesprendible = [
            ['Fecha', datos.fecha],
            ['Periodo de facturacion', datos.periodo],
            ['Pago oportuno', datos.pagoOportuno],
            ['Fecha suspencion', datos.suspension]
        ];


        dibujarTablaInfo({ doc, data: infoTablaFechasDesprendible, width : 240 , xInit : 300, yInit: 600});

           const infoResume = [
            ['Cuenta de cobro', datos.cuenta],
            ['Nombre', datos.nombre],
            ['Documento', datos.cedula],
            ['Direccion', datos.direccion]
        ];


        dibujarTablaInfo({ doc, data: infoResume, width : 230 , xInit : 70, yInit: 600});

        doc
            .rect(71, 700, 230, 20)
            .strokeColor('black')
            .stroke();

        doc.
            font('Helvetica-BoldOblique')
            .text('TIPO DE SERVICIO', 150, 706)

        
        doc
            .rect(301, 700, 240, 20)
            .strokeColor('black')
            .stroke();

        doc.
            font('Helvetica-BoldOblique')
            .text('TOTAL : ' + (datos.valor_iva +  datos.subTotal), 306, 706)


        doc.end();
        stream.on('finish', () => {
            resolve();
        });
    });
}

function dibujarTablaInfo({ doc, data = [], width = null, xInit = null, yInit = null }) {
    const startY = yInit ?? doc.y ?? 50;
    const marginLeft = xInit ?? doc.page.margins.left ?? 30;
    const usableWidth = width ?? (doc.page.width - doc.page.margins.left - doc.page.margins.right);

    const colCount = 2;
    const columnWidth = usableWidth / colCount;
    const rowHeight = 20;
    let y = startY;

    data.forEach(([label, value]) => {
        doc
            .font('Helvetica-Bold')
            .fillColor('#cceaf7')
            .rect(marginLeft, y, columnWidth, rowHeight)
            .fill()
            .fillColor('black')
            .text(label, marginLeft + 5, y + 7, {
                width: columnWidth - 10,
                align: 'left',
            });

        doc
            .strokeColor('black')
            .rect(marginLeft, y, columnWidth, rowHeight)
            .stroke();

        doc
            .font('Helvetica')
            .rect(marginLeft + columnWidth, y, columnWidth, rowHeight)
            .stroke()
            .text(value, marginLeft + columnWidth + 5, y + 7, {
                width: columnWidth - 10,
                align: 'left',
            });

        y += rowHeight;
    });

    doc.moveDown();
}

function dibujarTablaMovimientos({ doc, data, width = null }) {
    const marginLeft = doc.page.margins.left || 30;
    const usableWidth = width || (doc.page.width - doc.page.margins.left - doc.page.margins.right);
    const columnCount = 3;
    const rowHeight = 20;
    let y = doc.y || 50;

    const columnWidthsPercent = [0.5, 0.25, 0.25];
    const columnWidths = columnWidthsPercent.map(p => p * usableWidth);

    const headers = ['Descripción', 'Cantidad', 'Valor'];

    headers.forEach((header, i) => {
        const x = marginLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0); // sum ancho columnas previas

        doc
            .save()
            .fillColor('#4fb7e1')
            .rect(x, y, columnWidths[i], rowHeight)
            .fill()
            .restore();

        doc
            .fillColor('black')
            .font('Helvetica-Bold')
            .text(header, x + 5, y + 7, {
                width: columnWidths[i] - 10,
                align: 'left',
            });

        doc
            .rect(x, y, columnWidths[i], rowHeight)
            .strokeColor('black')
            .stroke();
    });

    y += rowHeight;

    const filas = [];
    filas.push([
        data.descripcion || '',
        data.mes || '',
        data.subTotal?.toLocaleString('es-CO') || ''
    ]);

    for (let i = 1; i < 6; i++) {
        filas.push(['', '', '']);
    }

    filas.forEach(row => {
        row.forEach((cell, i) => {
            const x = marginLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);

            doc
                .rect(x, y, columnWidths[i], rowHeight)
                .strokeColor('black')
                .stroke();

            doc
                .fillColor('black')
                .font('Helvetica')
                .text(cell, x + 5, y + 7, {
                    width: columnWidths[i] - 10,
                    align: 'left',
                });
        });
        y += rowHeight;
    });

    doc.moveDown();
}


function dibujarTablaGenerica({ doc, rows, columns, data, startX, startY = null, width = null }) {
    const x = startX;
    let yStart = startY !== null ? startY : doc.y;
    yStart = yStart + 4
    const usableWidth = width || (doc.page.width - doc.page.margins.left - doc.page.margins.right - x);
    const columnWidth = usableWidth / columns;
    const rowHeight = 20;

    let y = yStart;

    let dataIndex = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cellText = data[dataIndex] !== undefined ? data[dataIndex].toString() : '';

            const cellX = x + col * columnWidth;
            const cellY = y;
            doc
                .save()
                .fillColor('white')
                .rect(cellX, cellY, columnWidth, rowHeight)
                .fill()
                .restore();
            doc
                .rect(cellX, cellY, columnWidth, rowHeight)
                .strokeColor('black')
                .stroke();
            doc
                .fillColor('black')
                .font('Helvetica')
                .text(cellText, cellX + 5, cellY + 7, {
                    width: columnWidth - 10,
                    align: 'left',
                    ellipsis: true,
                });

            dataIndex++;
        }
        y += rowHeight;
    }

    doc.y = y;
}

module.exports = {
    generarPDF
} 