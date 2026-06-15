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

exports.excluirMedico = async (req, res) => {
    const { id_medico } = req.params;
    const { id_perfil } = req.body;

    try {
        const medico = await UsuarioService.excluirMedico(id_medico, id_perfil);

        res.json({ message: "Médico excluído com sucesso!", medico });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.excluirPaciente = async (req, res) => {
    const { id_paciente } = req.params;

    try {
        const paciente = await UsuarioService.excluirPaciente(id_paciente);

        res.json({ message: "Paciente excluído com sucesso!", paciente });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};
