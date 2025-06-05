import {createCuentaCobro,getAllCuentasCobro,getCuentaCobroById,updateCuentaCobro,deleteCuentaCobro} from '../db/queries/collectionAccount.query'
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
    res.status(201).json(cuentas);
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

const update = async (req, res) => {
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
};

const remove = async (req, res) => {
  try {
    await deleteCuentaCobro(req.params.id);
    res.status(201).json({ message:  cuentaCobroMessages.CUENTA_DELETED});
  } catch (error) {
    res.status(500).json({ message: cuentaCobroMessages.ERROR });
  }
};

const concatCuentaCobroInfo = async (info) =>{
  return{
    fecha_creacion: info.createDate,
    id_medio_pago: info.metodoPagoId,
    impuesto: info.impuesto,
    numero_documento_cliente: info.documentClient,
    id_estado: info.statudId
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  concatCuentaCobroInfo
};