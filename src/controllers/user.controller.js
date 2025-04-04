import {createUser,findByEmail,encryptPass} from '../db/queryes/user.query'

const create = async (req,res)=>{
    const user = await concatUserInfo(req.body, res)
    const userByEmail = await findByEmail(user.correo)
    if(userByEmail[0].length>0){
        res.status(404).json({message: 'Ya existe un usuario con ese email'})
    }
    else{
        try{
            await createUser(user)
            res.status(201).json({message: 'Usuario creado correctamente'})
        }catch{
            res.status(404).json({message: 'Usuario no creado '})
        }
    }
}

const concatUserInfo = async (info) =>{
    return {
        nombre: info.name,
        correo: info.email,
        rol: info.rol,
        clave: await encryptPass(info.password)
    }
}

module.exports = {
    create,concatUserInfo
  }