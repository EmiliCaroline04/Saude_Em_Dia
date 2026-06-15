const MedicoService = require("../service/medicoService");

exports.criarMedico = async (req, res) => {
    const dados = req.body;
    const idPerfil = req.headers["id-perfil"];

    try {
        const resultado = await MedicoService.criarMedico(dados, idPerfil);

        res.json({ message: "Médico criado com sucesso!", medico: resultado.medico, usuario: resultado.usuario });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};