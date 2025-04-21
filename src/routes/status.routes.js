const express = require('express')
const router = express.Router()
const controller = require('../controllers/status.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAdminRole} from '../middlewares/rolesCheck'

router.post('/',[verifyToken],[verifyAdminRole], controller.create)
router.get('/nombre/:nombre', [verifyToken],[verifyAdminRole], controller.getStatusByName);
router.get('/id/:id', [verifyToken],[verifyAdminRole], controller.getStatusById);
router.delete('/:id', [verifyToken],[verifyAdminRole], controller.remove);
router.put('/:id', [verifyToken], [verifyAdminRole], controller.update);
router.get('/', [verifyToken], [verifyAdminRole], controller.getAll);




module.exports = router