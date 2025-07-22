import {createContrato,searchContratoByFechaInicio,searchContratoByEstadoId,searchContratoByDocumentoCliente,searchContratoByID,deleteContrato,updateContract,getAllContracts} from '../db/queries/contrato.query'
import {contratoMessages} from '../constans/ErrorConstans'

const create = async (req, res) => {
    const contrato = await concatContractInfo(req.body);    
    try {
        const contratoId = await createContrato(contrato);
        res.status(201).json({ 
            message: contratoMessages.CONTRATO_ADD,
            contratoId: contratoId,
            data: {
                id: contratoId,
                ...contrato
            }
        });
    } catch (error) {
        console.error("Error al crear el contrato:", error);
        res.status(500).json({ message: contratoMessages.ERROR_CONTRATO_ADD });
    }
};



const getContratoByFechaInicio = async (req, res) => {
    const fecha = req.params.fecha;
    try {
        const [result] = await searchContratoByFechaInicio(fecha);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: contratoMessages.CONTRATO_BY_START_DATE_NOT_FOUND });
        }
    } catch (error) {
        console.error('Error al buscar contratos:', error);
        res.status(500).json({ message:  contratoMessages.ERROR_SEARCH_CONTRATO_BY_START_DATE});
    }
};

const getContratoByEstadoId = async (req, res) => {
    const id_estado = req.params.id_estado;

    try {
        const [result] = await searchContratoByEstadoId(id_estado);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: contratoMessages.SEARCH_CONTRATO_BY_STATUS_NOT_FOUND });
        }
    } catch (error) {
        console.error("Error al obtener contrato por estado:", error);
        res.status(500).json({ message: contratoMessages.ERROR_SEARCH_CONTRATO_BY_STATUS });
    }
};

const getContratoByDocumentoCliente = async (req, res) => {
    const documento = req.params.documento;

    try {
        const [result] = await searchContratoByDocumentoCliente(documento);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: contratoMessages.SEARCH_CONTRATO_BY_ID_CLIENT_NOT_FOUND });
        }
    } catch (error) {
        console.error("Error al obtener contrato por documento del cliente:", error);
        res.status(500).json({ message: contratoMessages.ERROR_SEARCH_CONTRATO_BY_ID_CLIENT });
    }
};

const removeContrato = async (req, res) => {
    const id = req.params.id;

    const contrato = await searchContratoByID(id);
    if (contrato[0].length === 0) {
        res.status(404).json({ message: contratoMessages.CONTRATO_NOT_FOUND });
    } else {
        try {
            await deleteContrato(id);
            res.status(200).json({ message: contratoMessages.CONTRATO_DELETED });
        } catch (error) {
            console.error("Error al eliminar contrato:", error);
            res.status(500).json({ message: contratoMessages.CONTRATO_NOT_DELETED });
        }
    }
};


const concatContractInfo = async (info) => {
    return {
        fecha_inicio: info.startDate,
        id_estado: info.statusId,
        fecha_terminacion: info.endDate,
        id_servicio: info.serviceId,
        fecha_inscripcion: info.inscriptionDate,
        numero_documento_cliente: info.clientDocument,
        ubicacion: info.location,
        Georreferencia: info.georeference
    };
};

const updateContractHandler = async (req, res) => {
    const id = req.params.id;
    const contract = req.body;

    try {
        const existing = await searchContratoByID(id);
        if (existing[0].length === 0) {
            return res.status(404).json({ message: contratoMessages.CONTRATO_NOT_FOUND });
        }

        await updateContract(contract, id);
        res.status(200).json({ message: contratoMessages.CONTRATO_UPDATED });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: contratoMessages.CONTRATO__NOT_UPDATED });
    }
};

const getAllContractsHandler = async (req, res) => {
    try {
        const [contracts] = await getAllContracts();
        res.status(200).json(contracts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: contratoMessages.ERROR_GET_ALL_CONTRATO });
    }
};



module.exports = {
    create,getContratoByFechaInicio,concatContractInfo,getContratoByEstadoId,getContratoByDocumentoCliente,removeContrato,updateContractHandler,getAllContractsHandler
}
