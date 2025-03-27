const express = require('express')//<- crear servidor 
const mysql = require('mysql2')
const cors = require('cors')//<- Comparticion entre origenes cruzados

const app = express()
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'sistema_gestion_agricola'
})

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err)
        return;
    }
    console.log('Conectando a la BD - Full')
})

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000')
})