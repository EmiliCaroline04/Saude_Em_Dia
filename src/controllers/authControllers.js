const AuthService = require("../service/authService");

exports.logarUsuario = async (req, res) => {

    const {
        email,
        senha_hash
    } = req.body;

    try {
        const usuario = await AuthService.logarUsuario(email, senha_hash);

        res.json({
            message: "Login bem-sucedido!",
            usuario: usuario
        });

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
};
