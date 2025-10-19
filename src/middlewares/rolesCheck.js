import {valideRolesMessages} from '../constans/ErrorConstans'
import {ROLES} from '../constans/UtilConstans'

export const verifyAdminRole = async(req, res, next) =>{
    try{
        let user = req.user[0][0]
        if(user.rol != ROLES.ADMIN_ROLE) return res.status(404).json({ message: valideRolesMessages.NO_ROLE_REQUIRED })
        next()
    }catch (err){
        res.status(400).json({ message: err.message })
    }
}

export const verifyAccessRole = async(req, res, next) =>{
    try{
        let user = req.user[0][0]
        if(user.rol != ROLES.ADMIN_ROLE && user.rol != ROLES.USER && user.rol != ROLES.USUARIO) {
            return res.status(403).json({ message: valideRolesMessages.NO_ROLE_REQUIRED })
        }
        next()
    }catch (err){
        res.status(400).json({ message: err.message })
    }
}

export const verifyAdminOrUserRole = async(req, res, next) =>{
    try{
        let user = req.user[0][0]
        if(user.rol != ROLES.ADMIN_ROLE && user.rol != ROLES.USER && user.rol != ROLES.USUARIO) {
            return res.status(403).json({ message: valideRolesMessages.NO_ROLE_REQUIRED })
        }
        next()
    }catch (err){
        res.status(400).json({ message: err.message })
    }
}