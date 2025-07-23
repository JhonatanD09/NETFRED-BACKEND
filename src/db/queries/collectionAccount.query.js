import pool from '../database'

/*const createCuentaCobro = async (cuenta) => {
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
};*/

const createCuentaCobro = async (cuenta) => {
  const query =`
    INSERT INTO cuenta_de_cobro 
    (fecha_creacion, id_medio_pago, impuesto, id_contrato, id_estado, valor_total_pago, fecha_pago) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    cuenta.fecha_creacion,
    cuenta.id_medio_pago || null,
    cuenta.impuesto,
    cuenta.id_contrato,
    cuenta.id_estado,
    cuenta.valor_total_pago || null,
    cuenta.fecha_pago || null
  ];
  return (await pool).query(query, values);
};

const getAllCuentasCobro = async () => {
  return (await pool).query('SELECT * FROM cuenta_de_cobro');
};

const getCuentaCobroById = async (id) => {
  return (await pool).query('SELECT * FROM cuenta_de_cobro WHERE id_cuenta_cobro = ?', id);
};

const updateCuentaCobro = async (statusId, id) => {
  return (await pool).query(`
    UPDATE cuenta_de_cobro 
    SET id_estado = ? WHERE id_cuenta_cobro = ?`,
    [statusId,
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
            cl.nombres_completos AS nombre_cliente,
            cl.numero_documento_cliente AS no_cedula,
            cl.direccion,
            cl.celular AS no_celular,
            s.precio AS subtotal,
            cc.impuesto,
            ROUND(s.precio * (cc.impuesto / 100.0), 2) AS IVA,
            p.nombre_plan
        FROM 
            cuenta_de_cobro cc
        INNER JOIN contrato c ON cc.id_contrato = c.id_contrato
        INNER JOIN cliente cl ON c.numero_documento_cliente = cl.numero_documento_cliente
        INNER JOIN servicio s ON c.id_servicio = s.id_servicio
        INNER JOIN planes p ON s.id_plan = p.id_plan`
    );
};*/

const getBillingDetails = async () => {
    return (await pool).query(`
        SELECT
          c.id_contrato AS Referencia_Pago,
          cl.nombres_completos AS nombre_cliente,
          cl.numero_documento_cliente AS no_cedula,
          cl.direccion,
          cl.celular AS no_celular,
          s.precio AS subtotal_base,
          c.fecha_inicio,
          p.nombre_plan,
          19 AS impuesto, -- Puedes parametrizar este valor si lo deseas
          
          -- Días facturados solo si es el primer mes
          DATEDIFF(
            LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
            GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
          ) + 1 AS dias_facturados,

          -- Total de días del mes
          DAY(LAST_DAY(NOW())) AS dias_del_mes,

          -- Subtotal prorrateado si es el primer mes, completo si no
          ROUND(
            IF(DATE_FORMAT(c.fecha_inicio, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m'),
              (DATEDIFF(
                LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
                GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
              ) + 1) * (s.precio / DAY(LAST_DAY(NOW()))),
              s.precio
            ),
          2) AS subtotal,

          -- IVA prorrateado si es el primer mes, completo si no
          ROUND(
            IF(DATE_FORMAT(c.fecha_inicio, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m'),
              (DATEDIFF(
                LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
                GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
              ) + 1) * (s.precio / DAY(LAST_DAY(NOW()))) * (19 / 100),
              s.precio * (19 / 100)
            ),
          2) AS IVA,

          ROUND(
            IF(DATE_FORMAT(c.fecha_inicio, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m'),
            (DATEDIFF(
            LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
            GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
            ) + 1)
            * (s.precio / DAY(LAST_DAY(NOW())))
            * (1 + 19 / 100),
            s.precio * (1 + 19 / 100)
            ),
          2) AS total

          FROM 
            contrato c
          INNER JOIN cliente cl ON c.numero_documento_cliente = cl.numero_documento_cliente
          INNER JOIN servicio s ON c.id_servicio = s.id_servicio
          INNER JOIN planes p ON s.id_plan = p.id_plan
          WHERE c.id_estado = (SELECT id_estado FROM Estado WHERE nombre_estado = 'ACTIVO' AND tabla_referencia = 'Contrato')
          `
    );
};

