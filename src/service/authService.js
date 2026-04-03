const pool = require("../config/db");

class AuthService {
    static async logarUsuario(email, senha_hash) {
        const resultadoBusca = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );
        
        if (resultadoBusca.rows.length === 0) {
            throw new Error("Usuário não cadastrado.");
        }

        const usuarioBanco = resultadoBusca.rows[0];
        
        console.log("Senha:", senha_hash);
        if (usuarioBanco.senha !== senha_hash) {
            throw new Error("Senha inválida.");
        }

        return {
            id: usuarioBanco.id,
            email: usuarioBanco.email
        };
    }
}

module.exports = AuthService;