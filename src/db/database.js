import mysql from "mysql2/promise";
import config from "../config";

const pool = mysql.createConnection(
    {
    host: config.mysql.host,
    database: config.mysql.database,
    user: config.mysql.user,
    password : config.mysql.password,
    waitForConnections: true,
    connectionLimit: 10, 
})

export default pool