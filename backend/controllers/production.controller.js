import db from './../db/config.db.js';

// Función para obtener todas las producciones
export function VerProducciones(req, res) {
    try {
        const query = 'SELECT * FROM producciones';

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener producciones:', err.message);
                return res.status(500).json({ error: 'Error al obtener producciones' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error en ver Producciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para crear una producción
export function crearProduccion(req, res) {
    try {
        const { productionName, productionType, productionImage, productionLocation, productionDescription, usuario_id, productionQuantity, estado } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!productionName || !productionType || !productionImage || !productionLocation || !productionDescription || !usuario_id || !productionQuantity || !estado) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validar que productionQuantity sea un número válido y esté dentro del rango permitido
        const parsedQuantity = parseFloat(productionQuantity);
        if (isNaN(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 1000000) {
            return res.status(400).json({ 
                error: 'La cantidad de producción debe ser un número válido entre 1 y 1,000,000 kg' 
            });
        }

        // Bloquear el envío si el estado es "deshabilitado"
        if (estado === "deshabilitado") {
            return res.status(400).json({ error: "No se puede crear una producción con el estado 'deshabilitado'" });
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

            // Consulta para insertar una nueva producción
            db.query(
                `INSERT INTO producciones (nombre, tipo, imagen, ubicacion, descripcion, usuario_id, fecha_creacion, estado, cantidad)  
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [productionName, productionType, productionImage, productionLocation, productionDescription, usuario_id, new Date(), estado, parsedQuantity],
                (err, results) => {
                    if (err) {
                        console.error('Error al insertar producción:', err.message);
                        return res.status(500).json({ error: 'Error desconocido al crear la producción' });
                    }
                    res.status(201).json({ 
                        message: 'Producción creada correctamente', 
                        produccionId: results.insertId,
                        info: `Cantidad de producción: ${parsedQuantity} kg`
                    });
                }
            );
        });
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error desconocido' });
    }
}
