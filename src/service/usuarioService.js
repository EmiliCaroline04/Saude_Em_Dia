const pool = require("../config/db");
const bcrypt = require("bcrypt");

class UsuarioService {
    static async criarUsuario(dados) {
        const { email, senha_hash, id_perfil } = dados;

        if (!email || !senha_hash || !id_perfil) {
            throw new Error("Campos obrigatórios faltando.");
        }

        // Verifica se o usuário já existe
        const existeUsuario = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
        if (existeUsuario.rows.length > 0) {
            throw new Error("Usuário com este email já existe.");
        }

        // criptografa senha
        const senhaHash = await bcrypt.hash(senha_hash, 10);

        const resultado = await pool.query(
            `INSERT INTO usuarios (email, senha_hash, id_perfil, ativo, data_criacao)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [email, senhaHash, id_perfil, true, new Date()]
        );

        return resultado.rows[0];
    }

    static async excluirUsuario(id_usuario) {
        if (!id_usuario) {
            throw new Error("ID do usuário é obrigatório.");
        }

        const resultado = await pool.query(`DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *`, [id_usuario]);

        if (resultado.rows.length === 0) {
            throw new Error("Usuário não encontrado.");
        }

        return resultado.rows[0];
    }

    static async excluirMedico(id_medicamento, id_perfil) {
        if (!id_perfil) {
            throw new Error("Perfil do usuário é obrigatório.");
        }

        if (Number(id_perfil) !== 1) {
            throw new Error("Apenas administradores podem excluir médicos.");
        }

        if (!id_medicamento) {
            throw new Error("ID do médico é obrigatório.");
        }

        const resultado = await pool.query(`DELETE FROM medico WHERE id_medico = $1 RETURNING *`, [id_medicamento]);

        if (resultado.rows.length === 0) {
            throw new Error("Médico não encontrado.");
        }

        return resultado.rows[0];
    }

    static async excluirPaciente(id_paciente) {
        if (!id_paciente) {
            throw new Error("ID do paciente é obrigatório.");
        }

        const resultado = await pool.query(`DELETE FROM paciente WHERE id_paciente = $1 RETURNING *`, [id_paciente]);

        if (resultado.rows.length === 0) {
            throw new Error("Paciente não encontrado.");
        }

        return resultado.rows[0];
    }
}

module.exports = UsuarioService;