const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectionAccount.controller');
import { verifyToken } from '../middlewares/jwtCheck'
import { verifyAccessRole } from '../middlewares/rolesCheck'

//router.post('/', [verifyToken, verifyAccessRole], controller.create);
router.get('/generate_data', [verifyToken, verifyAccessRole], controller.getAllBillingDetailsController);
router.get('/', [verifyToken, verifyAccessRole], controller.getAll);
router.put('/:id', [verifyToken, verifyAccessRole], controller.update);
router.delete('/:id', [verifyToken, verifyAccessRole], controller.remove);
router.get('/historial/:documento', [verifyToken, verifyAccessRole],controller.getHistoryByDocument);
router.get('/generate_data_zone/:id',[verifyToken, verifyAccessRole],controller.getBillingDetailsByZonaController);
router.get('/generate_data_por_contrato/:id',[verifyToken, verifyAccessRole],controller.getBillingDetailsByIdContratoController);
router.get('/contrato/:id', [verifyToken, verifyAccessRole], controller.getCuentasCobroPorContratoController);
router.get('/filtrar-por-fechas', [verifyToken, verifyAccessRole],controller.getCuentasCobroPorFechasController);
router.get('/:id', [verifyToken, verifyAccessRole], controller.getById);
router.post('/registrar-pago', [verifyToken, verifyAccessRole], controller.registrarPagoFactura);
router.post('/',[verifyToken, verifyAccessRole],controller.crearCuentaCobroManual);
router.put('/cuentas/vencidas',[verifyToken, verifyAccessRole], controller.actualizarCuentasVencidas);

module.exports = router;
