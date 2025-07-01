import {createZone,searchZoneByName, searchZoneByID, deleteZone, updateZone, getAllZones, getClientesByZoneName, getClientesByZoneId, getResumenZona } from '../db/queries/zone.query'
import {zonesMessages} from '../constans/ErrorConstans'

const create = async (req,res) =>{
    const zone = await concatZoneInfo(req.body)
    const zoneByName = await searchZoneByName(zone.nombre)
    if(zoneByName[0].length>0){
        res.status(404).json({message: zonesMessages.ZONE_EXIST})
    }
    else{
        try{
            var idZone = await createZone(zone)
            res.status(201).json({message: zonesMessages.ZONE_ADD , value: idZone})
        }catch{
            res.status(404).json({message: zonesMessages.ZONE_NOT_ADD})
        }
    }
}

const getZoneByName = async (req,res) =>{
    const nombre = req.params.nombre;
    try{
        const result = await searchZoneByName(nombre);
        if (result[0].length > 0) {
            res.status(200).json(result[0][0]);
        } else{
            res.status(404).json({ message: zonesMessages.ZONE_NOT_FOUND });
        }
    } catch (error){
        res.status(500).json({ message: zonesMessages.ERROR_SEARCH_ZONE });
    }
}

const getZoneById = async (req,res) =>{
    const id = req.params.id;
    try{
        const result = await searchZoneByID(id);
        if (result[0].length > 0) {
            res.status(200).json(result[0][0]);
        } else{
            res.status(404).json({ message: zonesMessages.ZONE_NOT_FOUND });
        }
    } catch (error){
        res.status(500).json({ message: zonesMessages.ERROR_SEARCH_ZONE });
    }
}

const remove = async(req,res)=>{
    const id = req.params.id
    const zone = await searchZoneByID(id)
    if (zone[0].length === 0) {
        res.status(404).json({ message: zonesMessages.ZONE_NOT_FOUND })
    }
    else{
        try{
            await deleteZone(id)
            res.status(201).json({ message: zonesMessages.ZONE_DELETED })
        }catch{
            res.status(404).json({ message: zonesMessages.ZONE_NOT_DELETED })
        }
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const zone = await concatZoneInfo(req.body);

    try {
        const existing = await searchZoneByID(id);
        if (existing[0].length === 0) {
            return res.status(404).json({ message: zonesMessages.ZONE_NOT_FOUND });
        }

        await updateZone(zone, id);
        res.status(200).json({ message: zonesMessages.ZONE_UPDATED });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: zonesMessages.ZONE_NOT_UPDATED });
    }
};

const getAll = async (req, res) => {
    try {
      const [results] = await getAllZones();
      res.status(200).json(results);
    } catch (error) {
      console.error('Error al obtener las zonas:', error);
      res.status(500).json({ message: zonesMessages.GET_ALL_ZONES_ERROR });
    }
};

const concatZoneInfo = async (info) =>{
    return{
        nombre: info.name,
        detalles: info.details
    }
}

const getClientsByZoneName = async (req, res) => {
    const nombreZona = req.params.nombre;

    // Agregar headers para evitar caché
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });

    try {
        const clientes = await getClientesByZoneName(nombreZona);
        if (clientes && clientes.length > 0) {
            return res.status(200).json(clientes);
        } else {
            return res.status(404).json({ message: zonesMessages.ZONE_CLIENTS_NOT_FOUND });
        }
    } catch (error) {
        console.error("Error al buscar clientes por zona:", error);
        return res.status(500).json({ message: zonesMessages.ZONE_CLIENTS_FETCH_ERROR });
    }
};

const getClientsByZoneId = async (req, res) => {
    const idZona = req.params.id;

    // Agregar headers para evitar caché
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });

    try {
        const clientes = await getClientesByZoneId(idZona);
        if (clientes && clientes.length > 0) {
            return res.status(200).json(clientes);
        } else {
            return res.status(404).json({ message: zonesMessages.ZONE_CLIENTS_NOT_FOUND });
        }
    } catch (error) {
        console.error("Error al buscar clientes por ID de zona:", error);
        return res.status(500).json({ message: zonesMessages.ZONE_CLIENTS_FETCH_ERROR });
    }
};

const getResumenPorZona = async (req, res) => {
    try {
        const [result] = await getResumenZona();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener resumen de zonas:", error);
        res.status(500).json({ message: "Error al obtener el resumen de zonas." });
    }
};


module.exports = {
    create,concatZoneInfo,remove,getZoneByName,getZoneById,update,getAll,getClientsByZoneName,getClientsByZoneId,getResumenPorZona
}