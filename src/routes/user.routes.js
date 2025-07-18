const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAdminRole} from '../middlewares/rolesCheck'

router.post('/', controller.create)

module.exports = router