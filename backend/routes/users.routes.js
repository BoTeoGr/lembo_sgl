import express from 'express'
import {crearUsuario, VerUsuarios} from '../controllers/user.controller.js'
const router = express.Router()

router.get('', VerUsuarios)
router.post('', crearUsuario);

export default router