import {createPaymentMethod,getAllPaymentMethods,getPaymentMethodById,updatePaymentMethod,deletePaymentMethod, getPaymentMethodByName, isPaymentMethodInUse} from '../db/queries/metodoPago.query'
import {metodoPagoMessages} from '../constans/ErrorConstans'

const create = async (req, res) => {
    const metodoPago = await concatMetodoPagoInfo(req.body) 
    
    // Validar que el nombre no esté vacío
    if (!metodoPago.nombre || metodoPago.nombre.trim() === '') {
        return res.status(400).json({message: "El nombre del método de pago es requerido"})
    }
    
    const metodoPagoByName = await getPaymentMethodByName(metodoPago.nombre)
    if (metodoPagoByName[0].length>0) {
        res.status(400).json({message: metodoPagoMessages.METODOPAGO_EXISTENTE})
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
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ message: metodoPagoMessages.ERROR });
  }
};

const getById = async (req, res) => {
  try {
    const [result] = await getPaymentMethodById(req.params.id);
    if (result.length > 0) {
      res.status(200).json(result[0]);
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

    // Validar que el nombre no esté vacío
    if (!metodoPago.nombre || metodoPago.nombre.trim() === '') {
        return res.status(400).json({message: "El nombre del método de pago es requerido"})
    }

    try {
        const existing = await getPaymentMethodById(id)
        if (existing[0].length === 0) {
            return res.status(404).json({ message: metodoPagoMessages.METODOPAGO_NOT_FOUND})
        }

        // Verificar si el nombre ya existe en otro registro
        const metodoPagoByName = await getPaymentMethodByName(metodoPago.nombre)
        if (metodoPagoByName[0].length > 0 && metodoPagoByName[0][0].id_medio_pago != id) {
            return res.status(400).json({message: metodoPagoMessages.METODOPAGO_EXISTENTE})
        }

        await updatePaymentMethod(metodoPago, id);
        res.status(200).json({ message:  metodoPagoMessages.METODOPAGO_UPDATE});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: metodoPagoMessages.ERROR });
    }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar si el método de pago existe
    const existing = await getPaymentMethodById(id);
    if (existing[0].length === 0) {
        return res.status(404).json({ message: metodoPagoMessages.METODOPAGO_NOT_FOUND})
    }
    
    // Verificar si el método de pago está siendo utilizado
    const usageCheck = await isPaymentMethodInUse(id);
    if (usageCheck.inUse) {
        return res.status(400).json({ 
            message: `No se puede eliminar el método de pago porque está siendo utilizado en ${usageCheck.usage.total} registro(s)`,
            details: {
                cuentas_cobro: usageCheck.usage.cuentas_cobro,
                pagos: usageCheck.usage.pagos,
                total: usageCheck.usage.total
            }
        });
    }
    
    // Si no está en uso, proceder con la eliminación
    await deletePaymentMethod(id);
    res.status(200).json({ message: metodoPagoMessages.METODOPAGO_DELETED });
  } catch (error) {
    console.error('Error eliminando método de pago:', error);
    res.status(500).json({ message: metodoPagoMessages.ERROR });
  }
};

const concatMetodoPagoInfo = async (info) =>{
    return{
        nombre: info.name,
    }
}

// Verificar uso de un método de pago
const checkUsage = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Verificar si el método de pago existe
        const existing = await getPaymentMethodById(id);
        if (existing[0].length === 0) {
            return res.status(404).json({ message: metodoPagoMessages.METODOPAGO_NOT_FOUND})
        }
        
        // Obtener información de uso
        const usageCheck = await isPaymentMethodInUse(id);
        
        res.status(200).json({
            metodoPago: existing[0][0],
            canDelete: !usageCheck.inUse,
            usage: usageCheck.usage
        });
    } catch (error) {
        console.error('Error verificando uso del método de pago:', error);
        res.status(500).json({ message: metodoPagoMessages.ERROR });
    }
};

module.exports = { create, getAll, getById, update, remove, concatMetodoPagoInfo, checkUsage };
