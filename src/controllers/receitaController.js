//Histórico de receitas médicas
const pool = require("../config/db");

exports.criarReceita = async (req, res) => {

  const {
    id_paciente,
    id_medico,
    data_emissao,
    observacoes
  } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO historico_receita
      (id_paciente, id_medico, data_emissao, observacoes)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [id_paciente, id_medico, data_emissao, observacoes]
    );

    res.json(result.rows[0]);

  } catch (error) {

    res.status(500).json({ erro: error.message });

  }

};