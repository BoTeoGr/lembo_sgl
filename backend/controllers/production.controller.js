import db from './../db/config.db.js';

export function verProducciones(req, res) {
    try {
        console.log("object");
        // Consulta con JOIN para obtener información relacionada
        const query = `
            SELECT p.*, 
                u.nombre AS nombre_usuario,
                c.nombre AS nombre_cultivo,
                cc.nombre AS nombre_ciclo
            FROM producciones p
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            LEFT JOIN cultivos c ON p.cultivo_id = c.id
            LEFT JOIN ciclo_cultivo cc ON p.ciclo_id = cc.id
            ORDER BY p.fecha_creacion DESC
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener producciones:', err);
                return res.status(500).json({ error: 'Error al obtener producciones: ' + err.message });
            }
            
            // Procesar los resultados para obtener información de insumos y sensores
            const produccionesPromises = results.map(produccion => {
                return new Promise((resolve) => {
                    // Si hay IDs de insumos, obtenerlos
                    if (produccion.insumos_ids) {
                        const insumoIds = produccion.insumos_ids.split(',');
                        const insumoQuery = `SELECT id, nombre, tipo, valor_unitario FROM insumos WHERE id IN (?)`;
                        
                        db.query(insumoQuery, [insumoIds], (err, insumosResults) => {
                            if (!err && insumosResults) {
                                produccion.insumos = insumosResults;
                            } else {
                                produccion.insumos = [];
                            }
                            
                            // Si hay IDs de sensores, obtenerlos
                            if (produccion.sensores_ids) {
                                const sensorIds = produccion.sensores_ids.split(',');
                                const sensorQuery = `SELECT id, nombre_sensor, tipo_sensor FROM sensores WHERE id IN (?)`;
                                
                                db.query(sensorQuery, [sensorIds], (err, sensoresResults) => {
                                    if (!err && sensoresResults) {
                                        produccion.sensores = sensoresResults;
                                    } else {
                                        produccion.sensores = [];
                                    }
                                    resolve(produccion);
                                });
                            } else {
                                produccion.sensores = [];
                                resolve(produccion);
                            }
                        });
                    } else {
                        produccion.insumos = [];
                        produccion.sensores = [];
                        resolve(produccion);
                    }
                });
            });
            
            Promise.all(produccionesPromises)
                .then(produccionesCompletas => {
                    res.status(200).json(produccionesCompletas);
                })
                .catch(error => {
                    console.error('Error al procesar producciones:', error);
                    res.status(500).json({ error: 'Error al procesar producciones: ' + error.message });
                });
        });
    } catch (error) {
        console.error('Error en ver Producciones:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
}

export function crearProduccion(req, res) {
    try {
        const { 
            nombre, 
            tipo, 
            imagen, 
            ubicacion, 
            descripcion, 
            usuario_id, 
            estado,
            cultivo_id,
            ciclo_id,
            insumos_ids,
            sensores_ids,
            inversion_total,
            meta_ganancias,
            personal_ids
        } = req.body;

        // Log de los datos recibidos (sin la imagen para no sobrecargar el log)
        console.log('Datos recibidos:', {
            ...req.body,
            imagen: req.body.imagen ? '[BASE64_IMAGE]' : undefined
        });

        // Validar que todos los campos requeridos estén presentes
        if (!nombre || !tipo || !imagen || !ubicacion || !descripcion || !usuario_id || !personal_ids) {
            return res.status(400).json({ error: 'Los campos nombre, tipo, imagen, ubicacion, descripcion, usuario_id y personal_ids son obligatorios' });
        }

        // Validar que el estado sea válido si se proporciona
        const estadoFinal = estado || 'habilitado';
        if (estadoFinal !== "habilitado" && estadoFinal !== "deshabilitado") {
            return res.status(400).json({ error: "Estado no válido" });
        }

        // Bloquear el envío si el estado es "deshabilitado"
        if (estadoFinal === "deshabilitado") {
            return res.status(400).json({ error: "No se puede crear una producción con el estado 'deshabilitado'" });
        }

        // Validar que el usuario exista
        db.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id], (err, results) => {
            if (err) {
                console.error('Error al verificar usuario:', err);
                return res.status(500).json({ error: 'Error al verificar el usuario: ' + err.message });
            }
            if (results.length === 0) {
                return res.status(400).json({ error: 'El usuario especificado no existe' });
            }

            // Validar que el cultivo exista si se proporciona
            const validarCultivo = new Promise((resolve, reject) => {
                if (cultivo_id) {
                    db.query('SELECT id FROM cultivos WHERE id = ?', [cultivo_id], (err, results) => {
                        if (err) {
                            console.error('Error al verificar cultivo:', err);
                            reject('Error al verificar el cultivo: ' + err.message);
                        } else if (results.length === 0) {
                            reject('El cultivo especificado no existe');
                        } else {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            });

            // Validar que el ciclo exista si se proporciona
            const validarCiclo = new Promise((resolve, reject) => {
                if (ciclo_id) {
                    db.query('SELECT id FROM ciclo_cultivo WHERE id = ?', [ciclo_id], (err, results) => {
                        if (err) {
                            console.error('Error al verificar ciclo:', err);
                            reject('Error al verificar el ciclo: ' + err.message);
                        } else if (results.length === 0) {
                            reject('El ciclo especificado no existe');
                        } else {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            });

            // Validar que los insumos existan si se proporcionan
            const validarInsumos = new Promise((resolve, reject) => {
                if (insumos_ids && insumos_ids.length > 0) {
                    const idsArray = insumos_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                    if (idsArray.length === 0) {
                        reject('Lista de insumos inválida');
                        return;
                    }
                    db.query('SELECT id FROM insumos WHERE id IN (?)', [idsArray], (err, results) => {
                        if (err) {
                            console.error('Error al verificar insumos:', err);
                            reject('Error al verificar los insumos: ' + err.message);
                        } else if (results.length !== idsArray.length) {
                            reject('Uno o más insumos especificados no existen');
                        } else {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            });

            // Validar que los sensores existan si se proporcionan
            const validarSensores = new Promise((resolve, reject) => {
                if (sensores_ids && sensores_ids.length > 0) {
                    const idsArray = sensores_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                    if (idsArray.length === 0) {
                        reject('Lista de sensores inválida');
                        return;
                    }
                    db.query('SELECT id FROM sensores WHERE id IN (?)', [idsArray], (err, results) => {
                        if (err) {
                            console.error('Error al verificar sensores:', err);
                            reject('Error al verificar los sensores: ' + err.message);
                        } else if (results.length !== idsArray.length) {
                            reject('Uno o más sensores especificados no existen');
                        } else {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            });

            // Ejecutar todas las validaciones
            Promise.all([validarCultivo, validarCiclo, validarInsumos, validarSensores])
                .then(() => {
                    // Consulta para insertar una nueva producción
                    const insertQuery = `
                        INSERT INTO producciones (
                            nombre, 
                            tipo, 
                            imagen, 
                            ubicacion, 
                            descripcion, 
                            usuario_id, 
                            estado, 
                            fecha_creacion,
                            cultivo_id,
                            ciclo_id,
                            insumos_ids,
                            sensores_ids,
                            inversion_total,
                            meta_ganancias,
                            personal_ids
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    db.query(
                        insertQuery,
                        [
                            nombre, 
                            tipo, 
                            imagen, 
                            ubicacion, 
                            descripcion, 
                            usuario_id, 
                            estadoFinal, 
                            new Date(),
                            cultivo_id || null,
                            ciclo_id || null,
                            insumos_ids || null,
                            sensores_ids || null,
                            inversion_total || null,
                            meta_ganancias || null,
                            personal_ids
                        ],
                        (err, results) => {
                            if (err) {
                                console.error('Error al insertar producción:', err);
                                return res.status(500).json({ error: 'Error al insertar la producción: ' + err.message });
                            }
                            
                            res.status(201).json({ 
                                message: 'Producción creada correctamente', 
                                produccionId: results.insertId
                            });
                        }
                    );
                })
                .catch(error => {
                    console.error('Error en validaciones:', error);
                    return res.status(400).json({ error: error });
                });
        });
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error en el servidor: ' + err.message });
    }
}

