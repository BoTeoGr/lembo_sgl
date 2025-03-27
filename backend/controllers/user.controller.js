import db from './../db/config.db.js'

//papi estás son las funciones de las rutas

export function VerUsuarios (req, res) {
    try {
        const query = 'SELECT id, tipo_documento, numero_documento, nombre, telefono, correo, rol, fecha_creacion, fecha_actualizacion FROM usuarios';

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener usuarios:', err);
                return res.status(500).json({ error: 'Error al obtener usuarios' });
            }

            res.status(200).json(results);
        });

    } catch (error) {
        console.error('Error en obtenerUsuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export function crearUsuario(req, res){
    try{
        const { userTypeId, userName, userId, userTel, userEmail, userConfirmEmail, userRol } = req.body;

        if (userEmail !== userConfirmEmail) {
            return res.status(400).json({ error: 'Los correos no coinciden' });
        }

        const tiposDocumento = ['ti', 'cc', 'ppt'];
        if (!tiposDocumento.includes(userTypeId)) {
            return res.status(400).json({ error: 'Tipo de documento invalido' });
        }
        const rolesValidos = ['superadmin', 'admin', 'apoyo', 'visitante'];
        if (!rolesValidos.includes(userRol)) {
            return res.status(400).json({ error: 'Rol invalido' });
        }

        //esta ya es la peticion a la base de datos pa
        db.query(`INSERT INTO usuarios (tipo_documento, numero_documento, nombre, telefono, correo, rol)  
            VALUES (?, ?, ?, ?, ?, ?)`,
            [userTypeId, userId, userName, userTel, userEmail, userRol],
            (err, results) => {
                if (err) {
                    console.error('error al insertar usuario:', err);
                    return res.status(500).json({ error: 'error desconocido al crear el usuario' });
                }
                res.status(201).json({ message: 'usuario creado correctamente', userId: results.insertId });
            }

        )
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'error desconocido'})
    }
}
