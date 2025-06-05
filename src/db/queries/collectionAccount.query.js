import pool from '../database'

const createCuentaCobro = async (cuenta) => {
  const query = `
    INSERT INTO cuenta_de_cobro 
    (fecha_creacion, id_medio_pago, impuesto, numero_documento_cliente, id_estado) 
    VALUES (?, ?, ?, ?, ?)`;
  const values = [
    cuenta.fecha_creacion,
    cuenta.id_medio_pago,
    cuenta.impuesto,
    cuenta.numero_documento_cliente,
    cuenta.id_estado
  ];
  return (await pool).query(query, values);
};

const getAllCuentasCobro = async () => {
  return (await pool).query('SELECT * FROM cuenta_de_cobro');
};

const getCuentaCobroById = async (id) => {
  return (await pool).query('SELECT * FROM cuenta_de_cobro WHERE id_cuenta_cobro = ?', id);
};

const updateCuentaCobro = async (cuentaCobro, id) => {
  return (await pool).query(`
    UPDATE cuenta_de_cobro 
    SET fecha_creacion = ?, id_medio_pago = ?, impuesto = ?, numero_documento_cliente = ?, id_estado = ? 
    WHERE id_cuenta_cobro = ?`,
    [cuentaCobro.createDate,
     cuentaCobro.metodoPagoId,
     cuentaCobro.impuesto,
     cuentaCobro.documentClient,
     cuentaCobro.statudId,
     id]
  );
};

const deleteCuentaCobro = async (id) => {
  return (await pool).query('DELETE FROM cuenta_de_cobro WHERE id_cuenta_cobro = ?', id);
};

module.exports = {
  createCuentaCobro,
  getAllCuentasCobro,
  getCuentaCobroById,
  updateCuentaCobro,
  deleteCuentaCobro
};
