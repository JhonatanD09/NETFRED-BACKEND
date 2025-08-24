const express = require('express')
const router = express.Router()
const controller = require('../controllers/contrato.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAccessRole} from '../middlewares/rolesCheck'

router.post('/', [verifyToken], [verifyAccessRole],controller.create);
router.get('/fecha-inicio/:fecha', [verifyToken], [verifyAccessRole], controller.getContratoByFechaInicio);
router.get('/estado/:id_estado', [verifyToken], [verifyAccessRole], controller.getContratoByEstadoId);
router.get('/cliente/:documento', [verifyToken], [verifyAccessRole], controller.getContratoByDocumentoCliente);
router.delete('/:id', [verifyToken], [verifyAccessRole], controller.removeContrato);
router.put('/:id', [verifyToken], [verifyAccessRole], controller.updateContractHandler);
router.get('/', [verifyToken], [verifyAccessRole], controller.getAllContractsHandler);


module.exports = router