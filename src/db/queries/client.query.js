import pool from '../database'

const createClient = async (client)=>{
    console.log("el usuario", client)
    return (await pool).query('INSERT INTO CLIENTE SET ?',client)
 }

const searchClientByCC = async (cc) =>{
    return (await pool).query('SELECT * FROM CLIENTE WHERE numero_documento_cliente = ?',cc)
}
const getAllClients = async () =>{
    return (await pool).query('SELECT * FROM CLIENTE')
}

const deleteClient = async (id)=>{
    return(await pool).query('DELETE FROM CLIENTE WHERE numero_documento_cliente = ?',id)
}

const updateClient = async (client, id) => {
    return (await pool).query(
        'UPDATE CLIENTE SET ? WHERE numero_documento_cliente = ?',
        [client, id]
    );
};

 
 module.exports = {
    createClient, searchClientByCC, deleteClient, updateClient, getAllClients
}