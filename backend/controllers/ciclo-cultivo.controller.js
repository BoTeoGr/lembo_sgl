import db from './../db/config.db.js ';


export function VerCiclosCultivo(req, res) {
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

        // Consulta para obtener los ciclo cultivo con paginación
        const query = `
            SELECT 
                id AS cicloCultivoId,
                nombre AS nombre,
                tipo AS tipo,
                imagen AS imagen,
                ubicacion AS ubicacion,
                descripcion AS descripcion,
                usuario_id AS usuarioId,
                tamano AS tamano,
                estado AS estado,
                fecha_creacion AS fechaCreacion
            FROM ciclo_cultivo
            LIMIT ? OFFSET ?
        `;
        const countQuery = 'SELECT COUNT(*) AS total FROM ciclo_cultivo';

        // Obtener el total de ciclo cultivo
        db.query(countQuery, (err, countResults) => {
            if (err) {
                console.error('Error al contar ciclo cultivo:', err.message);
                return res.status(500).json({ error: 'Error al contar cultivos' });
            }

            const totalCicloCultivos = countResults[0].total;
            const totalPages = Math.ceil(totalCultivos / limitNumber);

            // Obtener los cultivos con paginación
            db.query(query, [limitNumber, offset], (err, results) => {
                if (err) {
                    console.error('Error al obtener ciclo de cultivo:', err.message);
                    return res.status(500).json({ error: 'Error al obtener ciclo de cultivo' });
                }

                // Responder con los datos paginados
                res.status(200).json({
                    ciclo_cultivo: results,
                    totalCicloCultivos,
                    totalPages,
                    currentPage: pageNumber,
                });
            });
        });
    } catch (error) {
        console.error('Error en VerCicloCultivo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



// Función para crear un nuevo ciclo de cultivo
export function crearCicloCultivo(req, res) {
    try {
        const { cycleName, cycleDescription, cycleStartDate, cycleEndDate, cycleUpdates, estado, usuario_id  } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!cycleName || !cycleDescription || !cycleStartDate || !cycleEndDate || !cycleUpdates || !estado || !usuario_id ) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Bloquear el envío si el estado es "deshabilitado"
        if (estado === "deshabilitado") {
            return res.status(400).json({ error: "No se puede crear un sensor con el estado 'deshabilitado'" });
        }

        // Validar que el estado sea válido
        if (estado !== "habilitado" && estado !== "deshabilitado") {
            return res.status(400).json({ error: "Estado no válido" });
        }

        // Validar que las fechas tengan un formato válido
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(cycleStartDate) || !dateRegex.test(cycleEndDate)) {
            return res.status(400).json({ error: 'Formato de fecha no válido. Use YYYY-MM-DD' });
        }

        // Validar que la fecha de inicio sea anterior a la fecha final
        if (new Date(cycleStartDate) > new Date(cycleEndDate)) {
            return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la fecha final' });
        }

        // Consulta para insertar un nuevo ciclo de cultivo
        db.query(
            `INSERT INTO ciclo_cultivo (nombre, descripcion, periodo_inicio, periodo_final, novedades, usuario_id, estado)  
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [cycleName, cycleDescription, cycleStartDate, cycleEndDate, cycleUpdates, usuario_id, estado],
            (err, results) => {
                if (err) {
                    console.error('Error al insertar ciclo de cultivo:', err.message);
                    return res.status(500).json({ error: 'Error desconocido al crear el ciclo de cultivo' });
                }
                res.status(201).json({ message: 'Ciclo de cultivo creado correctamente', cicloCultivoId: results.insertId });
            }
        );
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error desconocido' });
    }
}
