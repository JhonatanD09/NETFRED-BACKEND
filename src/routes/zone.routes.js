const express = require('express')
const router = express.Router()
const controller = require('../controllers/zone.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAdminRole} from '../middlewares/rolesCheck'

router.post('/',[verifyToken],[verifyAdminRole], controller.create)
router.delete('/:id', [verifyToken],[verifyAdminRole], controller.remove)
router.get('/nombre/:nombre', [verifyToken],[verifyAdminRole], controller.getZoneByName);
router.get('/id/:id', [verifyToken],[verifyAdminRole], controller.getZoneById);
router.put('/:id', [verifyToken], [verifyAdminRole], controller.update);


module.exports = router