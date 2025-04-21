import pool from '../database'

const createPlan = async (plan)=>{
    return (await pool).query('INSERT INTO PLANES SET ?',plan)
}

const searchPlanByName = async (name)=>{
    return(await pool).query('SELECT * FROM PLANES WHERE nombre_plan = ?',name)
}

const searchPlanByID = async (id)=>{
    return(await pool).query('SELECT * FROM PLANES WHERE id_plan = ?',id)
}

const deletePlan = async (id)=>{
    return(await pool).query('DELETE FROM PLANES WHERE id_plan = ?',id)
}

const updatePlan = async (plan, id) => {
    return (await pool).query(
        'UPDATE PLANES SET nombre_plan = ?, tipo_conexion = ?, frecuencia_pago = ?,id_estado = ?, detalles = ? WHERE id_plan = ?',
        [plan.nombre_plan, plan.tipo_conexion,plan.frecuencia_pago, plan.id_estado, plan.detalles, id]
    );
};

const getAllPlan = async () => {
    return (await pool).query('SELECT * FROM PLANES');
};
  

module.exports = {
    createPlan,
    searchPlanByName,
    searchPlanByID,
    deletePlan,
    updatePlan,
    getAllPlan
}