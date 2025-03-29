// Función para obtener todos los sensores
import db from './../db/config.db.js';

export function VerSensores(req, res) {
    try {
        const query = 'SELECT id, tipo_sensor, nombre_sensor, unidad_medida, imagen, descripcion, tiempo_escaneo, usuario_id, fecha_creacion FROM sensores';

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener sensores:', err.message); // Imprime el mensaje del error
                return res.status(500).json({ error: 'Error al obtener sensores' });
            }
            console.log('Resultados obtenidos:', results); // Verifica los resultados obtenidos
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error en VerSensores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para crear un sensor
export function crearSensor(req, res) {
    try {
        const { userType, userNameSensor, userMedida, userImage, userDescription, userEscaneo, userId } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!userType || !userNameSensor || !userMedida || !userImage || !userDescription || !userEscaneo || !userId) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Consulta para insertar un nuevo sensor
        db.query(
            `INSERT INTO sensores (tipo_sensor, nombre_sensor, unidad_medida, imagen, descripcion, tiempo_escaneo, usuario_id, fecha_creacion)  
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userType, userNameSensor, userMedida, userImage, userDescription, userEscaneo, userId, new Date()],
            (err, results) => {
                if (err) {
                    console.error('Error al insertar sensor:', err.message); // Imprime el mensaje del error
                    return res.status(500).json({ error: 'Error desconocido al crear el sensor' });
                }
                res.status(201).json({ message: 'Sensor creado correctamente', sensorId: results.insertId });
            }
        );

        console.log('Sensor creado correctamente');
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error desconocido' });
    }
}