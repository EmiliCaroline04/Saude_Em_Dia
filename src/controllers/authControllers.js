const pool = require("../config/db");

exports.logarUsuario = async (req, res) => {

    const {
        usuario,
        senha
    } = req.body;

    try {
        const resultadoBusca = await pool.query(
            "SELECT * FROM usuarios WHERE usuario = $1",
            [usuario]
        );

        if (resultadoBusca.rows.length === 0) {
            return res.status(401).json({
                message: "Usuário não cadastrado."
            });
        }

        const usuarioBanco = resultadoBusca.rows[0];

        if (usuarioBanco.senha !== senha) {
            return res.status(401).json({
                message: "Senha inválida."
            });
        }

        res.json({
            message: "Login bem-sucedido!",
            usuario: {
                id: usuarioBanco.id,
                usuario: usuarioBanco.usuario
            }
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};