import pool from '../database'

const createEstado = async (estado)=>{
    return (await pool).query('INSERT INTO ESTADO SET ?',estado)
}

const searchEstadoByName = async (name)=>{
    return(await pool).query('SELECT * FROM ESTADO WHERE nombre_estado = ?',name)
}

const searchEstadoByID = async (id)=>{
    return(await pool).query('SELECT * FROM ESTADO WHERE id_estado = ?',id)
}

const deleteEstado = async (id)=>{
    return(await pool).query('DELETE FROM ESTADO WHERE id_estado = ?',id)
}

const updateEstado = async (estado, id) => {
    return (await pool).query(
        'UPDATE ESTADO SET nombre_estado = ?, tabla_referencia = ? WHERE id_estado = ?',
        [estado.nombre_estado, estado.tabla_referencia, id]
    );
};

const getAllEstado = async () => {
    return (await pool).query('SELECT * FROM ESTADO');
};
  

module.exports = {
    createEstado,
    searchEstadoByName,
    searchEstadoByID,
    deleteEstado,
    updateEstado,
    getAllEstado
}