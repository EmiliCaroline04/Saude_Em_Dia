const pool = require("../config/db");
const bcrypt = require("bcrypt");

class AuthService {
    static async logarUsuario(email, senha_hash) {
        console.log("Email:", email);
        console.log("Senha:", senha_hash);
        const resultadoBusca = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );
        
        if (resultadoBusca.rows.length === 0) {
            throw new Error("Usuário não cadastrado.");
        }

        const usuarioBanco = resultadoBusca.rows[0];
        
        // Compara a senha em texto plano com o hash armazenado no banco
        const senhaValida = await bcrypt.compare(senha_hash, usuarioBanco.senha_hash);
        
        if (!senhaValida) {
            throw new Error("Senha inválida.");
        }

        return {
            id: usuarioBanco.id,
            email: usuarioBanco.email
        };
    }
}

module.exports = AuthService;