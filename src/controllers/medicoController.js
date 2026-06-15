const MedicoService = require("../service/medicoService");

exports.criarMedico = async (req, res) => {

    const dados = req.body;
    const idPerfil = req.headers["id-perfil"];

    try {
        const medico = await MedicoService.criarMedico(dados, idPerfil);

        res.json({ message: "Médico criado com sucesso!", medico });

    } catch (error) {

        res.status(500).json({ erro: error.message });

    }

};