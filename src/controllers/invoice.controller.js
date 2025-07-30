const pdfGenerateService = require('../services/pdfGenerator.service')
import { getBillingDetailsByZona } from '../db/queries/collectionAccount.query'
import { getAllBillingDetailsController } from './collectionAccount.controller'
const fs = require('fs');
const path = require('path');
import { getAllZones } from '../db/queries/zone.query'
const config = require('../config');

const outputDir = path.join(config.outDir.report);


function construirDatosDesdeResultado(resultado) {
  const hoy = new Date();
  
  const fecha = hoy.toLocaleDateString('es-CO');

  const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const inicioMesAnterior = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1);
  const finMesAnterior = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 0);

  const formatFecha = (date) => date.toLocaleDateString('es-CO');

  const nombresMeses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

  const pagoOportuno = new Date(hoy);
  pagoOportuno.setDate(hoy.getDate() + 5);

  const suspension = new Date(hoy);
  suspension.setDate(hoy.getDate() + 6);

  const subTotal = parseFloat(resultado.subtotal);
  const valorIva = parseFloat(resultado.IVA);
  const valorTotal = subTotal + valorIva;

  return {
    cuenta: resultado.Referencia_Pago,
    fecha: formatFecha(hoy),
    nombre: resultado.nombre_cliente,
    cedula: resultado.no_cedula,
    direccion: resultado.direccion,
    celular: resultado.no_celular,
    periodo: `${formatFecha(inicioMesAnterior)} - ${formatFecha(finMesAnterior)}`,
    pagoOportuno: formatFecha(pagoOportuno),
    suspension: formatFecha(suspension),
    descripcion: `Pago mensualidad - ${resultado.nombre_plan?resultado.nombre_plan:''}`,
    mes: nombresMeses[mesAnterior.getMonth()],
    subTotal: subTotal,
    valor: valorTotal,
    impuesto: parseFloat(resultado.impuesto),
    valor_iva: valorIva,
    fechaCancelacion: formatFecha(hoy)
  };
}

const generate = async (req, res) => {

  let zonas = await getAllZones()
  let tareas = [];

  zonas[0].forEach(async element => {
    let dir =path.join(outputDir,String(new Date().toLocaleDateString('es-CO').toString().replaceAll('/', '-')),element.nombre)
    console.log('📁 Creando carpeta en:',dir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let data = await getBillingDetailsByZona(element.id_zona)
    data = data[0]

    for (let i = 0; i < data.length; i++) {
      tareas.push(pdfGenerateService.generarPDF(i+1,construirDatosDesdeResultado(data[i]),dir));
    }
  });

  await Promise.all(tareas); 
  await getAllBillingDetailsController(req, res);
  res.json({ mensaje: '✅ Todos los PDFs fueron generados exitosamente y los registros fueron insertados en la base de datos.' });
};

const generateEmpty = (req,res) => {
    let dir =path.join(outputDir,String(new Date().toLocaleDateString('es-CO').toString().replaceAll('/', '-')),'empty')
    console.log('📁 Creando carpeta en:',dir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  pdfGenerateService.generarPDF(1,construirDatosDesdeResultado({}),dir)
  res.json({ mensaje: '✅ PDF generado exitosamente' });
}

module.exports = {
  generate,generateEmpty  
} 