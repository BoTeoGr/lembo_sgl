import express from 'express'
import {crearUsuario, VerUsuarios, actualizarEstadoUsuario} from '../controllers/user.controller.js'
import {VerSensores, crearSensor, actualizarEstadoSensor} from '../controllers/sensor.controller.js'
import {crearInsumo,VerInsumos,actualizarEstadoInsumo} from '../controllers/insumo.controller.js'
import {crearCultivo,VerCultivos,actualizarEstadoCultivo} from '../controllers/cultivo.controller.js'
import {VerCiclosCultivo, crearCicloCultivo, actualizarEstadoCicloCultivo} from '../controllers/ciclo-cultivo.controller.js'
import {actualizarProduccion,crearProduccion,eliminarProduccion,obtenerProduccionPorId,verProducciones} from '../controllers/production.controller.js'

const router = express.Router()

// Rutas para usuarios
router.get('/usuarios', VerUsuarios)
router.post('/users', crearUsuario);
router.put('/usuarios/:id/estado', actualizarEstadoUsuario);
// RUtas para sensores
router.get('/sensor', VerSensores)
router.post('/sensor', crearSensor);
router.put('/sensor/:id/estado', actualizarEstadoSensor);
// Rutas para insumos
router.get('/insumos', VerInsumos);
router.post('/insumos', crearInsumo);
router.put('/insumos/:id/estado', actualizarEstadoInsumo);
// Rutas para cultivos
router.get('/cultivos', VerCultivos);
router.post('/cultivos', crearCultivo);
router.put('/cultivos/:id/estado', actualizarEstadoCultivo);
// Rutas para ciclos de cultivo
router.get('/ciclo_cultivo', VerCiclosCultivo);
router.post('/ciclo_cultivo', crearCicloCultivo);
router.put('/ciclo_cultivo/:id/estado', actualizarEstadoCicloCultivo);
// Rutas para producciones
router.get('/producciones', verProducciones);
router.post('/producciones', crearProduccion);
router.get('/producciones/:id', obtenerProduccionPorId);
router.put('/producciones/:id', actualizarProduccion);
router.delete('/producciones/:id', eliminarProduccion);

export default router