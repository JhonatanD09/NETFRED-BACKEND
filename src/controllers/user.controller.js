import {createUser,findByEmail,encryptPass} from '../db/queries/user.query'
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