const MedicoService = require("../service/medicoService");

exports.criarMedico = async (req, res) => {

    const dados = req.body;

    try {
        const medico = await MedicoService.criarMedico(dados);

        res.json(medico);

    } catch (error) {

        res.status(500).json({ erro: error.message });

    }

};