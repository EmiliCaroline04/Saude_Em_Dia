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
}

module.exports = PacienteService;