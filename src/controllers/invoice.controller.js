const pdfGenerateService = require('../services/pdfGenerator.service')

const datos = {
  cuenta: '55',
  fecha: '10/02/2025',
  nombre: 'FREDDY PEÑA',
  cedula: '17410484',
  direccion: 'EL RUBÍ',
  celular: '3132139724',
  periodo: '01/02/2025 - 28/02/2025',
  pagoOportuno: '25/02/2025',
  suspension: '06/03/2025',
  descripcion: 'INSTALACIÓN',
  mes: 'ENERO',
  valor: 45000,
  fechaCancelacion: '11/02/2025'
};


const generate = async (req, res) => {
  const totalPDFs = 1;
  const tareas = [];

  for (let i = 1; i <= totalPDFs; i++) {
    tareas.push(pdfGenerateService.generarPDF(i,datos));
  }

  await Promise.all(tareas); 

  res.json({ mensaje: '✅ Todos los PDFs fueron generados exitosamente.' });
};

module.exports = {
  generate  
} 