const getBillingDetailsByZona = async (idZona) => {
    return (await pool).query(`
      SELECT
        c.id_contrato AS Referencia_Pago,
        cl.nombres_completos AS nombre_cliente,
        cl.numero_documento_cliente AS no_cedula,
        cl.direccion,
        cl.celular AS no_celular,
        s.precio AS subtotal_base,
        c.fecha_inicio,
        p.nombre_plan,
        z.nombre AS zona,
        19 AS impuesto,

        DATEDIFF(
        LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
        GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
        ) + 1 AS dias_facturados,

        DAY(LAST_DAY(NOW())) AS dias_del_mes,

        ROUND(
          IF(DATE_FORMAT(c.fecha_inicio, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m'),
            (DATEDIFF(
              LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
              GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
            ) + 1) * (s.precio / DAY(LAST_DAY(NOW()))),
            s.precio
          ),
        2) AS subtotal,

        ROUND(
          IF(DATE_FORMAT(c.fecha_inicio, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m'),
            (DATEDIFF(
              LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
              GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
            ) + 1) * (s.precio / DAY(LAST_DAY(NOW()))) * (19 / 100),
            s.precio * (19 / 100)
          ),
        2) AS IVA,

        ROUND(
            IF(DATE_FORMAT(c.fecha_inicio, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m'),
            (DATEDIFF(
            LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
            GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
            ) + 1)
            * (s.precio / DAY(LAST_DAY(NOW())))
            * (1 + 19 / 100),
            s.precio * (1 + 19 / 100)
            ),
        2) AS total

        FROM 
          contrato c
        INNER JOIN cliente cl ON c.numero_documento_cliente = cl.numero_documento_cliente
        INNER JOIN servicio s ON c.id_servicio = s.id_servicio
        INNER JOIN planes p ON s.id_plan = p.id_plan
        INNER JOIN zonas z ON s.id_zona = z.id_zona
        WHERE 
          c.id_estado = (SELECT id_estado FROM Estado WHERE nombre_estado = 'ACTIVO' AND tabla_referencia = 'Contrato')
          AND s.id_zona = ?
        `,
        [idZona]
    );
};

const getBillingDetailsByIdContrato = async (idContrato) => {
    return (await pool).query(`
      SELECT
        c.id_contrato AS Referencia_Pago,
        cl.nombres_completos AS nombre_cliente,
        cl.numero_documento_cliente AS no_cedula,
        cl.direccion,
        cl.celular AS no_celular,
        s.precio AS subtotal_base,
        c.fecha_inicio,
        p.nombre_plan,
        z.nombre AS zona,
        19 AS impuesto,

        DATEDIFF(
        LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
        GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
        ) + 1 AS dias_facturados,

        DAY(LAST_DAY(NOW())) AS dias_del_mes,

        ROUND(
          IF(DATE_FORMAT(c.fecha_inicio, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m'),
            (DATEDIFF(
              LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
              GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
            ) + 1) * (s.precio / DAY(LAST_DAY(NOW()))),
            s.precio
          ),
        2) AS subtotal,

        ROUND(
          IF(DATE_FORMAT(c.fecha_inicio, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m'),
            (DATEDIFF(
              LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
              GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
            ) + 1) * (s.precio / DAY(LAST_DAY(NOW()))) * (19 / 100),
            s.precio * (19 / 100)
          ),
        2) AS IVA,

        ROUND(
            IF(DATE_FORMAT(c.fecha_inicio, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m'),
            (DATEDIFF(
            LEAST(LAST_DAY(NOW()), DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 29 DAY)),
            GREATEST(c.fecha_inicio, DATE_FORMAT(NOW(), '%Y-%m-01'))
            ) + 1)
            * (s.precio / DAY(LAST_DAY(NOW())))
            * (1 + 19 / 100),
            s.precio * (1 + 19 / 100)
            ),
        2) AS total

        FROM 
          contrato c
        INNER JOIN cliente cl ON c.numero_documento_cliente = cl.numero_documento_cliente
        INNER JOIN servicio s ON c.id_servicio = s.id_servicio
        INNER JOIN planes p ON s.id_plan = p.id_plan
        INNER JOIN zonas z ON s.id_zona = z.id_zona
        WHERE 
          c.id_estado = (SELECT id_estado FROM Estado WHERE nombre_estado = 'ACTIVO' AND tabla_referencia = 'Contrato')
          AND c.id_contrato = ?
        `,
        [idContrato]
    );
};

