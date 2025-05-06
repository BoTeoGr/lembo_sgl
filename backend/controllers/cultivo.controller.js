import db from './../db/config.db.js';

// Función para obtener cultivos con paginación
export function VerCultivos(req, res) {
    try {
        // Obtener los parámetros de paginación desde la solicitud
        const { page = 1, limit = 6 } = req.query;

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

        // Consulta para obtener los cultivos con paginación
        const query = `
            SELECT 
                id AS cultivoId,
                nombre AS nombre,
                tipo AS tipo,
                imagen AS imagen,
                ubicacion AS ubicacion,
                descripcion AS descripcion,
                usuario_id AS usuarioId,
                tamano AS tamano,
                estado AS estado,
                fecha_creacion AS fechaCreacion
            FROM cultivos
            LIMIT ? OFFSET ?
        `;
        const countQuery = 'SELECT COUNT(*) AS total FROM cultivos';

        // Obtener el total de cultivos
        db.query(countQuery, (err, countResults) => {
            if (err) {
                console.error('Error al contar cultivos:', err.message);
                return res.status(500).json({ error: 'Error al contar cultivos' });
            }

            const totalCultivos = countResults[0].total;
            const totalPages = Math.ceil(totalCultivos / limitNumber);

            // Obtener los cultivos con paginación
            db.query(query, [limitNumber, offset], (err, results) => {
                if (err) {
                    console.error('Error al obtener cultivos:', err.message);
                    return res.status(500).json({ error: 'Error al obtener cultivos' });
                }

                // Responder con los datos paginados
                res.status(200).json({
                    cultivos: results,
                    totalCultivos,
                    totalPages,
                    currentPage: pageNumber,
                });
            });
        });
    } catch (error) {
        console.error('Error en VerCultivos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para crear un cultivo
export function crearCultivo(req, res) {
    try {
        const { cultiveName, cultiveType, cultiveImage, cultiveLocation, cultiveDescription, usuario_id, cultiveSize, estado } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!cultiveName) {
            return res.status(400).json({ error: 'El nombre del cultivo es obligatorio' });
        }
        
        if (!cultiveType) {
            return res.status(400).json({ error: 'El tipo de cultivo es obligatorio' });
        }
        
        if (!cultiveImage) {
            return res.status(400).json({ error: 'La imagen del cultivo es obligatoria' });
        }
        
        if (!cultiveLocation) {
            return res.status(400).json({ error: 'La ubicación del cultivo es obligatoria' });
        }
        
        if (!cultiveDescription) {
            return res.status(400).json({ error: 'La descripción del cultivo es obligatoria' });
        }
        
        if (!usuario_id) {
            return res.status(400).json({ error: 'El ID del usuario es obligatorio' });
        }
        
        if (!cultiveSize) {
            return res.status(400).json({ error: 'El tamaño del cultivo es obligatorio' });
        }
        
        if (!estado) {
            return res.status(400).json({ error: 'El estado del cultivo es obligatorio' });
        }

        // Validar que cultiveSize sea un número válido y esté dentro del rango permitido
        const parsedSize = parseFloat(cultiveSize);
        if (isNaN(parsedSize) || parsedSize < 10 || parsedSize > 10000) {
            return res.status(400).json({ 
                error: 'El tamaño del cultivo debe ser un número válido entre 10 y 10000 m²' 
            });
        }

        // Bloquear el envío si el estado es "deshabilitado"
        if (estado === "deshabilitado") {
            return res.status(400).json({ error: "No se puede crear un sensor con el estado 'deshabilitado'" });
        }

        // Validar que el estado sea válido
        if (estado !== "habilitado" && estado !== "deshabilitado") {
            return res.status(400).json({ error: "Estado no válido" });
        }

        // Validar que el usuario exista
        db.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).json({ error: 'El usuario especificado no existe' });
            }

            // Consulta para insertar un nuevo cultivo
            db.query(
                `INSERT INTO cultivos (nombre, tipo, imagen, ubicacion, descripcion, usuario_id, fecha_creacion, estado, tamano)  
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [cultiveName, cultiveType, cultiveImage, cultiveLocation, cultiveDescription, usuario_id , new Date(), estado, parsedSize],
                (err, results) => {
                    if (err) {
                        console.error('Error al insertar cultivo:', err.message);
                        return res.status(500).json({ error: 'Error desconocido al crear el cultivo' });
                    }
                    res.status(201).json({ 
                        message: 'Cultivo creado correctamente', 
                        cultivoId: results.insertId,
                        info: `Tamaño del cultivo: ${parsedSize} m²`
                    });
                }
            );
        });
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error desconocido' });
    }
}

// Actualizar estado de un cultivo
export function actualizarEstadoCultivo(req, res) {
    const { id } = req.params;
    const { estado } = req.body; // Espera 'Activo' o 'Inactivo'
    if (!estado) {
        return res.status(400).json({ error: 'El estado es requerido' });
    }
    // Normaliza para la base de datos
    const estadoDB = (estado === 'Activo' || estado.toLowerCase() === 'habilitado') ? 'habilitado' : 'deshabilitado';
    const query = 'UPDATE cultivos SET estado = ? WHERE id = ?';
    db.query(query, [estadoDB, id], (err, result) => {
        if (err) {
            console.error('Error SQL:', err); // Log detallado para depuración
            return res.status(500).json({ error: 'Error al actualizar el estado del cultivo', detalle: err.message });
        }
        res.json({ success: true });
    });
}

// Actualizar cultivo por ID
export function actualizarCultivo(req, res) {
    const { id } = req.params;
    const {
        nombre,
        tipo,
        ubicacion,
        tamano,
        descripcion,
        estado
    } = req.body;

    // Si hay un archivo, tomamos el nombre del archivo para la imagen
    let imagen = req.file ? req.file.filename : null;

    // Verifica que al menos haya algún dato a actualizar
    if (!nombre && !tipo && !ubicacion && !tamano && !descripcion && !estado && !imagen) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    // Construcción dinámica del query y parámetros
    const campos = [];
    const valores = [];

    // Si los campos están presentes, los agregamos al query de actualización
    if (nombre) { campos.push('nombre = ?'); valores.push(nombre); }
    if (tipo) { campos.push('tipo = ?'); valores.push(tipo); }
    if (ubicacion) { campos.push('ubicacion = ?'); valores.push(ubicacion); }
    if (tamano) { campos.push('tamano = ?'); valores.push(tamano); }
    if (descripcion) { campos.push('descripcion = ?'); valores.push(descripcion); }
    if (estado) { campos.push('estado = ?'); valores.push(estado); }
    if (imagen) { campos.push('imagen = ?'); valores.push(imagen); }

    // Agregamos el id al final de los valores
    valores.push(id);

    // Construcción del query de actualización
    const query = `UPDATE cultivos SET ${campos.join(', ')} WHERE id = ?`;

    // Ejecutamos el query de actualización en la base de datos
    db.query(query, valores, (err, result) => {
        if (err) {
            console.error("Error al actualizar el cultivo:", err);
            return res.status(500).json({ error: 'Error al actualizar cultivo' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Cultivo actualizado correctamente' });
    });
}


// Obtener un cultivo por su ID
export function obtenerCultivoPorId(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM cultivos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener el cultivo:", err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }

        res.json(results[0]);
    });
}

