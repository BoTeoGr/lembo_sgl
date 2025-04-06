import db from './../db/config.db.js';

// Función para obtener todos los cultivos
export function VerCultivos(req, res) {
    try {
        const query = 'SELECT * FROM cultivos';

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener cultivos:', err.message);
                return res.status(500).json({ error: 'Error al obtener cultivos' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error en ver Cultivos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para crear un cultivo
export function crearCultivo(req, res) {
    try {
        const { cultiveName, cultiveType, cultiveImage, cultiveLocation, cultiveDescription, usuario_id, cultiveSize, estado } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!cultiveName || !cultiveType || !cultiveImage || !cultiveLocation || !cultiveDescription || !usuario_id || !cultiveSize || !estado) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
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
                `INSERT INTO cultivos (nombre, tipo, imagen, ubicacion, descripcion, usuario_id, fecha_creacion, estado)  
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [cultiveName, cultiveType, cultiveImage, cultiveLocation, cultiveDescription, usuario_id , new Date(), parsedSize, estado],
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
// Olvide este comentario