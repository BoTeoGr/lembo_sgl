import db from "./../db/config.db.js";

export function verProducciones(req, res) {
  try {
    db.query(
      `
            SELECT 
                p.*,
                u.nombre AS nombre_usuario,
                c.nombre AS nombre_cultivo
            FROM 
                producciones p
            LEFT JOIN 
                usuarios u ON p.usuario_id = u.id
            LEFT JOIN 
                cultivos c ON p.cultivo_id = c.id
        `,
      (err, results) => {
        if (err) {
          console.error("Error al obtener las producciones:", err);
          return res
            .status(500)
            .json({
              error: "Error al obtener las producciones: " + err.message,
            });
        }
        res.status(200).json(results);
      }
    );
  } catch (err) {
    console.error("Error en el servidor:", err);
    res.status(500).json({ error: "Error en el servidor: " + err.message });
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
          cantidad,
          cultivo_id,
          ciclo_id,
          insumos_ids,
          sensores_ids,
          fecha_de_inicio,  
          fecha_fin,        
          inversion,        
          meta_ganancia     
      } = req.body;

      // Validations
      if (!nombre || !tipo || !ubicacion || !descripcion || !usuario_id || 
          cantidad === undefined || !cultivo_id || !ciclo_id) {
          return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
      }

      if (!insumos_ids || insumos_ids.length === 0) {
          return res.status(400).json({ error: "Se deben proporcionar los IDs de los insumos utilizados." });
      }

      if (meta_ganancia !== undefined && inversion !== undefined && meta_ganancia < inversion) {
          return res.status(400).json({ error: "La meta de ganancia debe ser mayor o igual a la inversión." });
      }

      // Start transaction
      db.beginTransaction(transErr => {
          if (transErr) {
              console.error("Error al iniciar la transacción:", transErr);
              return res.status(500).json({ error: "Error al iniciar la transacción." });
          }

          // Insert producción (INCLUDING new fields)
          db.query(
              `
              INSERT INTO producciones (
                  nombre, tipo, imagen, ubicacion, descripcion, 
                  usuario_id, cantidad, estado, cultivo_id, ciclo_id, 
                  insumos_ids, sensores_ids, fecha_de_inicio, fecha_fin,
                  inversion, meta_ganancia
              ) VALUES (?, ?, ?, ?, ?, ?, ?, 'habilitado', ?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [nombre, tipo, imagen, ubicacion, descripcion, usuario_id, cantidad, 
               cultivo_id, ciclo_id, insumos_ids, sensores_ids, fecha_de_inicio, 
               fecha_fin, inversion, meta_ganancia],
              (prodErr, prodResults) => {
                  if (prodErr) {
                      return db.rollback(rollbackErr => {
                          if (rollbackErr) {
                              console.error("Error al hacer rollback:", rollbackErr);
                          }
                          console.error("Error al crear la producción:", prodErr);
                          return res.status(500).json({ error: "Error al crear la producción." });
                      });
                  }

                  const produccionId = prodResults.insertId;

                  // Update insumos (same logic as before)
                  const updateInsumos = () => {
                      const insumoIdsArray = insumos_ids.split(",").map(Number);
                      const updates = insumoIdsArray.map(() => "cantidad = cantidad - 1");
                      const query = `UPDATE insumos SET ${updates.join(", ")} WHERE id IN (?)`;

                      db.query(query, [insumoIdsArray], (insumoErr, insumoResults) => {
                          if (insumoErr) {
                              return db.rollback(rollbackErr => {
                                  if (rollbackErr) {
                                      console.error("Error al hacer rollback:", rollbackErr);
                                  }
                                  console.error("Error al actualizar insumos:", insumoErr);
                                  return res.status(500).json({ error: "Error al actualizar insumos." });
                              });
                          }

                          // Commit transaction
                          db.commit(commitErr => {
                              if (commitErr) {
                                  return db.rollback(rollbackErr => {
                                      if (rollbackErr) {
                                          console.error("Error al hacer rollback:", rollbackErr);
                                      }
                                      console.error("Error al hacer commit:", commitErr);
                                      return res.status(500).json({ error: "Error al finalizar la transacción." });
                                  });
                              }

                              return res.status(201).json({ 
                                  message: "Producción creada e insumos actualizados con éxito.",
                                  produccion_id: produccionId 
                              });
                          });
                      });
                  };

                  updateInsumos();

              }
          );
      });

  } catch (error) {
      console.error("Error en el servidor:", error);
      return res.status(500).json({ error: "Error en el servidor." });
  }
}
  




export function obtenerProduccionPorId(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Se requiere el ID de la producción" });
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
        console.error("Error al obtener la producción:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener la producción: " + err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Producción no encontrada" });
      }

      const produccion = results[0];

      // Obtener insumos relacionados
      const obtenerInsumos = new Promise((resolve) => {
        if (produccion.insumos_ids) {
          const insumoIds = produccion.insumos_ids.split(",");
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
          const sensorIds = produccion.sensores_ids.split(",");
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
        .catch((error) => {
          console.error("Error al procesar la producción:", error);
          res
            .status(500)
            .json({
              error: "Error al procesar la producción: " + error.message,
            });
        });
    });
  } catch (error) {
    console.error("Error al obtener producción por ID:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
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
      inversion,
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Se requiere el ID de la producción" });
    }

    // Verificar que la producción existe
    db.query(
      "SELECT * FROM producciones WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error al verificar la producción:", err);
          return res
            .status(500)
            .json({
              error: "Error al verificar la producción: " + err.message,
            });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Producción no encontrada" });
        }

        // Construir la consulta de actualización dinámicamente
        let updateFields = [];
        let updateValues = [];

        if (nombre) {
          updateFields.push("nombre = ?");
          updateValues.push(nombre);
        }

        if (tipo) {
          updateFields.push("tipo = ?");
          updateValues.push(tipo);
        }

        if (imagen) {
          updateFields.push("imagen = ?");
          updateValues.push(imagen);
        }

        if (ubicacion) {
          updateFields.push("ubicacion = ?");
          updateValues.push(ubicacion);
        }

        if (descripcion) {
          updateFields.push("descripcion = ?");
          updateValues.push(descripcion);
        }

        if (usuario_id) {
          updateFields.push("usuario_id = ?");
          updateValues.push(usuario_id);
        }

        if (cantidad) {
          const parsedQuantity = parseFloat(cantidad);
          if (
            isNaN(parsedQuantity) ||
            parsedQuantity < 1 ||
            parsedQuantity > 1000000
          ) {
            return res.status(400).json({
              error:
                "La cantidad de producción debe ser un número válido entre 1 y 1,000,000 kg",
            });
          }
          updateFields.push("cantidad = ?");
          updateValues.push(parsedQuantity);
        }

        if (estado) {
          if (estado !== "habilitado" && estado !== "deshabilitado") {
            return res.status(400).json({ error: "Estado no válido" });
          }
          updateFields.push("estado = ?");
          updateValues.push(estado);
        }

        if (inversion !== undefined) {
          updateFields.push("inversion = ?");
          updateValues.push(inversion);
        }

        if (cultivo_id !== undefined) {
          updateFields.push("cultivo_id = ?");
          updateValues.push(cultivo_id === null ? null : cultivo_id);
        }

        if (ciclo_id !== undefined) {
          updateFields.push("ciclo_id = ?");
          updateValues.push(ciclo_id === null ? null : ciclo_id);
        }

        if (insumos_ids !== undefined) {
          updateFields.push("insumos_ids = ?");
          updateValues.push(insumos_ids === null ? null : insumos_ids);
        }

        if (sensores_ids !== undefined) {
          updateFields.push("sensores_ids = ?");
          updateValues.push(sensores_ids === null ? null : sensores_ids);
        }

        if (updateFields.length === 0) {
          return res
            .status(400)
            .json({ error: "No se proporcionaron campos para actualizar" });
        }

        // Añadir el ID al final de los valores
        updateValues.push(id);

        const updateQuery = `UPDATE producciones SET ${updateFields.join(
          ", "
        )} WHERE id = ?`;

        db.query(updateQuery, updateValues, (err, results) => {
          if (err) {
            console.error("Error al actualizar la producción:", err);
            return res
              .status(500)
              .json({
                error: "Error al actualizar la producción: " + err.message,
              });
          }

          res.status(200).json({
            message: "Producción actualizada correctamente",
            produccionId: id,
            affectedRows: results.affectedRows,
          });
        });
      }
    );
  } catch (error) {
    console.error("Error al actualizar producción:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
}

export function actualizarEstadoProduccion(req, res) {
  try {
    const { id } = req.params;
    let { estado } = req.body;
    console.log(estado);
    if (!id || !estado) {
      return res
        .status(400)
        .json({ error: "Faltan parámetros requeridos (id, estado)" });
    }
    if (!["habilitado", "deshabilitado"].includes(estado)) {
      return res.status(400).json({ error: "Estado no válido" });
    }
    //intercambiar estados
    if (estado === "habilitado") {
      estado = "deshabilitado";
    } else if (estado === "deshabilitado") {
      estado = "habilitado";
    }
    console.log(estado)

    const query = "UPDATE producciones SET estado = ? WHERE id = ?";
    db.query(query, [estado, id], (err, result) => {
      if (err) {
        console.error("Error al actualizar estado de producción:", err);
        return res
          .status(500)
          .json({
            error: "Error al actualizar estado de producción: " + err.message,
          });
      }
      res.status(200).json({ message: "Estado actualizado correctamente" });
    });
  } catch (error) {
    console.error("Error en actualizarEstadoProduccion:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
}
export function actualizarEstadosProduccionHabilitado(req, res) {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: "Se requiere un array de IDs en el cuerpo de la solicitud." });
    }

    const query = "UPDATE producciones SET estado = 'habilitado' WHERE id IN (?)";

    db.query(query, [ids], (err, result) => {
      if (err) {
        console.error("Error al actualizar estados de producción:", err);
        return res
          .status(500)
          .json({
            error: "Error al actualizar estados de producción: " + err.message,
          });
      }

      if (result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: `${result.affectedRows} registro(s) actualizado(s) a 'habilitado' correctamente.` });
      } else {
        res.status(200).json({ message: "No se encontraron registros para los IDs proporcionados." });
      }
    });
  } catch (error) {
    console.error("Error en actualizarEstadosProduccion:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
}

export function deshabilitarProducciones(req, res) {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: "Se requiere un array de IDs en el cuerpo de la solicitud." });
    }

    const query = "UPDATE producciones SET estado = 'deshabilitado' WHERE id IN (?)";

    db.query(query, [ids], (err, result) => {
      if (err) {
        console.error("Error al deshabilitar producciones:", err);
        return res
          .status(500)
          .json({
            error: "Error al deshabilitar producciones: " + err.message,
          });
      }

      if (result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: `${result.affectedRows} registro(s) deshabilitado(s) correctamente.` });
      } else {
        res.status(200).json({ message: "No se encontraron registros para los IDs proporcionados." });
      }
    });
  } catch (error) {
    console.error("Error en deshabilitarProducciones:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
}

export function eliminarProduccion(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Se requiere el ID de la producción" });
    }

    // Verificar que la producción existe
    db.query(
      "SELECT * FROM producciones WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error al verificar la producción:", err);
          return res
            .status(500)
            .json({
              error: "Error al verificar la producción: " + err.message,
            });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Producción no encontrada" });
        }

        // Eliminar la producción
        db.query(
          "DELETE FROM producciones WHERE id = ?",
          [id],
          (err, results) => {
            if (err) {
              console.error("Error al eliminar la producción:", err);
              return res
                .status(500)
                .json({
                  error: "Error al eliminar la producción: " + err.message,
                });
            }

            res.status(200).json({
              message: "Producción eliminada correctamente",
              produccionId: id,
              affectedRows: results.affectedRows,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error al eliminar producción:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
}
export function obtenerProduccionesPorUsuario(req, res) {
  const usuarioId = req.params.id;

  // Primero, obtén la información del usuario
  db.query('SELECT id, nombre, correo, telefono, rol FROM usuarios WHERE id = ?', [usuarioId], (error, usuarioResult) => {
      if (error) {
          console.error("Error al obtener el usuario:", error);
          return res.status(500).json({ mensaje: 'Error al obtener el usuario' });
      }

      if (usuarioResult.length === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      const usuario = usuarioResult[0];

      // Luego, obtén las producciones asociadas al usuario
      db.query('SELECT id, nombre FROM producciones WHERE usuario_id = ?', [usuarioId], (error, produccionesResult) => {
          if (error) {
              console.error("Error al obtener las producciones:", error);
              return res.status(500).json({ mensaje: 'Error al obtener las producciones' });
          }

          const producciones = produccionesResult;

          // Envía la respuesta con la información del usuario y sus producciones
          res.status(200).json({
              usuario: {
                  id: usuario.id,
                  nombre: usuario.nombre,
                  correo: usuario.correo,
                  telefono: usuario.telefono,
                  rol: usuario.rol
              },
              producciones: producciones
          });
      });
  });
}
export function obtenerProduccionesPorCultivo(req, res) {
  const cultivoId = req.params.id;

  // Primero, obtén la información del cultivo
  db.query('SELECT id, nombre, descripcion FROM cultivos WHERE id = ?', [cultivoId], (error, cultivoResult) => {
      if (error) {
          console.error("Error al obtener el cultivo:", error);
          return res.status(500).json({ mensaje: 'Error al obtener el cultivo' });
      }

      if (cultivoResult.length === 0) {
          return res.status(404).json({ mensaje: 'Cultivo no encontrado' });
      }

      const cultivo = cultivoResult[0];

      // Luego, obtén las producciones asociadas al cultivo
      db.query('SELECT id, nombre FROM producciones WHERE cultivo_id = ?', [cultivoId], (error, produccionesResult) => {
          if (error) {
              console.error("Error al obtener las producciones:", error);
              return res.status(500).json({ mensaje: 'Error al obtener las producciones' });
          }

          const producciones = produccionesResult;

          // Envía la respuesta con la información del cultivo y sus producciones
          res.status(200).json({
              cultivo: {
                  id: cultivo.id,
                  nombre: cultivo.nombre,
                  descripcion: cultivo.descripcion
              },
              producciones: producciones
          });
      });
  });
}

export function obtenerProduccionesPorInsumo(req, res) {
  const insumoId = req.params.id;
  // Primero, obtén la información del insumo
  db.query('SELECT id, nombre, descripcion, cantidad, unidad_medida, tipo FROM insumos WHERE id = ?', [insumoId], (error, insumoResult) => {
      if (error) {
          console.error("Error al obtener el insumo:", error);
          return res.status(500).json({ mensaje: 'Error al obtener el insumo' });
      }

      if (insumoResult.length === 0) {
          return res.status(404).json({ mensaje: 'Insumo no encontrado' });
      }

      const insumo = insumoResult[0];

      db.query('SELECT id, nombre FROM producciones WHERE FIND_IN_SET(?, insumos_ids)', [insumoId], (error, produccionesResult) => {
          if (error) {
              console.error("Error al obtener las producciones:", error);
              return res.status(500).json({ mensaje: 'Error al obtener las producciones' });
          }

          const producciones = produccionesResult;

          // Envía la respuesta con la información del insumo y sus producciones
          res.status(200).json({
              insumo: {
                  id: insumo.id,
                  nombre: insumo.nombre,
                  descripcion: insumo.descripcion,
                  cantidad: insumo.cantidad,
                  unidad_medida: insumo.unidad_medida,
                  tipo: insumo.tipo
              },
              producciones: producciones
          });
      });
  });
}export function obtenerProduccionesPorSensor(req, res) {
  const sensorId = req.params.id;

  // Primero, obtén la información del sensor (opcional, pero útil)
  db.query('SELECT id, tipo_sensor, nombre_sensor, unidad_medida FROM sensores WHERE id = ?', [sensorId], (error, sensorResult) => {
      if (error) {
          console.error("Error al obtener el sensor:", error);
          return res.status(500).json({ mensaje: 'Error al obtener el sensor' });
      }

      if (sensorResult.length === 0) {
          return res.status(404).json({ mensaje: 'Sensor no encontrado' });
      }

      const sensor = sensorResult[0];

      // Luego, obtén las producciones asociadas al sensor
      // **¡IMPORTANTE: Usamos FIND_IN_SET porque sensores_ids es TEXT con comas!**
      db.query('SELECT id, nombre FROM producciones WHERE FIND_IN_SET(?, sensores_ids)', [sensorId], (error, produccionesResult) => {
          if (error) {
              console.error("Error al obtener las producciones:", error);
              return res.status(500).json({ mensaje: 'Error al obtener las producciones' });
          }

          const producciones = produccionesResult;

          // Envía la respuesta con la información del sensor y sus producciones
          res.status(200).json({
              sensor: sensor, // Incluimos la info del sensor (opcional)
              producciones: producciones
          });
      });
  });
}
// Exportar todas las funciones
export default {
  verProducciones,
  crearProduccion,
  obtenerProduccionPorId,
  actualizarProduccion,
  actualizarEstadoProduccion,
  eliminarProduccion,
};
