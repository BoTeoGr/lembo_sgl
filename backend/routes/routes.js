import express from 'express'
import {crearUsuario, VerUsuarios} from '../controllers/user.controller.js'
import {VerSensores, crearSensor} from '../controllers/sensor.controller.js'
import {crearInsumo,VerInsumos} from '../controllers/insumo.controller.js'
import {crearCultivo,VerCultivos} from '../controllers/cultivo.controller.js'
import {VerCiclosCultivo, crearCicloCultivo} from '../controllers/ciclo-cultivo.controller.js'
import {actualizarProduccion,crearProduccion,eliminarProduccion,obtenerProduccionPorId,verProducciones} from '../controllers/production.controller.js'

const router = express.Router()

// Rutas para usuarios
router.get('/users', VerUsuarios)
router.post('/users', crearUsuario);
// RUtas para sensores
router.get('/sensor', VerSensores)
router.post('/sensor', crearSensor);
// Rutas para insumos
router.get('/insumos', VerInsumos);
router.post('/insumos', crearInsumo);
// Rutas para cultivos
router.get('/cultivos', VerCultivos);
router.post('/cultivos', crearCultivo);
// Rutas para ciclos de cultivo
router.get('/ciclo_cultivo', VerCiclosCultivo);
router.post('/ciclo_cultivo', crearCicloCultivo);
// Rutas para producciones
router.get('/producciones', verProducciones);
router.post('/producciones', crearProduccion);
router.get('/producciones/:id', obtenerProduccionPorId);
router.put('/producciones/:id', actualizarProduccion);
router.delete('/producciones/:id', eliminarProduccion);

export default router