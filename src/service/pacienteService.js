const pool = require("../config/db");

class PacienteService {
    static async criarPaciente(dados) {
        const {
            nome,
            cpf,
            endereco,
            telefone,
            sexo,
            data_nascimento
        } = dados;

        const result = await pool.query(
            `INSERT INTO paciente
            (nome, cpf, endereco, telefone, sexo, data_nascimento)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [nome, cpf, endereco, telefone, sexo, data_nascimento]
        );

        return result.rows[0];
    }

    static async listarPacientes() {
        const result = await pool.query("SELECT * FROM paciente");
        return result.rows;
    }

    static async editarPaciente(idPaciente, dados, idPerfil, idPacienteSolicitante) {
        if (!idPaciente) {
            throw new Error("ID do paciente é obrigatório.");
        }

        if (!dados || Object.keys(dados).length === 0) {
            throw new Error("Nenhum dado foi informado para atualização.");
        }

        const perfil = Number(idPerfil);
        const isAdmin = perfil === 1;
        const isSelf = String(idPacienteSolicitante) === String(idPaciente);

        if (!isAdmin && !isSelf) {
            throw new Error("Acesso negado. Apenas administradores ou o próprio paciente podem editar este cadastro.");
        }

        const pacienteExistente = await pool.query(
            "SELECT * FROM paciente WHERE id_paciente = $1",
            [idPaciente]
        );

        if (pacienteExistente.rows.length === 0) {
            throw new Error("Paciente não encontrado.");
        }

        const camposPermitidos = ["nome", "cpf", "endereco", "telefone", "sexo", "data_nascimento"];
        const atualizacoes = [];
        const valores = [idPaciente];

        camposPermitidos.forEach((campo) => {
            if (dados[campo] !== undefined) {
                atualizacoes.push(`${campo} = $${valores.length + 1}`);
                valores.push(dados[campo]);
            }
        });

        if (atualizacoes.length === 0) {
            throw new Error("Nenhum campo válido foi informado para atualização.");
        }

        const result = await pool.query(
            `UPDATE paciente
             SET ${atualizacoes.join(", ")}
             WHERE id_paciente = $1
             RETURNING *`,
            valores
        );

        return result.rows[0];
    }

    static async agendarConsulta(dados, idPaciente) {
        const { id_medico, data_hora_agendada, motivo_consulta } = dados;

        if (!id_medico) {
            throw new Error("Médico é obrigatório.");
        }

        if (!data_hora_agendada) {
            throw new Error("Data e hora da consulta são obrigatórios.");
        }

        // Verificar se o paciente existe
        const paciente = await pool.query(
            "SELECT * FROM paciente WHERE id_paciente = $1",
            [idPaciente]
        );

        if (paciente.rows.length === 0) {
            throw new Error("Paciente não encontrado.");
        }

        // Verificar se o médico existe
        const medico = await pool.query(
            "SELECT * FROM medico WHERE id_medico = $1",
            [id_medico]
        );

        if (medico.rows.length === 0) {
            throw new Error("Médico não encontrado.");
        }

        // Verificar se a data/hora é válida (não pode ser no passado)
        const dataConsulta = new Date(data_hora_agendada);
        if (dataConsulta < new Date()) {
            throw new Error("Não é possível agendar consulta para uma data/hora no passado.");
        }

        const result = await pool.query(
            `INSERT INTO agendamento
            (id_paciente, id_medico, data_hora_agendada, motivo_consulta, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [idPaciente, id_medico, data_hora_agendada, motivo_consulta, 'AGENDADO']
        );

        return result.rows[0];
    }

    static async cancelarConsulta(idAgendamento, idPaciente) {
        if (!idAgendamento) {
            throw new Error("ID do agendamento é obrigatório.");
        }

        // Verificar se o agendamento existe e pertence ao paciente
        const agendamento = await pool.query(
            "SELECT * FROM agendamento WHERE id_agendamento = $1 AND id_paciente = $2",
            [idAgendamento, idPaciente]
        );

        if (agendamento.rows.length === 0) {
            throw new Error("Agendamento não encontrado ou não pertence a este paciente.");
        }

        // Verificar se o agendamento pode ser cancelado
        const statusAtual = agendamento.rows[0].status;
        if (statusAtual === 'CANCELADO') {
            throw new Error("Esta consulta já está cancelada.");
        }

        if (statusAtual === 'CONCLUIDO') {
            throw new Error("Não é possível cancelar uma consulta já concluída.");
        }

        if (statusAtual === 'FALTOU') {
            throw new Error("Não é possível cancelar uma consulta com falta registrada.");
        }

        // Atualizar o status para CANCELADO
        const result = await pool.query(
            `UPDATE agendamento 
             SET status = $1 
             WHERE id_agendamento = $2 
             RETURNING *`,
            ['CANCELADO', idAgendamento]
        );

        return result.rows[0];
    }

    static formatarConsulta(consulta, nomePessoa) {
        const data = new Date(consulta.data_hora_agendada);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano} - ${horas}:${minutos} | ${consulta[nomePessoa]}`;
    }

    // Tela 4 do FIGMA: Na secao "PROXIMAS CONSULTAS", traz a data/horario e nome do medico(s) formatados
    static async listarProximasConsultasPorPaciente(idPaciente) {
        if (!idPaciente) {
            throw new Error("ID do paciente é obrigatório.");
        }

        const paciente = await pool.query(
            "SELECT * FROM paciente WHERE id_paciente = $1",
            [idPaciente]
        );

        if (paciente.rows.length === 0) {
            throw new Error("Paciente não encontrado.");
        }

        const result = await pool.query(
            `SELECT a.id_agendamento, a.data_hora_agendada, m.nome AS nome_medico
             FROM agendamento a
             JOIN medico m ON a.id_medico = m.id_medico
             WHERE a.id_paciente = $1
             AND a.status = 'AGENDADO'
             AND a.data_hora_agendada > NOW()
             ORDER BY a.data_hora_agendada ASC`,
            [idPaciente]
        );

        return result.rows.map(consulta => PacienteService.formatarConsulta(consulta, 'nome_medico'));
    }

    static async listarProximasConsultasPorMedico(idMedico) {
        if (!idMedico) {
            throw new Error("ID do médico é obrigatório.");
        }

        const medico = await pool.query(
            "SELECT * FROM medico WHERE id_medico = $1",
            [idMedico]
        );

        if (medico.rows.length === 0) {
            throw new Error("Médico não encontrado.");
        }

        const result = await pool.query(
            `SELECT a.id_agendamento, a.data_hora_agendada, p.nome AS nome_paciente
             FROM agendamento a
             JOIN paciente p ON a.id_paciente = p.id_paciente
             WHERE a.id_medico = $1
             AND a.status = 'AGENDADO'
             AND a.data_hora_agendada > NOW()
             ORDER BY a.data_hora_agendada ASC`,
            [idMedico]
        );

        return result.rows.map(consulta => PacienteService.formatarConsulta(consulta, 'nome_paciente'));
    }
}

module.exports = PacienteService;