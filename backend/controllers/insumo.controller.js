import db from './../db/config.db.js';

// Función para obtener insumos con paginación
export function VerInsumos(req, res) {
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

        // Consulta para obtener los insumos con paginación
        const query = `
            SELECT 
                id AS insumoId,
                nombre AS nombre,
                tipo AS tipo,
                imagen AS imagen,
                unidad_medida AS unidadMedida,
                valor_unitario AS valorUnitario,
                cantidad AS cantidad,
                valor_total AS valorTotal,
                descripcion AS descripcion,
                usuario_id AS usuarioId,
                estado AS estado,
                fecha_creacion AS fechaCreacion
            FROM insumos
            LIMIT ? OFFSET ?
        `;
        const countQuery = 'SELECT COUNT(*) AS total FROM insumos';

        // Obtener el total de insumos
        db.query(countQuery, (err, countResults) => {
            if (err) {
                console.error('Error al contar insumos:', err);
                return res.status(500).json({ error: 'Error al contar insumos' });
            }

            const totalInsumos = countResults[0].total;
            const totalPages = Math.ceil(totalInsumos / limitNumber);

            // Obtener los insumos con paginación
            db.query(query, [limitNumber, offset], (err, results) => {
                if (err) {
                    console.error('Error al obtener insumos:', err);
                    return res.status(500).json({ error: 'Error al obtener insumos' });
                }

                // Responder con los datos paginados
                res.status(200).json({
                    insumos: results,
                    totalInsumos,
                    totalPages,
                    currentPage: pageNumber,
                });
            });
        });
    } catch (error) {
        console.error('Error en VerInsumos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para crear un insumo
export function crearInsumo(req, res) {
    try {
        const { insumeName, insumeType, insumeImage, insumeExtent, insumeDescription, insumePrice, insumeAmount, totalValue, insumeId, estado } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!insumeName || !insumeType || !insumeImage || !insumeExtent || !insumePrice || !insumeAmount || !totalValue || !insumeDescription || !insumeId || !estado) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validar que la unidad de medida sea válida
        if (!['peso', 'volumen', 'superficie', 'concentración', 'litro', 'kilo'].includes(insumeExtent)) {
            return res.status(400).json({ error: 'Unidad de medida no válida' });
        }

        // Validar que los valores numéricos sean válidos
        if (isNaN(insumePrice) || isNaN(insumeAmount) || isNaN(totalValue)) {
            return res.status(400).json({ error: 'Valores numéricos inválidos' });
        }

        // Validar que el estado sea válido
        if (estado !== "habilitado" && estado !== "deshabilitado") {
            return res.status(400).json({ error: "Estado no válido" });
        }

        // Bloquear el envío si el estado es "deshabilitado"
        if (estado === "deshabilitado") {
            return res.status(400).json({ error: "No se puede crear un sensor con el estado 'deshabilitado'" });
        }

        // Validar que el usuario exista
        db.query('SELECT id FROM usuarios WHERE id = ?', [insumeId], (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).json({ error: 'El usuario especificado no existe' });
            }

            // Consulta para insertar un nuevo insumo
            db.query(
                `INSERT INTO insumos (nombre, tipo, imagen, unidad_medida, valor_unitario, cantidad, valor_total, descripcion, usuario_id, estado, fecha_creacion)  
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [insumeName, insumeType, insumeImage, insumeExtent, insumePrice, insumeAmount, totalValue, insumeDescription, 1, estado, new Date()],
                (err, results) => {
                    if (err) {
                        console.error('Error al insertar insumo:', err.message);
                        return res.status(500).json({ error: 'Error desconocido al crear el insumo' });
                    }
                    res.status(201).json({ message: 'Insumo creado correctamente', insumoId: results.insertId });
                }
            );
        });
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error desconocido' });
    }
}
// Olvide este comentario