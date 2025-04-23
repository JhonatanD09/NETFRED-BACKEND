const express = require('express')
const router = express.Router()
const controller = require('../controllers/client.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAdminRole} from '../middlewares/rolesCheck'

router.post('/',[verifyToken],[verifyAdminRole], controller.create)
router.delete('/:id', [verifyToken],[verifyAdminRole], controller.remove)
router.get('/:id', [verifyToken],[verifyAdminRole], controller.getClientById);
router.get('/', [verifyToken],[verifyAdminRole], controller.getAll);
router.put('/:id', [verifyToken], [verifyAdminRole], controller.update);

module.exports = router