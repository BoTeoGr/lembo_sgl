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
        const { userTypeId, userName, userId, userTel, userEmail, userConfirmEmail, userRol } = req.body;

        if (userEmail !== userConfirmEmail) {
            return res.status(400).json({ error: 'Los correos no coinciden' });
        }

        db.query(`INSERT INTO usuarios (tipo_documento, numero_documento, nombre, telefono, correo, rol, fecha_creacion)  
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userTypeId, userId, userName, userTel, userEmail, userRol, new Date()],
            (err, results) => {
                if (err) {
                    console.error('error al insertar usuario:', err);
                    return res.status(500).json({ error: 'error desconocido al crear el usuario' });
                }
                res.status(201).json({ message: 'usuario creado correctamente', userId: results.insertId });
            }
        )

        console.log('Usuario creado correctamente');
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'error desconocido'})
    }
}
