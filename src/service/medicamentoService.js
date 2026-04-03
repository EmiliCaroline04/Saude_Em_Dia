const pool = require("../config/db");

class MedicamentoService {
    static async criarMedicamento(dados) {
        const {
            id_paciente,
            id_receita,
            nome,
            data_validade,
            dose,
            quantidade,
            tipo,
            mg
        } = dados;

        if (!id_paciente) {
            throw new Error("Informe o paciente.");
        }

        const paciente = await pool.query(
            "SELECT * FROM paciente WHERE id_paciente = $1",
            [id_paciente]
        );

        if (paciente.rows.length === 0) {
            throw new Error("Paciente não encontrado.");
        }

        if (!id_receita) {
            throw new Error("Informe a receita.");
        }

        const receita = await pool.query(
            "SELECT * FROM historico_receita WHERE id_receita = $1",
            [id_receita]
        );

        if (receita.rows.length === 0) {
            throw new Error("Receita não encontrada.");
        }

        const result = await pool.query(
            `INSERT INTO medicamentos
            (id_paciente,id_receita,nome,data_validade,dose,quantidade,tipo,mg)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [
                id_paciente,
                id_receita,
                nome,
                data_validade,
                dose,
                quantidade,
                tipo,
                mg
            ]
        );

        return result.rows[0];
    }
}

module.exports = MedicamentoService;