import db from './../db/config.db.js'

export function VerUsuarios (req, res) {
    try {
        const query = 'SELECT * FROM usuarios';

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener usuarios:', err);
                return res.status(500).json({ error: 'Error al obtener usuarios' });
            }
            console.log(results);
            res.status(200).json(results);
        });
        console.log('usuarios obtenidos correctamente');
    } catch (error) {
        console.error('Error en obtenerUsuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export function crearUsuario(req, res){
    try{
        const { userTypeId, userName, userId, userTel, userEmail, userConfirmEmail, userRol, estado} = req.body;

        if (userEmail !== userConfirmEmail) {
            return res.status(400).json({ error: 'Los correos no coinciden' });
        }

        // Validar que el estado sea válido
        if (estado !== "habilitado" && estado !== "deshabilitado") {
            return res.status(400).json({ error: "Estado no válido" });
        }

        // Bloquear el envío si el estado es "deshabilitado"
        if (estado === "deshabilitado") {
            return res.status(400).json({ error: "No se puede crear un sensor con el estado 'deshabilitado'" });
        }

        db.query(`INSERT INTO usuarios (tipo_documento, numero_documento, nombre, telefono, correo, rol, estado, fecha_creacion)  
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userTypeId, userId, userName, userTel, userEmail, userRol, new Date(), estado],
            (err, results) => {
                if (err) {
                    console.error('Error al insertar usuario:', err.message);
                    return res.status(500).json({ error: 'Error desconocido al crear el usuario' });
                }
                res.status(201).json({ message: 'Usuario creado correctamente', userId: results.insertId });
            }

        )

        console.log('Usuario creado correctamente');
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'error desconocido'})
    }
}

export function obtenerUsuarioActual(req, res) {
    try {
        // Aquí deberías obtener el ID del usuario de la sesión o token
        // Por ahora, vamos a asumir que tienes una sesión activa
        const userId = req.session.userId; // Esto dependerá de tu implementación de autenticación

        if (!userId) {
            return res.status(401).json({ error: 'No hay usuario autenticado' });
        }

        db.query('SELECT id FROM usuarios WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error al obtener usuario:', err);
                return res.status(500).json({ error: 'Error al obtener usuario' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json({ userId });
        });
    } catch (error) {
        console.error('Error en obtenerUsuarioActual:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
