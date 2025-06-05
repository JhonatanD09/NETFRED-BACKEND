import {createPaymentMethod,getAllPaymentMethods,getPaymentMethodById,updatePaymentMethod,deletePaymentMethod, getPaymentMethodByName} from '../db/queries/metodoPago.query'
import {metodoPagoMessages} from '../constans/ErrorConstans'

const create = async (req, res) => {
    const metodoPago = await concatMetodoPagoInfo(req.body) 
    const metodoPagoByName = await getPaymentMethodByName(metodoPago.nombre)
    if (metodoPagoByName[0].length>0) {
        res.status(404).json({message: metodoPagoMessages.METODOPAGO_EXISTENTE})
    } else {
        try {
            await createPaymentMethod(metodoPago);
            res.status(201).json({ message:  metodoPagoMessages.METODOPAGO_ADD});
        } catch (error) {
            res.status(500).json({ message:  metodoPagoMessages.ERROR });
        }
    }
};

const getAll = async (req, res) => {
  try {
    const [methods] = await getAllPaymentMethods();
    res.status(201).json(methods);
  } catch (error) {
    res.status(500).json({ message: metodoPagoMessages.ERROR });
  }
};

const getById = async (req, res) => {
  try {
    const [result] = await getPaymentMethodById(req.params.id);
    if (result.length > 0) {
      res.status(201).json(result[0]);
    } else {
      res.status(404).json({ message: metodoPagoMessages.METODOPAGO_NO_ENCONTRADO });
    }
  } catch (error) {
    res.status(500).json({ message: metodoPagoMessages.ERROR });
  }
};

const update = async (req, res) => {
    const id = req.params.id;
    const metodoPago = await concatMetodoPagoInfo(req.body) 

    try {
        const existing = await getPaymentMethodById(id)
        if (existing[0].length === 0) {
            return res.status(404).json({ message: metodoPagoMessages.METODOPAGO_NOT_FOUND})
        }

        await updatePaymentMethod(metodoPago, id);
        res.status(201).json({ message:  metodoPagoMessages.METODOPAGO_UPDATE});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: metodoPagoMessages.ERROR });
    }
};

const remove = async (req, res) => {
  try {
    await deletePaymentMethod(req.params.id);
    res.status(201).json({ message: metodoPagoMessages.METODOPAGO_DELETED });
  } catch (error) {
    res.status(500).json({ message: metodoPagoMessages.ERROR });
  }
};

const concatMetodoPagoInfo = async (info) =>{
    return{
        nombre: info.name,
    }
}

module.exports = { create, getAll, getById, update, remove, concatMetodoPagoInfo };
