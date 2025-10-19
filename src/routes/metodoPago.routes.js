const express = require('express');
const router = express.Router();
const controller = require('../controllers/metodoPago.controller')
import { verifyToken } from '../middlewares/jwtCheck'
import { verifyAdminOrUserRole, verifyAdminRole } from '../middlewares/rolesCheck'

router.post('/', [verifyToken, verifyAdminRole], controller.create);
router.get('/', [verifyToken, verifyAdminOrUserRole], controller.getAll);
router.get('/:id', [verifyToken, verifyAdminOrUserRole], controller.getById);
router.get('/:id/usage', [verifyToken, verifyAdminOrUserRole], controller.checkUsage);
router.put('/:id', [verifyToken, verifyAdminOrUserRole], controller.update);
router.delete('/:id', [verifyToken, verifyAdminRole], controller.remove);

module.exports = router;
