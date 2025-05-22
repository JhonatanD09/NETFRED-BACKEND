const express = require('express')
const router = express.Router()
const controller = require('../controllers/contrato.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAdminRole} from '../middlewares/rolesCheck'

router.post('/', [verifyToken], [verifyAdminRole],controller.create);
router.get('/fecha-inicio/:fecha', [verifyToken], [verifyAdminRole], controller.getContratoByFechaInicio);
router.get('/estado/:id_estado', [verifyToken], [verifyAdminRole], controller.getContratoByEstadoId);
router.get('/cliente/:documento', [verifyToken], [verifyAdminRole], controller.getContratoByDocumentoCliente);
router.delete('/:id', [verifyToken], [verifyAdminRole], controller.removeContrato);
router.put('/:id', [verifyToken], [verifyAdminRole], controller.updateContractHandler);
router.get('/', [verifyToken], [verifyAdminRole], controller.getAllContractsHandler);


module.exports = router