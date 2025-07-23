const pdfGenerateService = require('../services/pdfGenerator.service')
import { getBillingDetails } from '../db/queries/collectionAccount.query'
import { getAllBillingDetailsController } from './collectionAccount.controller'

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
    cuenta: "1",
    fecha: formatFecha(hoy),
    nombre: resultado.nombre_cliente,
    cedula: resultado.no_cedula,
    direccion: resultado.direccion,
    celular: resultado.no_celular,
    periodo: `${formatFecha(inicioMesAnterior)} - ${formatFecha(finMesAnterior)}`,
    pagoOportuno: formatFecha(pagoOportuno),
    suspension: formatFecha(suspension),
    descripcion: `Pago mensualidad - ${resultado.nombre_plan}`,
    mes: nombresMeses[mesAnterior.getMonth()],
    subTotal: subTotal,
    valor: valorTotal,
    impuesto: parseFloat(resultado.impuesto),
    valor_iva: valorIva,
    fechaCancelacion: formatFecha(hoy)
  };
}

const generate = async (req, res) => {

  let data = await getBillingDetails()
  data = data[0]

  const tareas = [];

  for (let i = 0; i < data.length; i++) {
    tareas.push(pdfGenerateService.generarPDF(i+1,construirDatosDesdeResultado(data[i])));
  }

  await Promise.all(tareas); 

  await getAllBillingDetailsController(req, res);
  res.json({ mensaje: '✅ Todos los PDFs fueron generados exitosamente.' });
};

module.exports = {
  generate  
} 