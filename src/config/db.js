/*
Arquivo responsável pela conexão com o banco PostgreSQL
*/

const { Pool } = require("pg");
require("dotenv").config();

/*
Pool cria um conjunto de conexões reutilizáveis
melhorando performance da aplicação
*/

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

module.exports = pool;

