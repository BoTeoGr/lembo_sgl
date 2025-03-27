import express from 'express';//lo que se usa pa los servidores listo
import db from './db/config.db.js'
import cors from 'cors';//y esto es para que el html y js del navegador no piensen que es peligroso
import UserRouter from './routes/users.routes.js'

const app = express();
app.use(express.json());

app.use('/users', UserRouter)
const corsOptions = {
    origin: 'http://localhost:3000',//cambieme esto mano a donde vaya a poner el html 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));

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
