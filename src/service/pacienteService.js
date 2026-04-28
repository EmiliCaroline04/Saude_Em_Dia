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
}

module.exports = PacienteService;