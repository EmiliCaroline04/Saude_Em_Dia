const UsuarioService = require("../service/usuarioService");

exports.criarUsuario = async (req, res) => {
    const dados = req.body;

    try {
        const usuario = await UsuarioService.criarUsuario(dados);
        
        res.json({ message: "Usuario criado com sucesso!", 
            usuario: usuario 
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.excluirUsuario = async (req, res) => {
    const { id_usuario } = req.params;
   
    try {
        const usuario = await UsuarioService.excluirUsuario(id_usuario);

        res.json({ message: "Usuário excluído com sucesso!", 
            usuario: usuario
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};
