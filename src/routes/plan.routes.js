const express = require('express')
const router = express.Router()
const controller = require('../controllers/plan.controller')
import {verifyToken} from '../middlewares/jwtCheck'
import {verifyAccessRole} from '../middlewares/rolesCheck'

router.post('/',[verifyToken],[verifyAccessRole], controller.create)
router.get('/nombre/:nombre', [verifyToken],[verifyAccessRole], controller.getPlanByName);
router.get('/id/:id', [verifyToken],[verifyAccessRole], controller.getPlanById);
router.delete('/:id', [verifyToken],[verifyAccessRole], controller.remove);
router.put('/:id', [verifyToken], [verifyAccessRole], controller.update);
router.get('/', [verifyToken], [verifyAccessRole], controller.getAll);




module.exports = router