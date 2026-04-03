const UsuarioService = require("../service/usuarioService");

exports.criarUsuario = async (req, res) => {

    const dados = req.body;

    try {
        const usuario = await UsuarioService.criarUsuario(dados);

        res.json(usuario);

    } catch (error) {

        res.status(500).json({ erro: error.message });

    }

    // INATIVAR USUÁRIO

    //EXCLUIR USUÁRIO
};
