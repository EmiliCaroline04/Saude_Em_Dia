const pool = require("../config/db");

exports.criarPaciente = async (req, res) => {

  const {
    nome,
    cpf,
    endereco,
    telefone,
    sexo,
    data_nascimento
  } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO paciente
      (nome, cpf, endereco, telefone, sexo, data_nascimento)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [nome, cpf, endereco, telefone, sexo, data_nascimento]
    );

    res.json(result.rows[0]);

  } catch (error) {

    res.status(500).json({ erro: error.message });

  }

};

exports.listarPacientes = async (req, res) => {

  try {

    const result = await pool.query("SELECT * FROM paciente");

    res.json(result.rows);

  } catch (error) {

    res.status(500).json({ erro: error.message });

  }

};