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

exports.agendarConsulta = async (req, res) => {
    const dados = req.body;
    const { id_paciente } = req.params;

    try {
        const agendamento = await PacienteService.agendarConsulta(dados, id_paciente);

        res.json({ message: "Consulta agendada com sucesso!", agendamento });

    } catch (error) {

        res.status(500).json({ erro: error.message });

    }
};

exports.cancelarConsulta = async (req, res) => {
    const { id_agendamento } = req.params;
    const { id_paciente } = req.params;

    try {
        const agendamento = await PacienteService.cancelarConsulta(id_agendamento, id_paciente);

        res.json({ message: "Consulta cancelada com sucesso!", agendamento });

    } catch (error) {

        res.status(500).json({ erro: error.message });

    }
};