const getEstadoIdByNombre = async (nombre, tabla) => {
  const [rows] = await (await pool).query(`
    SELECT id_estado FROM Estado WHERE nombre_estado = ? AND tabla_referencia = ?
  `, [nombre, tabla]);
  return rows[0]?.id_estado || null;
};

const registrarPagoDesdeCuentaCobro = async (idCuentaCobro) => {
  const db = await pool;

  const [rows] = await db.query(`
    SELECT 
      ROUND(srv.precio + (srv.precio * (cdc.impuesto / 100.0)), 2) AS valor_pagado,
      cdc.id_medio_pago,
      cli.numero_documento_cliente,
      srv.id_zona,
      srv.id_plan
    FROM Cuenta_de_cobro cdc
    INNER JOIN Contrato ct ON cdc.id_contrato = ct.id_contrato
    INNER JOIN Cliente cli ON ct.numero_documento_cliente = cli.numero_documento_cliente
    INNER JOIN Servicio srv ON ct.id_servicio = srv.id_servicio
    WHERE cdc.id_cuenta_cobro = ?;
  `, [idCuentaCobro]);

  if (rows.length === 0) return;

  const datos = rows[0];

  await db.query(`
    INSERT INTO Pago (fecha_pago, valor_pagado, id_cuenta_cobro, id_medio_pago, 
                      numero_documento_cliente, id_zona, id_plan)
    VALUES (CURDATE(), ?, ?, ?, ?, ?, ?)
  `, [
    datos.valor_pagado,
    idCuentaCobro,
    datos.id_medio_pago,
    datos.numero_documento_cliente,
    datos.id_zona,
    datos.id_plan
  ]);
};

const cuentaCobroExisteParaContratoYMes = async (id_contrato, fecha_creacion) => {
  const db = await pool;
  const [rows] = await db.query(` SELECT 1 FROM cuenta_de_cobro WHERE id_contrato = ? AND MONTH(fecha_creacion) = MONTH(?) AND YEAR(fecha_creacion) = YEAR(?) LIMIT 1 `, [id_contrato, fecha_creacion, fecha_creacion]);
  return rows.length > 0;
};

const obtenerInfoContratoParaCobro = async (id_contrato) => {
  const db = await pool;
  const [rows] = await db.query( `SELECT s.precio, 19 AS impuesto FROM contrato c INNER JOIN servicio s ON c.id_servicio = s.id_servicio WHERE c.id_contrato = ? `, [id_contrato]);
  return rows[0];
};

const insertarCuentaCobro = async (cuenta) => {
  const query = `INSERT INTO cuenta_de_cobro (fecha_creacion, id_medio_pago, impuesto, id_contrato, id_estado, valor_total_pago, fecha_pago) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
  cuenta.fecha_creacion,
  cuenta.id_medio_pago,
  cuenta.impuesto,
  cuenta.id_contrato,
  cuenta.id_estado,
  cuenta.valor_total_pago,
  cuenta.fecha_pago
  ];
  return (await pool).query(query, values);
};

module.exports = {
  createCuentaCobro,
  getAllCuentasCobro,
  getCuentaCobroById,
  updateCuentaCobro,
  deleteCuentaCobro,
  getBillsByClientDocument,
  getBillingDetails,
  getEstadoIdByNombre,
  registrarPagoDesdeCuentaCobro,
  getBillingDetailsByZona,
  getBillingDetailsByIdContrato,
  cuentaCobroExisteParaContratoYMes,
  obtenerInfoContratoParaCobro,
  insertarCuentaCobro
};
