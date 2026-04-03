const pool = require("../config/db");

class ReceitaService {
    static async criarReceita(dados) {
        const {
            id_paciente,
            id_medico,
            data_emissao,
            observacoes
        } = dados;

        const result = await pool.query(
            `INSERT INTO historico_receita
            (id_paciente, id_medico, data_emissao, observacoes)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [id_paciente, id_medico, data_emissao, observacoes]
        );

        return result.rows[0];
    }
}

module.exports = ReceitaService;