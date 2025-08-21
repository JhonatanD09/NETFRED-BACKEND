const express = require('express')
const router = express.Router()
const controller = require('../controllers/service.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAccessRole} from '../middlewares/rolesCheck'

router.post('/',[verifyToken],[verifyAccessRole], controller.create)
router.get('/id/:id', [verifyToken],[verifyAccessRole], controller.getServiceById);
router.delete('/:id', [verifyToken],[verifyAccessRole], controller.remove);
router.put('/:id', [verifyToken], [verifyAccessRole], controller.update);
router.get('/', [verifyToken], [verifyAccessRole], controller.getAll);
router.get('/zona/:id', [verifyToken], [verifyAccessRole], controller.getAllServiceByZones);


module.exports = router