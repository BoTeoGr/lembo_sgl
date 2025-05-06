import express from 'express'
import {crearUsuario, VerUsuarios, actualizarEstadoUsuario, actualizarUsuario, obtenerUsuarioPorId} from '../controllers/user.controller.js'
import {VerSensores, crearSensor, actualizarEstadoSensor, actualizarSensor, obtenerSensorPorId} from '../controllers/sensor.controller.js'
import {crearInsumo,VerInsumos,actualizarEstadoInsumo, actualizarInsumo, obtenerInsumoPorId} from '../controllers/insumo.controller.js'
import {crearCultivo,VerCultivos,actualizarEstadoCultivo, actualizarCultivo, obtenerCultivoPorId} from '../controllers/cultivo.controller.js'
import {VerCiclosCultivo, crearCicloCultivo, actualizarEstadoCicloCultivo, obtenerCicloCultivoPorId, actualizarCicloCultivo} from '../controllers/ciclo-cultivo.controller.js'
import {actualizarProduccion,crearProduccion,eliminarProduccion,obtenerProduccionPorId,verProducciones,actualizarEstadoProduccion, obtenerProduccionesPorInsumo, obtenerProduccionesPorCultivo, obtenerProduccionesPorUsuario, obtenerProduccionesPorSensor, actualizarEstadosProduccionHabilitado, deshabilitarProducciones} from '../controllers/production.controller.js'

const router = express.Router()

// Rutas para usuarios
router.get('/usuarios', VerUsuarios)
router.post('/users', crearUsuario);
router.put('/usuarios/:id/estado', actualizarEstadoUsuario);
router.put('/usuarios/:id', actualizarUsuario);
router.get('/usuarios/:id', obtenerUsuarioPorId);
// RUtas para sensores
router.get('/sensor', VerSensores)
router.post('/sensor', crearSensor);
router.put('/sensor/:id/estado', actualizarEstadoSensor);
router.put('/sensor/:id', actualizarSensor);
router.get('/sensor/:id', obtenerSensorPorId); 
// Rutas para insumos
router.get('/insumos', VerInsumos);
router.post('/insumos', crearInsumo);
router.put('/insumos/:id/estado', actualizarEstadoInsumo);
router.put('/insumos/:id', actualizarInsumo);
router.get('/insumos/:id', obtenerInsumoPorId); 
// Rutas para cultivos
router.get('/cultivos', VerCultivos);
router.post('/cultivos', crearCultivo);
router.put('/cultivos/:id/estado', actualizarEstadoCultivo);
router.put('/cultivos/:id', actualizarCultivo);
router.get('/cultivos/:id', obtenerCultivoPorId); 
// Rutas para ciclos de cultivo
router.get('/ciclo_cultivo', VerCiclosCultivo);
router.get('/ciclo_cultivo/:id', obtenerCicloCultivoPorId);
router.post('/ciclo_cultivo', crearCicloCultivo);
router.put('/ciclo_cultivo/:id', actualizarCicloCultivo);
router.put('/ciclo_cultivo/:id/estado', actualizarEstadoCicloCultivo);
// Rutas para producciones
router.get('/producciones', verProducciones);
router.post('/producciones', crearProduccion);
router.get('/producciones/:id', obtenerProduccionPorId);
router.put('/producciones/:id', actualizarProduccion);
router.put('/producciones/:id/estado', actualizarEstadoProduccion);
router.delete('/producciones/:id', eliminarProduccion);
router.get('/producciones/por-usuario/:id', obtenerProduccionesPorUsuario);
router.get('/producciones/por-cultivo/:id', obtenerProduccionesPorCultivo);
router.get('/producciones/por-insumo/:id', obtenerProduccionesPorInsumo);
router.get('/producciones/por-sensor/:id', obtenerProduccionesPorSensor);
router.post('/producciones/habilitar-multiples', actualizarEstadosProduccionHabilitado);
router.post('/producciones/deshabilitar-multiples', deshabilitarProducciones);
export default router