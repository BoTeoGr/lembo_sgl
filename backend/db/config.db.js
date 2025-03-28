import mysql from 'mysql2'; // Para usar MySQL

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sistema_gestion_agricola'
});

export default db;
