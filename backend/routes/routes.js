import express from 'express'
import {crearUsuario, VerUsuarios} from '../controllers/user.controller.js'
import {VerSensores, crearSensor} from '../controllers/sensor.controller.js'
import {crearInsumo,VerInsumos} from '../controllers/insumo.controller.js'
import {crearCultivo,VerCultivos} from '../controllers/cultivo.controller.js'
const router = express.Router()

// Rutas para usuarios
router.get('/users', VerUsuarios)
router.post('/users', crearUsuario);
// RUtas para sensores
router.get('/sensor', VerSensores)
router.post('/sensor', crearSensor);
// Rutas para insumo
router.get('/insumos', VerInsumos);
router.post('/insumos', crearInsumo);
// Rutas para cultivo
router.get('/cultivos', VerCultivos);
router.post('/cultivos', crearCultivo);

export default router