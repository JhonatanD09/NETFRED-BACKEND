const express = require('express')
const router = express.Router()
const controller = require('../controllers/zone.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAccessRole} from '../middlewares/rolesCheck'

router.post('/',[verifyToken],[verifyAccessRole], controller.create)
router.delete('/:id', [verifyToken],[verifyAccessRole], controller.remove)
router.get('/nombre/:nombre', [verifyToken],[verifyAccessRole], controller.getZoneByName);
router.put('/:id', [verifyToken], [verifyAccessRole], controller.update);
router.get('/', [verifyToken], [verifyAccessRole], controller.getAll);
router.get('/clientes/:nombre', [verifyToken], [verifyAccessRole], controller.getClientsByZoneName);
router.get('/clientes/id/:id', [verifyToken], [verifyAccessRole], controller.getClientsByZoneId);
router.get('/resumen', [verifyToken], [verifyAccessRole], controller.getResumenPorZona);
router.get('/id/:id', [verifyToken],[verifyAccessRole], controller.getZoneById);
router.get('/contratos/:id', [verifyToken, verifyAccessRole], controller.getAllContractsByZone);



module.exports = router