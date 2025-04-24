import express from 'express';//lo que se usa pa los servidores listo
import db from './db/config.db.js'
import cors from 'cors';//y esto es para que el html y js del navegador no piensen que es peligroso
import dataRoutes from './routes/routes.js'

const app = express();
app.use(express.json({ limit: '50mb' })); // Aumentar el límite para imágenes base64
app.use(cors());
app.use('/', dataRoutes)

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conectando a la BD - Full');
});

app.listen(5000, () => {
    console.log('Servidor escuchando en http://localhost:5000');
});

//Ejecutar el servidor con nodemon (automatizar el reinicio del servidor cuando detecta cambios en los archivos de tu proyecto): npm run dev
