// Función para obtener todos los sensores
import db from './../db/config.db.js';

// Función para obtener sensores con paginación
export function VerSensores(req, res) {
    try {
        // Obtener los parámetros de paginación desde la solicitud
        const { page = 1, limit = 6 } = req.query; // Cambiar el límite predeterminado a 8

        // Convertir los parámetros a números
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Validar los parámetros
        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ error: 'El parámetro "page" debe ser un número mayor o igual a 1' });
        }
        if (isNaN(limitNumber) || limitNumber < 1) {
            return res.status(400).json({ error: 'El parámetro "limit" debe ser un número mayor o igual a 1' });
        }

        // Calcular el índice inicial para la consulta
        const offset = (pageNumber - 1) * limitNumber;

        // Consulta para obtener los sensores con paginación
        const query = 'SELECT * FROM sensores LIMIT ? OFFSET ?';
        const countQuery = 'SELECT COUNT(*) AS total FROM sensores';

        // Obtener el total de sensores
        db.query(countQuery, (err, countResults) => {
            if (err) {
                console.error('Error al contar sensores:', err);
                return res.status(500).json({ error: 'Error al contar sensores' });
            }

            const totalSensores = countResults[0].total;
            const totalPages = Math.ceil(totalSensores / limitNumber);

            // Obtener los sensores con paginación
            db.query(query, [limitNumber, offset], (err, results) => {
                if (err) {
                    console.error('Error al obtener sensores:', err);
                    return res.status(500).json({ error: 'Error al obtener sensores' });
                }

                // Responder con los datos paginados
                res.status(200).json({
                    sensores: results,
                    totalSensores,
                    totalPages,
                    currentPage: pageNumber,
                });
            });
        });
    } catch (error) {
        console.error('Error en VerSensores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para crear un sensor
export function crearSensor(req, res) {
    try {
        const { sensorType, sensorName, sensorUnit, sensorImage, sensorDescription, sensorScan, estado } = req.body;

        console.log("Datos recibidos en el backend:", req.body);

        // Validar que todos los campos requeridos estén presentes
        if (!sensorType || !sensorName || !sensorUnit || !sensorImage || !sensorDescription || !sensorScan || !estado) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Bloquear el envío si el estado es "deshabilitado"
        if (estado === "deshabilitado") {
            return res.status(400).json({ error: "No se puede crear un sensor con el estado 'deshabilitado'" });
        }

        // Validar que el estado sea válido
        if (estado !== "habilitado" && estado !== "deshabilitado") {
            return res.status(400).json({ error: "Estado no válido" });
        }

        // Consulta para insertar un nuevo sensor
        db.query(
            `INSERT INTO sensores (tipo_sensor, nombre_sensor, unidad_medida, imagen, descripcion, tiempo_escaneo, usuario_id, estado, fecha_creacion)  
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
            [sensorType, sensorName, sensorUnit, sensorImage, sensorDescription, sensorScan, estado, new Date()],
            (err, results) => {
                if (err) {
                    console.error("Error al insertar sensor:", err.message); // Imprime el mensaje del error
                    return res.status(500).json({ error: "Error desconocido al crear el sensor" });
                }
                res.status(201).json({ message: "Sensor creado correctamente", sensorId: results.insertId });
            }
        );

        console.log("Sensor creado correctamente");
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json({ error: "Error desconocido" });
    }
}

// Actualizar estado de un sensor
export function actualizarEstadoSensor(req, res) {
    const { id } = req.params;
    const { estado } = req.body; // Espera 'habilitado' o 'deshabilitado'
    if (!estado) {
        return res.status(400).json({ error: 'El estado es requerido' });
    }
    // Normaliza para la base de datos
    const estadoDB = (estado === 'habilitado') ? 'habilitado' : 'deshabilitado';
    const query = 'UPDATE sensores SET estado = ? WHERE id = ?';
    db.query(query, [estadoDB, id], (err, result) => {
        if (err) {
            console.error('Error SQL:', err);
            return res.status(500).json({ error: 'Error al actualizar el estado del sensor', detalle: err.message });
        }
        res.json({ success: true });
    });
}

// Actualizar sensor por ID
export function actualizarSensor(req, res) {
    const { id } = req.params;
    // Compatibilidad con frontend: aceptar ambos nombres de campos
    const {
        nombre_sensor,
        nombre,
        tipo_sensor,
        tipo,
        unidad_medida,
        descripcion,
        tiempo_escaneo,
        estado,
        imagen
    } = req.body;

    // Inicializar las variables campos y valores
    const campos = [];
    const valores = [];

    // Nombres compatibles con el frontend
    if (nombre_sensor || nombre) {
        campos.push('nombre_sensor = ?');
        valores.push(nombre_sensor || nombre);
    }
    if (tipo_sensor || tipo) {
        campos.push('tipo_sensor = ?');
        valores.push(tipo_sensor || tipo);
    }
    if (unidad_medida) {
        campos.push('unidad_medida = ?');
        valores.push(unidad_medida);
    }
    if (descripcion) {
        campos.push('descripcion = ?');
        valores.push(descripcion);
    }
    if (tiempo_escaneo) {
        campos.push('tiempo_escaneo = ?');
        valores.push(tiempo_escaneo);
    }
    if (imagen) {
        campos.push('imagen = ?');
        valores.push(imagen);
    }
    if (estado) {
        const estadoNormalizado = (estado === 'Activo' || estado.toLowerCase() === 'habilitado') ? 'habilitado' : 'deshabilitado';
        campos.push('estado = ?');
        valores.push(estadoNormalizado);
    }

    if (campos.length === 0) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    valores.push(id);
    const query = `UPDATE sensores SET ${campos.join(', ')} WHERE id = ?`;

    db.query(query, valores, (err, result) => {
        if (err) {
            console.error("Error al actualizar el sensor:", err);
            return res.status(500).json({ error: 'Error al actualizar sensor' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado' });
        }
        res.json({ success: true, message: 'Sensor actualizado correctamente' });
    });
}

// Obtener un sensor por su ID
export function obtenerSensorPorId(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM sensores WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener el sensor:", err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado' });
        }

        res.json(results[0]);
    });
}
