const express = require('express')
const router = express.Router()
const controller = require('../controllers/zone.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAdminRole} from '../middlewares/rolesCheck'

router.post('/',[verifyToken],[verifyAdminRole], controller.create)
router.delete('/:id', [verifyToken],[verifyAdminRole], controller.remove)
router.get('/nombre/:nombre', [verifyToken],[verifyAdminRole], controller.getZoneByName);
router.put('/:id', [verifyToken], [verifyAdminRole], controller.update);
router.get('/', [verifyToken], [verifyAdminRole], controller.getAll);
router.get('/clientes/:nombre', [verifyToken], [verifyAdminRole], controller.getClientsByZoneName);
router.get('/clientes/id/:id', [verifyToken], [verifyAdminRole], controller.getClientsByZoneId);
router.get('/resumen', [verifyToken], [verifyAdminRole], controller.getResumenPorZona);
router.get('/id/:id', [verifyToken],[verifyAdminRole], controller.getZoneById);



module.exports = router