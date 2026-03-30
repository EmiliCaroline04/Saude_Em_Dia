const pool = require("../config/db");

exports.criarMedico = async (req, res) => {

  const {
    crm,
    nome,
    especialidade,
    telefone_consultorio
  } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO medico
      (crm, nome, especialidade, telefone_consultorio)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [crm, nome, especialidade, telefone_consultorio]
    );

    res.json(result.rows[0]);

  } catch (error) {

    res.status(500).json({ erro: error.message });

  }

};