export function obtenerProduccionPorId(req, res) {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'Se requiere el ID de la producción' });
        }

        const query = `
            SELECT p.*, 
                   u.nombre AS nombre_usuario,
                   c.nombre AS nombre_cultivo,
                   cc.nombre AS nombre_ciclo
            FROM producciones p
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            LEFT JOIN cultivos c ON p.cultivo_id = c.id
            LEFT JOIN ciclo_cultivo cc ON p.ciclo_id = cc.id
            WHERE p.id = ?
        `;

        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error al obtener la producción:', err);
                return res.status(500).json({ error: 'Error al obtener la producción: ' + err.message });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'Producción no encontrada' });
            }
            
            const produccion = results[0];
            
            // Obtener insumos relacionados
            const obtenerInsumos = new Promise((resolve) => {
                if (produccion.insumos_ids) {
                    const insumoIds = produccion.insumos_ids.split(',');
                    const insumoQuery = `SELECT * FROM insumos WHERE id IN (?)`;
                    
                    db.query(insumoQuery, [insumoIds], (err, insumosResults) => {
                        if (!err && insumosResults) {
                            produccion.insumos = insumosResults;
                        } else {
                            produccion.insumos = [];
                        }
                        resolve();
                    });
                } else {
                    produccion.insumos = [];
                    resolve();
                }
            });
            
            // Obtener sensores relacionados
            const obtenerSensores = new Promise((resolve) => {
                if (produccion.sensores_ids) {
                    const sensorIds = produccion.sensores_ids.split(',');
                    const sensorQuery = `SELECT * FROM sensores WHERE id IN (?)`;
                    
                    db.query(sensorQuery, [sensorIds], (err, sensoresResults) => {
                        if (!err && sensoresResults) {
                            produccion.sensores = sensoresResults;
                        } else {
                            produccion.sensores = [];
                        }
                        resolve();
                    });
                } else {
                    produccion.sensores = [];
                    resolve();
                }
            });
            
            Promise.all([obtenerInsumos, obtenerSensores])
                .then(() => {
                    res.status(200).json(produccion);
                })
                .catch(error => {
                    console.error('Error al procesar la producción:', error);
                    res.status(500).json({ error: 'Error al procesar la producción: ' + error.message });
                });
        });
    } catch (error) {
        console.error('Error al obtener producción por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
}

export function actualizarProduccion(req, res) {
    try {
        const { id } = req.params;
        const { 
            nombre, 
            tipo, 
            imagen, 
            ubicacion, 
            descripcion, 
            usuario_id, 
            cantidad, 
            estado,
            cultivo_id,
            ciclo_id,
            insumos_ids,
            sensores_ids,
            inversion
        } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Se requiere el ID de la producción' });
        }

        // Verificar que la producción existe
        db.query('SELECT * FROM producciones WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error al verificar la producción:', err);
                return res.status(500).json({ error: 'Error al verificar la producción: ' + err.message });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'Producción no encontrada' });
            }

            // Construir la consulta de actualización dinámicamente
            let updateFields = [];
            let updateValues = [];

            if (nombre) {
                updateFields.push('nombre = ?');
                updateValues.push(nombre);
            }

            if (tipo) {
                updateFields.push('tipo = ?');
                updateValues.push(tipo);
            }

            if (imagen) {
                updateFields.push('imagen = ?');
                updateValues.push(imagen);
            }

            if (ubicacion) {
                updateFields.push('ubicacion = ?');
                updateValues.push(ubicacion);
            }

            if (descripcion) {
                updateFields.push('descripcion = ?');
                updateValues.push(descripcion);
            }

            if (usuario_id) {
                updateFields.push('usuario_id = ?');
                updateValues.push(usuario_id);
            }

            if (cantidad) {
                const parsedQuantity = parseFloat(cantidad);
                if (isNaN(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 1000000) {
                    return res.status(400).json({ 
                        error: 'La cantidad de producción debe ser un número válido entre 1 y 1,000,000 kg' 
                    });
                }
                updateFields.push('cantidad = ?');
                updateValues.push(parsedQuantity);
            }

            if (estado) {
                if (estado !== "habilitado" && estado !== "deshabilitado") {
                    return res.status(400).json({ error: "Estado no válido" });
                }
                updateFields.push('estado = ?');
                updateValues.push(estado);
            }

            if (inversion !== undefined) {
                updateFields.push('inversion = ?');
                updateValues.push(inversion);
            }

            if (cultivo_id !== undefined) {
                updateFields.push('cultivo_id = ?');
                updateValues.push(cultivo_id === null ? null : cultivo_id);
            }

            if (ciclo_id !== undefined) {
                updateFields.push('ciclo_id = ?');
                updateValues.push(ciclo_id === null ? null : ciclo_id);
            }

            if (insumos_ids !== undefined) {
                updateFields.push('insumos_ids = ?');
                updateValues.push(insumos_ids === null ? null : insumos_ids);
            }

            if (sensores_ids !== undefined) {
                updateFields.push('sensores_ids = ?');
                updateValues.push(sensores_ids === null ? null : sensores_ids);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
            }

            // Añadir el ID al final de los valores
            updateValues.push(id);

            const updateQuery = `UPDATE producciones SET ${updateFields.join(', ')} WHERE id = ?`;

            db.query(updateQuery, updateValues, (err, results) => {
                if (err) {
                    console.error('Error al actualizar la producción:', err);
                    return res.status(500).json({ error: 'Error al actualizar la producción: ' + err.message });
                }
                
                res.status(200).json({ 
                    message: 'Producción actualizada correctamente', 
                    produccionId: id,
                    affectedRows: results.affectedRows
                });
            });
        });
    } catch (error) {
        console.error('Error al actualizar producción:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
}

export function actualizarEstadoProduccion(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        if (!id || !estado) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos (id, estado)' });
        }
        if (!['habilitado', 'deshabilitado'].includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }
        const query = 'UPDATE producciones SET estado = ? WHERE id = ?';
        db.query(query, [estado, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar estado de producción:', err);
                return res.status(500).json({ error: 'Error al actualizar estado de producción: ' + err.message });
            }
            res.status(200).json({ message: 'Estado actualizado correctamente' });
        });
    } catch (error) {
        console.error('Error en actualizarEstadoProduccion:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
}

export function eliminarProduccion(req, res) {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'Se requiere el ID de la producción' });
        }

        // Verificar que la producción existe
        db.query('SELECT * FROM producciones WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error al verificar la producción:', err);
                return res.status(500).json({ error: 'Error al verificar la producción: ' + err.message });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'Producción no encontrada' });
            }

            // Eliminar la producción
            db.query('DELETE FROM producciones WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error('Error al eliminar la producción:', err);
                    return res.status(500).json({ error: 'Error al eliminar la producción: ' + err.message });
                }
                
                res.status(200).json({ 
                    message: 'Producción eliminada correctamente', 
                    produccionId: id,
                    affectedRows: results.affectedRows
                });
            });
        });
    } catch (error) {
        console.error('Error al eliminar producción:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
}

// Exportar todas las funciones
export default {
    verProducciones,
    crearProduccion,
    obtenerProduccionPorId,
    actualizarProduccion,
    actualizarEstadoProduccion,
    eliminarProduccion
};