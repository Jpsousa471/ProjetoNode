import mysql from 'mysql';

const pool = mysql.createPool({
    "user":"root",
    "password":"1234",
    "database":"api-yt-project",
    "host":"localhost",
    "port": 3306
})

export { pool };