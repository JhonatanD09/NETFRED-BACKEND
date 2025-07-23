import {createCuentaCobro,getAllCuentasCobro,getCuentaCobroById,updateCuentaCobro,deleteCuentaCobro, getBillsByClientDocument, getBillingDetails, getEstadoIdByNombre, registrarPagoDesdeCuentaCobro, getBillingDetailsByZona, getBillingDetailsByIdContrato, cuentaCobroExisteParaContratoYMes, obtenerInfoContratoParaCobro, insertarCuentaCobro} from '../db/queries/collectionAccount.query'
import {cuentaCobroMessages} from '../constans/ErrorConstans'

const create = async (req, res) => {
  const cuentaCobro = await concatCuentaCobroInfo(req.body); 
  try {
    await createCuentaCobro(cuentaCobro);
    res.status(201).json({ message: cuentaCobroMessages.CUENTA_ADD });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: cuentaCobroMessages.ERROR });
  }
};

const getAll = async (req, res) => {
  try {
    const [cuentas] = await getAllCuentasCobro();
    res.status(200).json(cuentas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: cuentaCobroMessages.ERROR });
  }
};

const getById = async (req, res) => {
  try {
    const [cuenta] = await getCuentaCobroById(req.params.id);
    if (cuenta.length === 0) {
      return res.status(404).json({ message: cuentaCobroMessages.CUENTA_NO_ENCONTRADA });
    }
    res.status(201).json(cuenta[0]);
  } catch (error) {
    res.status(500).json({ message: cuentaCobroMessages.ERROR });
  }
};

/*const update = async (req, res) => {
  
  const id = req.params.id;
  const cuentaCobro = req.body;

  try {
    const existing = await getCuentaCobroById(id);
    if (existing[0].length === 0) {
      return res.status(404).json({ message: cuentaCobroMessages.CUENTACOBRO_NOT_FOUND });
    }

    await updateCuentaCobro(cuentaCobro, id);
    res.status(201).json({ message: cuentaCobroMessages.CUENTA_UPDATE });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: cuentaCobroMessages.ERROR });
  }
};*/

const remove = async (req, res) => {
  try {
    await deleteCuentaCobro(req.params.id);
    res.status(201).json({ message:  cuentaCobroMessages.CUENTA_DELETED});
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: cuentaCobroMessages.ERROR });
  }
};

const concatCuentaCobroInfo = async (info) =>{
  return{
    fecha_creacion: info.createDate,
    id_medio_pago: info.metodoPagoId,
    impuesto: info.impuesto,
    id_contrato: info.id_contrato,
    id_estado: info.statudId
  }
};

const getHistoryByDocument = async (req, res) => {
  const { documento } = req.params;
  try {
    const [result] = await getBillsByClientDocument(documento);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'No hay historial de cuentas de cobro para este cliente.' });
    }
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ message: 'Error al buscar historial de cuentas de cobro.' });
  }
};

/*const getAllBillingDetailsController = async (req, res) => {
  console.log("hola");
  
  try {
    const [results] = await getBillingDetails();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener detalles de cuentas de cobro:', error);
    res.status(500).json({ message: 'Error al obtener cuentas de cobro.' });
  }
};*/

const getAllBillingDetailsController = async (req, res) => {
  try {
    const [results] = await getBillingDetails();
    for (const detalle of results) {
      const cuentaCobro = {
        fecha_creacion: new Date(), // fecha actual
        id_medio_pago: null, // aún no se ha pagado
        impuesto: detalle.impuesto,
        id_contrato: detalle.Referencia_Pago,
        id_estado: 2, // por ejemplo, 1 = Generada o Pendiente
        valor_total_pago: detalle.total,
        fecha_pago: null
      };
      await createCuentaCobro(cuentaCobro);
    }
    res.status(201).json({ message: 'Cuentas de cobro generadas e insertadas correctamente.' });
  } catch (error) {
    console.error('Error al generar e insertar cuentas de cobro:', error);
    res.status(500).json({ message: 'Error al generar las cuentas de cobro.' });
  }
};

const getBillingDetailsByZonaController = async (req, res) => {
  try {
    const idZona = req.params.id;
    if (!idZona) {
      return res.status(400).json({ message: 'Debe especificar el idZona como parámetro de consulta (query).' });
    }
    const [results] = await getBillingDetailsByZona(idZona);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener detalles de cuentas de cobro por zona:', error);
    res.status(500).json({ message: 'Error al obtener cuentas de cobro.' });
  }
};

const getBillingDetailsByIdContratoController = async (req, res) => {
  try {
    const idContrato = req.params.id;
    if (!idContrato) {
      return res.status(400).json({ message: 'Debe especificar el id del contrato como parámetro de consulta (query).' });
    }
    const [results] = await getBillingDetailsByZona(idContrato);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener detalles de cuentas de cobro por contrato:', error);
    res.status(500).json({ message: 'Error al obtener cuentas de cobro.' });
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  const statusId = req.params.statusId ;

  try {
    const existing = await getCuentaCobroById(id);
    if (existing[0].length === 0) {
      return res.status(404).json({ message: cuentaCobroMessages.CUENTACOBRO_NOT_FOUND });
    }

    const estadoAnterior = existing[0][0].id_estado;
    const estadoNuevo = statusId;
    
    
    await updateCuentaCobro(statusId, id);
    // Si solo cambia el estado y es a "Pagado"
    if (estadoAnterior !== estadoNuevo) {
      const estadoPagadoId = await getEstadoIdByNombre('Pagada', 'Cuenta Cobro');
      if (estadoNuevo === estadoPagadoId) {
        await registrarPagoDesdeCuentaCobro(id);
      }
    }

    res.status(201).json({ message: cuentaCobroMessages.CUENTA_UPDATE });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: cuentaCobroMessages.ERROR });
  }
};

const crearCuentaCobroManual = async (req, res) => {
  const { fecha_creacion, id_contrato } = req.body;

  if (!fecha_creacion || !id_contrato) {
    return res.status(400).json({ mensaje: '❗ Debes enviar fecha_creacion y id_contrato.' });
  }

  try {
    const yaExiste = await cuentaCobroExisteParaContratoYMes(id_contrato, fecha_creacion);
    if (yaExiste) {
      return res.status(200).json({ mensaje: '⚠ Ya existe una cuenta de cobro para ese contrato en ese mes.' });
    }

    const info = await obtenerInfoContratoParaCobro(id_contrato);
    if (!info) {
      return res.status(404).json({ mensaje: '❌ No se encontró información del contrato.' });
    }

    const subtotal = info.precio;
    const impuesto = info.impuesto;
    const total = parseFloat((subtotal * (1 + impuesto / 100)).toFixed(2));

    const cuenta = {
      fecha_creacion: new Date(fecha_creacion),
      id_medio_pago: null,
      impuesto,
      id_contrato,
      id_estado: 2, // pendiente
      valor_total_pago: total,
      fecha_pago: null
    };

    await insertarCuentaCobro(cuenta);
    return res.status(201).json({ mensaje: '✅ Cuenta de cobro creada correctamente.' });
  } catch (error) {
    console.error('Error al crear cuenta manual:', error);
      return res.status(500).json({ mensaje: '❌ Error interno al crear cuenta de cobro.' });
  }
};


module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  concatCuentaCobroInfo,
  getHistoryByDocument,
  getAllBillingDetailsController,
  getBillingDetailsByZonaController,
  getBillingDetailsByIdContratoController,
  crearCuentaCobroManual
};