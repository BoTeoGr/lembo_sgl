import express from 'express'
import {crearUsuario, VerUsuarios} from '../controllers/user.controller.js'
//import {VerInsumos} from '../controllers/insumo.controller.js'
const router = express.Router()

router.get('/users', VerUsuarios)
router.post('/users', crearUsuario);

//router.get('/insumos', VerInsumos);

export default router