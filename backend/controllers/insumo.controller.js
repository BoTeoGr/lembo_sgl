import db from './../db/config.db.js';

// Función para obtener insumos con paginación
export function VerInsumos(req, res) {
    db.query('SELECT * FROM insumos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener insumos' });
        }
        res.json(results);
    });
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

// Actualizar estado de un insumo
export function actualizarEstadoInsumo(req, res) {
    const { id } = req.params;
    const { estado } = req.body; // Espera 'Activo' o 'Inactivo'
    if (!estado) {
        return res.status(400).json({ error: 'El estado es requerido' });
    }
    // Normaliza para la base de datos
    const estadoDB = (estado === 'Activo' || estado.toLowerCase() === 'habilitado') ? 'habilitado' : 'deshabilitado';
    const query = 'UPDATE insumos SET estado = ? WHERE id = ?';
    db.query(query, [estadoDB, id], (err, result) => {
        if (err) {
            console.error('Error SQL:', err); // Log detallado para depuración
            return res.status(500).json({ error: 'Error al actualizar el estado del insumo', detalle: err.message });
        }
        res.json({ success: true });
    });
}

// Olvide este comentario