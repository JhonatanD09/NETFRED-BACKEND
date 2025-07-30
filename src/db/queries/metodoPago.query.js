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

module.exports = {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
  getPaymentMethodByName,
  getMedioPagoIdByNombre
};
