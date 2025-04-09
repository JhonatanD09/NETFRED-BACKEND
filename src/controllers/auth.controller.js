import  {findByEmail, comparePass} from '../db/queries/user.query'
const  jwt = require('jsonwebtoken')
import { app} from '../config'

const login = async (req, res)=>{
    const {email, password} = req.body;
    const data = await findByEmail(email)
    if(data[0].length>0){
        let user = data[0][0]
        if(await comparePass(password,user.clave)){
            const token = jwt.sign(
                {id: user.id_usuario},
                app.secret
                ,{expiresIn : app.expired})
            res.status(200).json({
                token: token,
                id_user: user.id_usuario,
                name: user.nombre,
                email: user.correo,
                rol: user.rol
            })
        }else{
            res.status(404).json({message: "Contraseña incorrecta"})
        }
    }else{
        res.status(404).json({message: "Email no registrado"})
    }
}

module.exports = {
  login  
} 