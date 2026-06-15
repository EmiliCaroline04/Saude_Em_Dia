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

exports.editarPaciente = async (req, res) => {
    const { id_paciente } = req.params;
    const dados = req.body;
    const idPerfil = req.headers["id-perfil"] || req.headers["id_perfil"];
    const idPacienteSolicitante = req.headers["id-paciente"] || req.headers["id_paciente"];

    try {
        const paciente = await PacienteService.editarPaciente(id_paciente, dados, idPerfil, idPacienteSolicitante);

        res.json({ message: "Paciente atualizado com sucesso!", paciente });

    } catch (error) {
        if (error.message.includes("Acesso negado")) {
            res.status(403).json({ erro: error.message });
        } else {
            res.status(500).json({ erro: error.message });
        }
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

exports.listarProximasConsultas = async (req, res) => {
    const idPerfil = req.headers["id-perfil"] || req.headers["id_perfil"];
    const idPaciente = req.headers["id-paciente"] || req.headers["id_paciente"] || req.params.id_paciente;
    const idMedico = req.headers["id-medico"] || req.headers["id_medico"];

    try {
        let consultas;

        if (idPaciente && !req.params.id_paciente) {
            consultas = await PacienteService.listarProximasConsultasPorPaciente(idPaciente);
        } else if (idPerfil && Number(idPerfil) === 2) {
            if (!idMedico) {
                throw new Error("ID do médico é obrigatório para listar consultas de médico.");
            }
            consultas = await PacienteService.listarProximasConsultasPorMedico(idMedico);
        } else if (req.params.id_paciente) {
            consultas = await PacienteService.listarProximasConsultas(req.params.id_paciente);
        } else {
            throw new Error("Parâmetros insuficientes para listar próximas consultas.");
        }

        res.json({ message: "Próximas consultas", consultas });

    } catch (error) {

        res.status(500).json({ erro: error.message });

    }
};