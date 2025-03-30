import db from './../db/config.db.js';

// Función para obtener todos los insumos
export function VerInsumos(req, res) {
    try {
        const query = 'SELECT * FROM insumos';

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener insumos:', err.message);
                return res.status(500).json({ error: 'Error al obtener insumos' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error en VerInsumos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para crear un insumo
export function crearInsumo(req, res) {
    try {
        const { insumeName, insumeType, insumeImage, insumeExtent, insumeDescription, insumePrice, insumeAmount, totalValue, insumeId } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!insumeName || !insumeType || !insumeImage || !insumeExtent || !insumePrice || !insumeAmount || !totalValue || !insumeDescription || !insumeId) {
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

        // Validar que el usuario exista
        db.query('SELECT id FROM usuarios WHERE id = ?', [insumeId], (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).json({ error: 'El usuario especificado no existe' });
            }

            // Consulta para insertar un nuevo insumo
            db.query(
                `INSERT INTO insumos (nombre, tipo, imagen, unidad_medida, valor_unitario, cantidad, valor_total, descripcion, usuario_id, fecha_creacion)  
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
                [insumeName, insumeType, insumeImage, insumeExtent, insumePrice, insumeAmount, totalValue, insumeDescription, new Date()],
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