require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // Use encryption
        enableArithAbort: process.env.DB_ENABLE_ARITH_ABORT === 'true'
    }
};

module.exports = dbConfig;