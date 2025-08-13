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

const getAllUsers = async () => {
    return (await pool).query('SELECT id_usuario, nombre, correo, rol FROM USUARIO');
};

const updateUser = async (user, id) => {
    return (await pool).query(
        'UPDATE USUARIO SET nombre = ?, correo = ?, rol = ? WHERE id_usuario = ?',
        [user.nombre, user.correo, user.rol, id]
    );
};

const updateUserPassword = async (hashedPassword, id) => {
    return (await pool).query(
        'UPDATE USUARIO SET clave = ? WHERE id_usuario = ?',
        [hashedPassword, id]
    );
};

const deleteUser = async (id) => {
    return (await pool).query('DELETE FROM USUARIO WHERE id_usuario = ?', id);
};

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
    findById,
    getAllUsers,
    updateUser,
    updateUserPassword,
    deleteUser,
    encryptPass,
    comparePass
}