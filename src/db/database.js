import mysql from "mysql2/promise";
import config from "../config";

const pool = mysql.createPool(
    {
    host: config.mysql.host,
    port: config.mysql.port,
    database: config.mysql.database,
    user: config.mysql.user,
    password : config.mysql.password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// Función para probar la conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ Conectado a MySQL en ${config.mysql.host}:${config.mysql.port} - Base de datos: ${config.mysql.database}`);
        connection.release();
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error.message);
    }
};

// Probar conexión al iniciar
testConnection();

export default pool