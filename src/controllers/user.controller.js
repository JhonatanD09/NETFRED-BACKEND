import {createUser, findByEmail, findById, getAllUsers, updateUser, updateUserPassword, deleteUser, encryptPass} from '../db/queries/user.query'
import {userMessages} from '../constans/ErrorConstans'

const create = async (req,res)=>{
    const user = await concatUserInfo(req.body, res)
    const userByEmail = await findByEmail(user.correo)
    if(userByEmail[0].length>0){
        res.status(404).json({message: userMessages.USER_EXIST})
    }
    else{
        try{
            await createUser(user)
            res.status(201).json({message: userMessages.USER_ADD})
        }catch{
            res.status(404).json({message: userMessages.USER_NOT_ADD})
        }
    }
}

const getAll = async (req, res) => {
    try {
        const [users] = await getAllUsers();
        res.status(200).json({
            message: "Usuarios obtenidos exitosamente",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const [user] = await findById(id);

        if (user.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        const { clave, ...userWithoutPassword } = user[0];
        res.status(200).json({
            message: "Usuario obtenido exitosamente",
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener usuario",
            error: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = await concatUserInfo(req.body);

        const [existingUser] = await findById(id);
        if (existingUser.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        await updateUser(userInfo, id);
        res.status(200).json({
            message: "Usuario actualizado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar usuario",
            error: error.message
        });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const [existingUser] = await findById(id);
        if (existingUser.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        await deleteUser(id);
        res.status(200).json({
            message: "Usuario eliminado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar usuario",
            error: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "La contraseña es requerida"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        const [existingUser] = await findById(id);
        if (existingUser.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        const hashedPassword = await encryptPass(password);
        await updateUserPassword(hashedPassword, id);
        
        res.status(200).json({
            message: "Contraseña actualizada exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al cambiar contraseña",
            error: error.message
        });
    }
};

const concatUserInfo = async (info) =>{
    const userInfo = {
        nombre: info.name,
        correo: info.email,
        rol: info.rol
    };

    if (info.password) {
        userInfo.clave = await encryptPass(info.password);
    }

    return userInfo;
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    changePassword,
    concatUserInfo
}