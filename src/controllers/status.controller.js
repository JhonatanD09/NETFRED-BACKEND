import {createEstado, searchEstadoByName, searchEstadoByID, deleteEstado, updateEstado, getAllEstado} from '../db/queries/status.query'
import {statusMessages} from '../constans/ErrorConstans'

const create = async (req,res) =>{
    const status = await concatStatusInfo(req.body)
    const statusByName = await searchEstadoByName(status.nombre_estado)
    /*if(statusByName[0].length>0){
        res.status(404).json({message: statusMessages.STATUS_EXIST})
    }
    else{*/
        try{
            await createEstado(status)
            res.status(201).json({message: statusMessages.STATUS_ADD})
        }catch(error){
            console.error(error);
            res.status(404).json({message: statusMessages.STATUS_NOT_ADD})
        }
    //}
}

const getStatusByName = async (req,res) =>{
    const nombre = req.params.nombre;
    try{
        const result = await searchEstadoByName(nombre);
        if (result[0].length > 0) {
            res.status(201).json(result[0][0]);
        } else{
            res.status(404).json({ message: statusMessages.STATUS_NOT_FOUND });
        }
    } catch (error){
        res.status(404).json({ message: statusMessages.ERROR_SEARCH_STATUS });
    }
}

const getStatusById = async (req,res) =>{
    const id = req.params.id;
    try{
        const result = await searchEstadoByID(id);
        if (result[0].length > 0) {
            res.status(201).json(result[0][0]);
        } else{
            res.status(404).json({ message: statusMessages.STATUS_NOT_FOUND });
        }
    } catch (error){
        res.status(404).json({ message: statusMessages.ERROR_SEARCH_STATUS });
    }
}

const remove = async(req,res)=>{
    const id = req.params.id
    const status = await searchEstadoByID(id)
    if (status[0].length === 0) {
        res.status(404).json({ message: statusMessages.STATUS_NOT_FOUND })
    }
    else{
        try{
            await deleteEstado(id)
            res.status(201).json({ message: statusMessages.STATUS_DELETED })
        }catch(error){
            console.log(error);
            
            res.status(404).json({ message: statusMessages.STATUS_NOT_DELETED })
        }
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const status = await concatStatusInfo(req.body);

    try {
        const existing = await searchEstadoByID(id);
        if (existing[0].length === 0) {
            return res.status(404).json({ message: statusMessages.STATUS_NOT_FOUND });
        }

        await updateEstado(status, id);
        res.status(200).json({ message: statusMessages.STATUS_UPDATED });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: statusMessages.STATUS_NOT_UPDATED });
    }
};

const concatStatusInfo = async (info) =>{
    return{
        nombre_estado: info.name,
        tabla_referencia: info.tabla_referencia
    }
}

const getAll = async (req, res) => {
    try {
      const [results] = await getAllEstado();
      res.status(200).json(results);
    } catch (error) {
      console.error('Error al obtener los planes:', error);
      res.status(500).json({ message: statusMessages.GET_ALL_STATUS_ERROR });
    }
};
  

module.exports = {
    create,concatStatusInfo,getStatusByName,getStatusById,remove, update, getAll
}