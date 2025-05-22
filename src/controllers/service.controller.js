import {createService, searchServiceByID, deleteService, updateService, getAllService} from '../db/queries/service.query'
import {planesMessages, servicesMessages} from '../constans/ErrorConstans'

const create = async (req,res) =>{
    const service = await concatServiceInfo(req.body)
    try{
        await createService(service)
        res.status(201).json({message: servicesMessages.SERVICE_ADD})
    }catch(error){
        console.error(error);
        res.status(404).json({message: servicesMessages.SERVICE_NOT_ADD})
    }
}

const getServiceById = async (req,res) =>{
    const id = req.params.id;
    try{
        const result = await searchServiceByID(id);
        if (result[0].length > 0) {
            res.status(201).json(result[0][0]);
        } else{
            res.status(404).json({ message: servicesMessages.SERVICE_NOT_FOUND });
        }
    } catch (error){
        res.status(404).json({ message: servicesMessages.ERROR_SEARCH_SERVICE });
    }
}

const remove = async(req,res)=>{
    const id = req.params.id
    const service = await searchServiceByID(id)
    if (service[0].length === 0) {
        res.status(404).json({ message: servicesMessages.SERVICE_NOT_FOUND })
    }
    else{
        try{
            await deleteService(id)
            res.status(201).json({ message: servicesMessages.SERVICE_DELETED })
        }catch(error){
            console.log(error);
            
            res.status(404).json({ message: servicesMessages.SERVICE_NOT_DELETED })
        }
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const service = await concatServiceInfo(req.body);

    try {
        const existing = await searchServiceByID(id);
        if (existing[0].length === 0) {
            return res.status(404).json({ message: servicesMessages.SERVICE_NOT_FOUND });
        }

        await updateService(service, id);
        res.status(200).json({ message: servicesMessages.SERVICE_UPDATED });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: servicesMessages.SERVICE_NOT_UPDATED });
    }
};

const concatServiceInfo = async (info) =>{
    return{
        id_zona: info.zoneId,
        id_plan: info.planId,
        id_estado: info.stateId,
        precio: info.precio
    }
}

const getAll = async (req, res) => {
    try {
      const [results] = await getAllService();
      res.status(200).json(results);
    } catch (error) {
      console.error('Error al obtener los planes:', error);
      res.status(500).json({ message: servicesMessages.GET_ALL_SERVICE_ERROR });
    }
};
  

module.exports = {
    create,concatServiceInfo,getServiceById,remove,update,getAll
}