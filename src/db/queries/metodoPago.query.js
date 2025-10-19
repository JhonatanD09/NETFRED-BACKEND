import pool from '../database'

const createPaymentMethod = async (metodoPago) => {
    
  return (await pool).query('INSERT INTO MEDIO_PAGO SET ?',metodoPago);
};

const getAllPaymentMethods = async () => {
  return (await pool).query('SELECT * FROM MEDIO_PAGO');
};

const getPaymentMethodById = async (id) => {
  return (await pool).query('SELECT * FROM MEDIO_PAGO WHERE id_medio_pago = ?', id);
};

const updatePaymentMethod = async (metodoPago, id) => {
  return (await pool).query(
    'UPDATE MEDIO_PAGO SET nombre = ? WHERE id_medio_pago = ?',
     [metodoPago.nombre, id]
  );
};

const deletePaymentMethod = async (id) => {
  return (await pool).query('DELETE FROM MEDIO_PAGO WHERE id_medio_pago = ?', id);
};

const getPaymentMethodByName = async (name) => {
  return (await pool).query('SELECT * FROM MEDIO_PAGO WHERE nombre = ?', name);
};

const getMedioPagoIdByNombre = async (nombre) => {
  const [result] = await (await pool).query(
    `SELECT id_medio_pago FROM medio_pago WHERE nombre = ?`,
    [nombre]
  );
  return result.length > 0 ? result[0].id_medio_pago : null;
};

// Verificar si un método de pago está siendo utilizado
const isPaymentMethodInUse = async (id) => {
  try {
    // Verificar en tabla cuenta_de_cobro
    const [cuentaCobroResult] = await (await pool).query(
      `SELECT COUNT(*) as count FROM cuenta_de_cobro WHERE id_medio_pago = ?`,
      [id]
    );
    
    // Verificar en tabla Pago
    const [pagoResult] = await (await pool).query(
      `SELECT COUNT(*) as count FROM Pago WHERE id_medio_pago = ?`,
      [id]
    );
    
    const totalUsage = cuentaCobroResult[0].count + pagoResult[0].count;
    return {
      inUse: totalUsage > 0,
      usage: {
        cuentas_cobro: cuentaCobroResult[0].count,
        pagos: pagoResult[0].count,
        total: totalUsage
      }
    };
  } catch (error) {
    console.error('Error verificando uso del método de pago:', error);
    return {
      inUse: true, // Por seguridad, asumir que está en uso si hay error
      usage: { error: error.message }
    };
  }
};

module.exports = {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
  getPaymentMethodByName,
  getMedioPagoIdByNombre,
  isPaymentMethodInUse
};
