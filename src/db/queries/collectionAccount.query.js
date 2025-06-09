import pool from '../database'

const createCuentaCobro = async (cuenta) => {
  const query = `
    INSERT INTO cuenta_de_cobro 
    (fecha_creacion, id_medio_pago, impuesto, id_contrato, id_estado) 
    VALUES (?, ?, ?, ?, ?)`;
  const values = [
    cuenta.fecha_creacion,
    cuenta.id_medio_pago,
    cuenta.impuesto,
    cuenta.id_contrato,
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

const getBillsByClientDocument = async (document) => {
  const query = `
    SELECT 
        cdc.id_cuenta_cobro,
        cdc.fecha_creacion,
        cdc.impuesto,
        cdc.id_medio_pago,
        mp.nombre AS nombre_medio_pago,
        cdc.id_estado,
        e.nombre_estado,
        cli.numero_documento_cliente,
        cli.nombres_completos
    FROM 
        cuenta_de_cobro cdc
    INNER JOIN cliente cli 
        ON cdc.numero_documento_cliente = cli.numero_documento_cliente
    INNER JOIN medio_pago mp 
        ON cdc.id_medio_pago = mp.id_medio_pago
    INNER JOIN estado e 
        ON cdc.id_estado = e.id_estado
    WHERE 
        cli.numero_documento_cliente = ?
    ORDER BY 
        cdc.fecha_creacion DESC;
  `;
  return (await pool).query(query, [document]);
};

/*const getBillingDetails = async () => {
    return (await pool).query(
        `SELECT 
            cc.id_cuenta_cobro AS cuenta_de_cobro,
            c.nombres_completos,
            c.numero_documento_cliente AS no_cedula,
            c.direccion,
            c.celular AS no_celular,
            s.precio AS subtotal,
            cc.impuesto,
            p.nombre_plan
        FROM 
            CUENTA_DE_COBRO cc
        INNER JOIN 
            CONTRATO ct ON cc.id_contrato = ct.id_contrato
        INNER JOIN 
            CLIENTE c ON ct.numero_documento_cliente = c.numero_documento_cliente
        INNER JOIN 
            SERVICIO s ON ct.id_servicio = s.id_servicio
        INNER JOIN 
            PLANES p ON s.id_plan = p.id_plan`
    );
};*/

const getBillingDetails = async () => {
    return (await pool).query(
        `SELECT 
            cc.id_cuenta_cobro AS cuenta_de_cobro,
            cl.nombres_completos AS nombre_cliente,
            cl.numero_documento_cliente AS no_cedula,
            cl.direccion,
            cl.celular AS no_celular,
            s.precio AS subtotal,
            cc.impuesto AS iva,
            p.nombre_plan
        FROM 
            cuenta_de_cobro cc
        INNER JOIN contrato c ON cc.id_contrato = c.id_contrato
        INNER JOIN cliente cl ON c.numero_documento_cliente = cl.numero_documento_cliente
        INNER JOIN servicio s ON c.id_servicio = s.id_servicio
        INNER JOIN planes p ON s.id_plan = p.id_plan`
    );
};

module.exports = {
  createCuentaCobro,
  getAllCuentasCobro,
  getCuentaCobroById,
  updateCuentaCobro,
  deleteCuentaCobro,
  getBillsByClientDocument,
  getBillingDetails
};
