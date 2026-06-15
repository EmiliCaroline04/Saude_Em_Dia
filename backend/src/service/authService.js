const pool = require("../config/db");
const bcrypt = require("bcrypt");

class AuthService {
    static async logarUsuario(email, senhaInformada) {
        if (!email || !senhaInformada) {
            throw new Error("Email e senha são obrigatórios.");
        }

        const resultadoBusca = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        if (resultadoBusca.rows.length === 0) {
            throw new Error("Usuário não cadastrado.");
        }

        const usuarioBanco = resultadoBusca.rows[0];
        const senhaHashArmazenada = usuarioBanco.senha_hash;

        let senhaValida = false;
        if (senhaHashArmazenada) {
            try {
                senhaValida = await bcrypt.compare(senhaInformada, senhaHashArmazenada);
            } catch {
                senhaValida = senhaInformada === senhaHashArmazenada;
            }
        }

        if (!senhaValida) {
            throw new Error("Senha inválida.");
        }

        return {
            id: usuarioBanco.id_usuario || usuarioBanco.id,
            email: usuarioBanco.email,
            id_perfil: usuarioBanco.id_perfil,
        };
    }
}

module.exports = AuthService;