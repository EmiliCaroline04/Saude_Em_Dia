const pool = require("../config/db");

exports.criarMedicamento = async (req, res) => {

  const {
    id_paciente,
    id_receita,
    nome,
    data_validade,
    dose,
    quantidade,
    tipo,
    mg
  } = req.body;

  try {

    if (!id_paciente) {
      return res.status(400).json({ message: "Informe o paciente." });
    }

    const paciente = await pool.query(
      "SELECT * FROM paciente WHERE id_paciente = $1",
      [id_paciente]
    );

    if (paciente.rows.length === 0) {
      return res.status(400).json({ message: "Paciente não encontrado." });
    }

    if (!id_receita) {
      return res.status(400).json({ message: "Informe a receita." });
    }

    const receita = await pool.query(
      "SELECT * FROM historico_receita WHERE id_receita = $1",
      [id_receita]
    );

    if (receita.rows.length === 0) {
      return res.status(400).json({ message: "Receita não encontrada." });
    }

    const result = await pool.query(
      `INSERT INTO medicamentos
      (id_paciente,id_receita,nome,data_validade,dose,quantidade,tipo,mg)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        id_paciente,
        id_receita,
        nome,
        data_validade,
        dose,
        quantidade,
        tipo,
        mg
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {

    res.status(500).json({ erro: error.message });

  }
};