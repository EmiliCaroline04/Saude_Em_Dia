const pool = require("../config/db");
const bcrypt = require("bcrypt");

class UsuarioService {
    static async criarUsuario(dados) {
        const { email, senha_hash, id_perfil } = dados;

        if (!email || !senha_hash || !id_perfil) {
            throw new Error("Campos obrigatórios faltando.");
        }

        // criptografa senha
        const senhaHash = await bcrypt.hash(senha_hash, 10);

        const result = await pool.query(
            `INSERT INTO usuarios (email, senha_hash, id_perfil, ativo, data_criacao)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [email, senhaHash, id_perfil, true, new Date()]
        );

        return result.rows[0];
    }
}

module.exports = UsuarioService;