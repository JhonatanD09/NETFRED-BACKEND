const express = require('express')
const router = express.Router()
const controller = require('../controllers/client.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAccessRole} from '../middlewares/rolesCheck'

router.post('/',[verifyToken],[verifyAccessRole], controller.create)
router.delete('/:id', [verifyToken],[verifyAccessRole], controller.remove)
router.get('/:id', [verifyToken],[verifyAccessRole], controller.getClientById);
router.get('/', [verifyToken],[verifyAccessRole], controller.getAll);
router.put('/:id', [verifyToken], [verifyAccessRole], controller.update);

module.exports = router