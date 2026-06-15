const AuthService = require("../service/authService");

exports.logarUsuario = async (req, res) => {
    const { email, cpf, senha, senha_hash } = req.body;
    const emailOuCpf = email || cpf;
    const senhaInformada = senha_hash || senha;

    if (!emailOuCpf || !senhaInformada) {
        return res.status(400).json({ erro: "Email/CPF e senha são obrigatórios." });
    }

    try {
        const usuario = await AuthService.logarUsuario(emailOuCpf, senhaInformada);

        res.json({
            message: "Login bem-sucedido!",
            usuario,
        });
    } catch (error) {
        res.status(401).json({ erro: error.message });
    }
};
