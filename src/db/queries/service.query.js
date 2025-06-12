import pool from '../database'

const createService = async (servicio) => {
    const [result] = await (await pool).query('INSERT INTO SERVICIO SET ?', servicio);
    return { id_servicio: result.insertId, ...servicio };
}

const searchServiceByID = async (id)=>{
    return(await pool).query('SELECT * FROM SERVICIO WHERE id_servicio = ?',id)
}

const deleteService = async (id)=>{
    return(await pool).query('DELETE FROM SERVICIO WHERE id_servicio = ?',id)
}

const desactiveService = async (id) => {
    return (await pool).query('UPDATE SERVICIO SET id_estado = 2 WHERE id_servicio = ?', [id]);
}

const updateService = async (service, id) => {
    return (await pool).query(
        'UPDATE SERVICIO SET id_zona = ?, id_plan = ?, id_estado = ?, precio = ? WHERE id_servicio = ?',
        [service.id_zona, service.id_plan,service.id_estado, service.precio, id]
    );
};

const getServiceByIdQuery = async (id) => {
    return (await pool).query('SELECT * FROM servicio WHERE id_servicio = ?', [id]);
};

/*const checkContractsByServiceId = async (id_servicio) => {
    const [rows] = await (await pool).query(
        'SELECT 1 FROM contrato WHERE id_servicio = ? LIMIT 1',
        [id_servicio]
    );
    return rows.length > 0;
};*/

const checkContractsByServiceId = async (id_servicio) => {
    return (await pool).query(
        `SELECT C.*
         FROM CONTRATO C
         INNER JOIN estado EC ON C.id_estado = EC.id_estado
         WHERE C.id_servicio = ?
           AND EC.nombre_estado = 'Activo'
           AND EC.tabla_referencia = 'Contrato'`,
        [id_servicio]
    );
};


const getAllService = async () => {
    return (await pool).query('SELECT * FROM SERVICIO');
};
  
const getAllServiceByZone = async (idZona) => {
    if (!idZona) {
        throw new Error('Zone ID is required');
    }
    return (await pool).query('SELECT * FROM SERVICIO WHERE id_zona = ?', [idZona]);
};

module.exports = {
    createService,
    searchServiceByID,
    deleteService,
    updateService,
    getAllService,
    getServiceByIdQuery,
    checkContractsByServiceId,
    getAllServiceByZone,
    desactiveService,
}