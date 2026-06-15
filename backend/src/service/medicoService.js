const pool = require("../config/db");
const UsuarioService = require("./usuarioService");

class MedicoService {
    static async criarMedico(dados, idPerfil) {
        const {
            crm,
            nome,
            especialidade,
            telefone_consultorio,
            telefone,
            email,
            senha,
            senha_hash,
        } = dados;

        if (!crm || !nome || !especialidade) {
            throw new Error("CRM, nome e especialidade são obrigatórios.");
        }

        const telefoneParaSalvar = telefone_consultorio || telefone;
        const senhaInformada = senha_hash || senha;

        let usuarioCriado = null;
        if (email && senhaInformada) {
            usuarioCriado = await UsuarioService.criarUsuario({
                email,
                senha_hash: senhaInformada,
                id_perfil: 2,
            });
        }

        if (!usuarioCriado) {
            throw new Error("É necessário informar email e senha para criar o cadastro de médico.");
        }

        const result = await pool.query(
            `INSERT INTO medico
            (id_usuario, crm, nome, especialidade, telefone_consultorio)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [usuarioCriado.id_usuario, crm, nome, especialidade, telefoneParaSalvar]
        );

        return {
            medico: result.rows[0],
            usuario: usuarioCriado,
        };
    }
}

module.exports = MedicoService;