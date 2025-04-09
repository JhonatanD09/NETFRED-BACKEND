
export const verifyAdminRole = async(req, res, next) =>{
    try{
        let user = req.user[0][0]
        if(user.rol != 'ADMIN') return res.status(404).json({ message: 'No cuentas con los permisos para acceder a este recurso' })
        next()
    }catch (err){
        res.status(400).json({ message: err.message })
    }
}