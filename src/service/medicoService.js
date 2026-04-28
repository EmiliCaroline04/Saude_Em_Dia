const pool = require("../config/db");

class MedicoService {
    static async criarMedico(dados, idPerfil) {
        // Verificar se o usuário é administrador
        if (!idPerfil || Number(idPerfil) !== 1) {
            throw new Error("Apenas administradores podem criar médicos.");
        }

        const {
            crm,
            nome,
            especialidade,
            telefone_consultorio
        } = dados;

        const result = await pool.query(
            `INSERT INTO medico
            (crm, nome, especialidade, telefone_consultorio)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [crm, nome, especialidade, telefone_consultorio]
        );

        return result.rows[0];
    }
}

module.exports = MedicoService;