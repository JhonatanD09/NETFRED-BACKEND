import {createClient, searchClientByCC, deleteClient, updateClient, getAllClients} from '../db/queries/client.query'
import {clientsMessages} from '../constans/ErrorConstans'

const create = async (req,res) =>{
    const client = await concatClientInfo(req.body)
    const clientByCC = await searchClientByCC(client.numero_documento_cliente)
    if(clientByCC[0].length>0){
        res.status(404).json({message: clientsMessages.CLIENT_EXIST})
    }
    else{
        try{
            console.log(client)
            await createClient(client)
            res.status(201).json({message: clientsMessages.CLIENT_ADD})
        }catch{
            res.status(404).json({message: clientsMessages.CLIENT_NOT_ADD})
        }
    }
}

const concatClientInfo = async (info) =>{
    return{
        numero_documento_cliente: info.cc,
        nombres_completos: info.fullName,
        tipo_documento : info.typeDoc,
        celular : info.phoneNumber,
        direccion : info.address,
        correo : info.mail,
        fecha_inscripcion: new Date(),
        id_estado : info.id_state
    }
}

const getClientById = async (req,res) =>{
    const id = req.params.id;
    try{
        const result = await searchClientByCC(id);
        if (result[0].length > 0) {
            res.status(201).json(result[0][0]);
        } else{
            res.status(404).json({ message: clientsMessages.CLIENT_NOT_FOUND });
        }
    } catch (error){
        res.status(404).json({ message: clientsMessages.ERROR_SEARCH_CLIENT });
    }
}

const remove = async(req,res)=>{
    const id = req.params.id
    const client = await searchClientByCC(id)
    if (client[0].length === 0) {
        res.status(404).json({ message: clientsMessages.CLIENT_NOT_FOUND })
    }
    else{
        try{
            await deleteClient(id)
            res.status(201).json({ message: clientsMessages.CLIENT_DELETED })
        }catch{
            res.status(404).json({ message: clientsMessages.CLIENT_NOT_DELETED })
        }
    }
}

const getAll = async(req,res)=>{
    try{
        const result = await getAllClients()
        res.status(200).json(result[0])
    }catch{
        res.status(404).json({ message: clientsMessages.NO_CLIENTS })
    }
    
}

const update = async (req, res) => {
    const id = req.params.id;
    const client = await concatClientInfo(req.body);

    try {
        const existing = await searchClientByCC(id);
        if (existing[0].length === 0) {
            return res.status(404).json({ message: clientsMessages.CLIENT_NOT_FOUND });
        }

        await updateClient(client, id);
        res.status(200).json({ message: clientsMessages.CLIENT_UPDATED });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: clientsMessages.CLIENT_NOT_UPDATED });
    }
};

module.exports = {
    create,concatClientInfo, getClientById, remove, update, getAll
}
