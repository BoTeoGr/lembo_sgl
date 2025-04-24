import express from 'express'
import {crearUsuario, VerUsuarios, actualizarEstadoUsuario} from '../controllers/user.controller.js'
import {VerSensores, crearSensor, actualizarEstadoSensor, actualizarSensor, obtenerSensorPorId} from '../controllers/sensor.controller.js'
import {crearInsumo,VerInsumos,actualizarEstadoInsumo, actualizarInsumo, obtenerInsumoPorId} from '../controllers/insumo.controller.js'
import {crearCultivo,VerCultivos,actualizarEstadoCultivo, actualizarCultivo, obtenerCultivoPorId} from '../controllers/cultivo.controller.js'
import {VerCiclosCultivo, crearCicloCultivo, actualizarEstadoCicloCultivo} from '../controllers/ciclo-cultivo.controller.js'
import {actualizarProduccion,crearProduccion,eliminarProduccion,obtenerProduccionPorId,verProducciones,actualizarEstadoProduccion} from '../controllers/production.controller.js'

const router = express.Router()

// Rutas para usuarios
router.get('/usuarios', VerUsuarios)
router.post('/usuarios', crearUsuario);
router.put('/usuarios/:id/estado', actualizarEstadoUsuario);
<<<<<<< HEAD
// RUtas para sensores
router.get('/sensor', VerSensores)
router.post('/sensor', crearSensor);
router.put('/sensor/:id/estado', actualizarEstadoSensor);
router.put('/sensor/:id', actualizarSensor);
router.get('/sensor/:id', obtenerSensorPorId); 
=======

// Rutas para sensores
router.get('/sensores', VerSensores)
router.post('/sensores', crearSensor);
router.put('/sensores/:id/estado', actualizarEstadoSensor);

>>>>>>> 38f816197af6532551f856fc090865efe2598faa
// Rutas para insumos
router.get('/insumos', VerInsumos);
router.post('/insumos', crearInsumo);
router.put('/insumos/:id/estado', actualizarEstadoInsumo);
<<<<<<< HEAD
router.put('/insumos/:id', actualizarInsumo);
router.get('/insumos/:id', obtenerInsumoPorId); 
=======

>>>>>>> 38f816197af6532551f856fc090865efe2598faa
// Rutas para cultivos
router.get('/cultivos', VerCultivos);
router.post('/cultivos', crearCultivo);
router.put('/cultivos/:id/estado', actualizarEstadoCultivo);
router.put('/cultivos/:id', actualizarCultivo);
router.get('/cultivos/:id', obtenerCultivoPorId); 
// Rutas para ciclos de cultivo
router.get('/ciclos', VerCiclosCultivo);
router.post('/ciclos', crearCicloCultivo);
router.put('/ciclos/:id/estado', actualizarEstadoCicloCultivo);

// Rutas para producciones
router.get('/producciones', verProducciones);
router.post('/producciones', crearProduccion);
router.get('/producciones/:id', obtenerProduccionPorId);
router.put('/producciones/:id', actualizarProduccion);
router.put('/producciones/:id/estado', actualizarEstadoProduccion);
router.delete('/producciones/:id', eliminarProduccion);

export default router