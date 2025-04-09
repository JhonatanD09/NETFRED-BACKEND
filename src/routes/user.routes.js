const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAdminRole} from '../middlewares/rolesCheck'

router.post('/',[verifyToken],[verifyAdminRole], controller.create)

module.exports = router