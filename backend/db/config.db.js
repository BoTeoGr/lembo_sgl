import mysql from 'mysql2'; 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',  
    database: 'sistema_gestion_agricola'
});

export default db;
