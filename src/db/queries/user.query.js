const bcrypt = require("bcryptjs");
import pool from '../database'

const createUser = async (user)=>{
   console.log("el usuario", user)
   return (await pool).query('INSERT INTO USUARIO SET ?',user)
}

const findByEmail = async (email)=>{
    return (await pool).query('SELECT * FROM USUARIO WHERE correo = ?', email)
}

const findById = async (id)=>{
    return (await pool).query('SELECT * FROM usuario WHERE id_usuario = ?', id)
}

const encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };

const comparePass = async (password, receivedPass) => {
    return await bcrypt.compare(password, receivedPass);
};

module.exports = {
    createUser,
    findByEmail,
    encryptPass,
    comparePass,
    findById
}