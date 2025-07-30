const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectionAccount.controller');
import { verifyToken } from '../middlewares/jwtCheck'
import { verifyAdminRole } from '../middlewares/rolesCheck'

//router.post('/', [verifyToken, verifyAdminRole], controller.create);
router.get('/generate_data', [verifyToken, verifyAdminRole], controller.getAllBillingDetailsController);
router.get('/', [verifyToken, verifyAdminRole], controller.getAll);
router.put('/:id', [verifyToken, verifyAdminRole], controller.update);
router.delete('/:id', [verifyToken, verifyAdminRole], controller.remove);
router.get('/historial/:documento', [verifyToken, verifyAdminRole],controller.getHistoryByDocument);
router.get('/generate_data_zone/:id',[verifyToken, verifyAdminRole],controller.getBillingDetailsByZonaController);
router.get('/generate_data_por_contrato/:id',[verifyToken, verifyAdminRole],controller.getBillingDetailsByIdContratoController);
router.get('/filtrar-por-fechas', [verifyToken, verifyAdminRole],controller.getCuentasCobroPorFechasController);
router.get('/:id', [verifyToken, verifyAdminRole], controller.getById);
router.post('/registrar-pago', [verifyToken, verifyAdminRole], controller.registrarPagoFactura);
router.post('/',[verifyToken, verifyAdminRole],controller.crearCuentaCobroManual);



module.exports = router;
