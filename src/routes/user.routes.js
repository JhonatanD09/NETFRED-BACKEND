const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAdminRole} from '../middlewares/rolesCheck'

router.post('/', [verifyToken], [verifyAdminRole], controller.create)
router.get('/', [verifyToken], [verifyAdminRole], controller.getAll)
router.get('/:id', [verifyToken], [verifyAdminRole], controller.getById)
router.put('/:id', [verifyToken], [verifyAdminRole], controller.update)
router.put('/:id/password', [verifyToken], [verifyAdminRole], controller.changePassword)
router.delete('/:id', [verifyToken], [verifyAdminRole], controller.remove)

module.exports = router