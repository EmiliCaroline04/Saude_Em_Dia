const pool = require("../config/db");

class ReceitaService {
    static async criarReceita(dados, idPerfil) {
        const { id_paciente, id_medico, observacoes } = dados;

        if (!idPerfil || idPerfil != 2) {
            throw new Error("Apenas médicos podem criar receitas.");
        }

        if (!id_paciente || id_paciente === null || id_paciente === undefined) {
            throw new Error("Erro ao adicionar receita: paciente não informado.");
        }

        if (!id_medico || id_medico === null || id_medico === undefined) {
            throw new Error("Erro ao adicionar receita: médico não informado.");
        }

        if (!observacoes || observacoes.trim() === "") {
            throw new Error("Erro ao adicionar receita: observações não informadas.");
        }

        // Verificar se paciente existe
        const paciente = await pool.query(
            "SELECT * FROM paciente WHERE id_paciente = $1",
            [id_paciente]
        );    
        if (paciente.rows.length === 0) {
            throw new Error("Erro ao adicionar receita: paciente não encontrado.");
        }

        const dataAtual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

        const result = await pool.query(
            `INSERT INTO historico_receita
            (id_paciente, id_medico, data_emissao, observacoes)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [id_paciente, id_medico, dataAtual, observacoes]
        );

        return result.rows[0];
    }
}

module.exports = ReceitaService;