import {createPlan, searchPlanByName, searchPlanByID, deletePlan, updatePlan, getAllPlan, getEstadoId, getServiciosActivosByPlanId} from '../db/queries/plan.query'
import {planesMessages} from '../constans/ErrorConstans'

const create = async (req,res) =>{
    const plan = await concatPlanInfo(req.body)
    const planByName = await searchPlanByName(plan.nombre_plan)
    if(planByName[0].length>0){
        res.status(404).json({message: planesMessages.PLAN_EXIST})
    }
    else{
        try{
            await createPlan(plan)
            res.status(201).json({message: planesMessages.PLAN_ADD})
        }catch(error){
            console.error(error);
            res.status(404).json({message: planesMessages.PLAN_NOT_ADD})
        }
    }
}

const getPlanByName = async (req,res) =>{
    const nombre = req.params.nombre;
    try{
        const result = await searchPlanByName(nombre);
        if (result[0].length > 0) {
            res.status(201).json(result[0][0]);
        } else{
            res.status(404).json({ message: planesMessages.PLAN_NOT_FOUND });
        }
    } catch (error){
        res.status(404).json({ message: planesMessages.ERROR_SEARCH_PLAN });
    }
}

const getPlanById = async (req,res) =>{
    const id = req.params.id;
    try{
        const result = await searchPlanByID(id);
        if (result[0].length > 0) {
            res.status(201).json(result[0][0]);
        } else{
            res.status(404).json({ message: planesMessages.PLAN_NOT_FOUND });
        }
    } catch (error){
        res.status(404).json({ message: planesMessages.ERROR_SEARCH_PLAN });
    }
}

const remove = async(req,res)=>{
    const id = req.params.id
    const plan = await searchPlanByID(id)
    if (plan[0].length === 0) {
        res.status(404).json({ message: planesMessages.PLAN_NOT_FOUND })
    }
    else{
        try{
            await deletePlan(id)
            res.status(201).json({ message: planesMessages.PLAN_DELETED })
        }catch(error){
            console.log(error);
            
            res.status(404).json({ message: planesMessages.PLAN_NOT_DELETED })
        }
    }
}

const update = async (req, res) => {
  const id = req.params.id;
  const plan = await concatPlanInfo(req.body);

  try {
    const existing = await searchPlanByID(id);
    if (existing[0].length === 0) {
      return res.status(404).json({ message: planesMessages.PLAN_NOT_FOUND });
    }

    // Verificar si el nuevo estado es "Inactivo"
    const estadoInactivoId = await getEstadoId('Inactivo', 'Planes');
    const estadoActivoId = await getEstadoId('Activo', 'Servicios');
    
    if (plan.id_estado == estadoInactivoId) {
        const serviciosActivos = await getServiciosActivosByPlanId(id, estadoActivoId);

        if (serviciosActivos > 0) {
            return res.status(400).json({
                message: planesMessages.ERROR_CHANGE_STATUS_BY_SERVICE_ASSOCIATED
            });
        } 
    }

    await updatePlan(plan, id);
    res.status(200).json({ message: planesMessages.PLAN_UPDATED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: planesMessages.PLAN_NOT_UPDATED });
  }
};


const concatPlanInfo = async (info) =>{
    return{
        nombre_plan: info.name,
        tipo_conexion: info.connectionType,
        frecuencia_pago: info.paymentFrequency,
        id_estado: info.stateId,
        detalles: info.details
    }
}

const getAll = async (req, res) => {
    try {
      const [results] = await getAllPlan();
      res.status(200).json(results);
    } catch (error) {
      console.error('Error al obtener los planes:', error);
      res.status(500).json({ message: planesMessages.GET_ALL_PLAN_ERROR });
    }
};
  

module.exports = {
    create,concatPlanInfo,getPlanByName,getPlanById,remove, update, getAll
}