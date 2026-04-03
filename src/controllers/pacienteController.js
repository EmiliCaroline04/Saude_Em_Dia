const PacienteService = require("../service/pacienteService");

exports.criarPaciente = async (req, res) => {

    const dados = req.body;

    try {
        const paciente = await PacienteService.criarPaciente(dados);

        res.json(paciente);

    } catch (error) {

        res.status(500).json({ erro: error.message });

    }

};

exports.listarPacientes = async (req, res) => {

    try {
        const pacientes = await PacienteService.listarPacientes();

        res.json(pacientes);

    } catch (error) {

        res.status(500).json({ erro: error.message });

    }

};