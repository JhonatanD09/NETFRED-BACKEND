import pool from '../database'

const createContrato = async (contrato)=>{
    return (await pool).query('INSERT INTO CONTRATO SET ?',contrato)
}

const searchContratoByFechaInicio = async (fechaInicio) => {
    return (await pool).query('SELECT * FROM CONTRATO WHERE fecha_inicio = ?',fechaInicio);
};

const searchContratoByEstadoId = async (id_estado) => {
    return (await pool).query('SELECT * FROM CONTRATO WHERE id_estado = ?', id_estado);
};

const searchContratoByDocumentoCliente = async (documento) => {
    return (await pool).query('SELECT * FROM CONTRATO WHERE numero_documento_cliente = ?', documento);
};

const searchContratoByID = async (id) => {
    return (await pool).query('SELECT * FROM contrato WHERE id_contrato = ?', id);
};


const deleteContrato = async (id) => {
    return (await pool).query('DELETE FROM CONTRATO WHERE id_contrato = ?', id);
};

const updateContract = async (contract, id) => {
    return (await pool).query(
        `UPDATE CONTRATO SET 
            fecha_inicio = ?, 
            id_estado = ?, 
            fecha_terminacion = ?, 
            id_servicio = ?, 
            fecha_inscripcion = ?, 
            numero_documento_cliente = ?, 
            ubicacion = ?, 
            Georreferencia = ?
         WHERE id_contrato = ?`,
        [
            contract.startDate,
            contract.statusId,
            contract.endDate,
            contract.serviceId,
            contract.inscriptionDate,
            contract.clientDocument,
            contract.location,
            contract.georeference,
            id
        ]
    );
};

const getAllContracts = async () => {
    return (await pool).query(
        'SELECT * FROM CONTRATO'
    );
};






module.exports = {
    createContrato,
    searchContratoByFechaInicio,
    searchContratoByEstadoId,
    searchContratoByDocumentoCliente,
    searchContratoByID,
    deleteContrato,
    updateContract,
    getAllContracts
}