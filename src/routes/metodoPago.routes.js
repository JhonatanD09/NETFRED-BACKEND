const express = require('express');
const router = express.Router();
const controller = require('../controllers/metodoPago.controller')
import { verifyToken } from '../middlewares/jwtCheck'
import { verifyAccessRole } from '../middlewares/rolesCheck'

router.post('/', [verifyToken],[verifyAccessRole], controller.create);
router.get('/', [verifyToken],[verifyAccessRole], controller.getAll);
router.get('/:id', [verifyToken],[verifyAccessRole], controller.getById);
router.put('/:id', [verifyToken],[verifyAccessRole], controller.update);
router.delete('/:id', [verifyToken],[verifyAccessRole], controller.remove);

module.exports = router;
