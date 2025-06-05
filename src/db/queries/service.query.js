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

const updateService = async (service, id) => {
    return (await pool).query(
        'UPDATE SERVICIO SET id_zona = ?, id_plan = ?, id_estado = ?, precio = ? WHERE id_servicio = ?',
        [service.id_zona, service.id_plan,service.id_estado, service.precio, id]
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
    getAllServiceByZone,
}