import mysql from 'mysql2'; 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistema_gestion_agricola'
});

export default db;
