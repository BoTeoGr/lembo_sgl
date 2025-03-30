import db from './../db/config.db.js ';

// Función para obtener todos los ciclos de cultivo
export function VerCiclosCultivo(req, res) {
    try {
        const query = 'SELECT * FROM ciclo_cultivo';

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener ciclos de cultivo:', err.message);
                return res.status(500).json({ error: 'Error al obtener ciclos de cultivo' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error en VerCiclosCultivo:', error);
        res.status(500).json({ error: 'Error desconocido' });
    }
}

// Función para crear un nuevo ciclo de cultivo
export function crearCicloCultivo(req, res) {
    try {
        const { cycleName, cycleDescription, cycleStartDate, cycleEndDate, cycleUpdates } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!cycleName || !cycleDescription || !cycleStartDate || !cycleEndDate || !cycleUpdates) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Consulta para insertar un nuevo ciclo de cultivo
        db.query(
            `INSERT INTO ciclo_cultivo (nombre, descripcion, periodo_inicio, periodo_final, novedades)  
            VALUES (?, ?, ?, ?, ?)`,
            [cycleName, cycleDescription, cycleStartDate, cycleEndDate, cycleUpdates],
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
