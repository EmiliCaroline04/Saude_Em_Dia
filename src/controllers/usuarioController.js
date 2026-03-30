const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.criarUsuario = async (req, res) => {

  const { email, senha_hash, id_perfil } = req.body;

  try {

    if (!email || !senha_hash || !id_perfil) {
      return res.status(400).json({ message: "Campos obrigatórios faltando." });
    }

    // criptografa senha
    const senhaHash = await bcrypt.hash(senha_hash, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (email, senha_hash, id_perfil, ativo, data_criacao)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, senhaHash, id_perfil, true, new Date()]
    );

    res.json(result.rows[0]);

  } catch (error) {

    res.status(500).json({ erro: error.message });

  }

  // INATIVAR USUÁRIO

  //EXCLUIR USUÁRIO
};
