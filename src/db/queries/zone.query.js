import pool from '../database'

const createZone = async (zone) => {
    const [result] = await (await pool).query('INSERT INTO ZONAS SET ?', zone);
    return result.insertId;
}

const searchZoneByName = async (name)=>{
    return(await pool).query('SELECT * FROM ZONAS WHERE nombre = ?',name)
}

const searchZoneByID = async (id)=>{
    return(await pool).query('SELECT * FROM ZONAS WHERE id_zona = ?',id)
}

const deleteZone = async (id)=>{
    return(await pool).query('DELETE FROM ZONAS WHERE id_zona = ?',id)
}

const updateZone = async (zone, id) => {
    return (await pool).query(
        'UPDATE ZONAS SET nombre = ?, detalles = ? WHERE id_zona = ?',
        [zone.nombre, zone.detalles, id]
    );
};

const getAllZones = async () => {
    return (await pool).query('SELECT * FROM ZONAS');
};

const getClientesByZoneName = async (nombreZona) => {
    const [rows] = await (await pool).query(`
        SELECT 
            c.nombres_completos,
            c.numero_documento_cliente,
            c.correo,
            c.direccion,
            c.celular,
            z.nombre AS nombre_zona,
            co.id_contrato,
            co.fecha_inicio
        FROM cliente c
        JOIN contrato co ON c.numero_documento_cliente = co.numero_documento_cliente
        JOIN servicio s ON co.id_servicio = s.id_servicio
        JOIN zonas z ON s.id_zona = z.id_zona
        WHERE z.nombre = ?
    `, [nombreZona]);

    return rows;
};

const getClientesByZoneId = async (idZona) => {
    const [rows] = await (await pool).query(`
        SELECT 
            c.nombres_completos,
            c.numero_documento_cliente,
            c.correo,
            c.direccion,
            c.celular,
            z.nombre AS nombre_zona,
            co.id_contrato,
            co.fecha_inicio
        FROM cliente c
        JOIN contrato co ON c.numero_documento_cliente = co.numero_documento_cliente
        JOIN servicio s ON co.id_servicio = s.id_servicio
        JOIN zonas z ON s.id_zona = z.id_zona
        WHERE z.id_zona = ?
    `, [idZona]);

    return rows;
};

const getResumenZona = async () => {
    const query = `
        SELECT 
            z.id_zona,
            z.nombre AS nombre_zona,
            z.detalles AS detalles_zona,
            COUNT(DISTINCT s.id_servicio) AS cantidad_servicios,
            COUNT(DISTINCT s.id_plan) AS cantidad_planes
        FROM zonas z
        LEFT JOIN servicio s ON z.id_zona = s.id_zona
        GROUP BY z.id_zona, z.nombre;
    `;
    return (await pool).query(query);
};



module.exports = {
    createZone,
    searchZoneByName,
    searchZoneByID,
    deleteZone,
    updateZone,
    getAllZones,
    getClientesByZoneName,
    getClientesByZoneId,
    getResumenZona
}