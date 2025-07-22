import pool from '../database'

const formatDateForMySQL = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const createContrato = async (contrato) => {
    const contratoFormatted = {
        ...contrato,
        fecha_inicio: formatDateForMySQL(contrato.fecha_inicio),
        fecha_terminacion: formatDateForMySQL(contrato.fecha_terminacion),
        fecha_inscripcion: formatDateForMySQL(contrato.fecha_inscripcion)
    };

    const [result] = await (await pool).query('INSERT INTO CONTRATO SET ?', contratoFormatted);
    return result.insertId;
};

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
            fecha_inscripcion = ?, 
            ubicacion = ?, 
            Georreferencia = ?
         WHERE id_contrato = ?`,
        [
            formatDateForMySQL(contract.startDate),
            contract.statusId,
            formatDateForMySQL(contract.endDate),
            formatDateForMySQL(contract.inscriptionDate),
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