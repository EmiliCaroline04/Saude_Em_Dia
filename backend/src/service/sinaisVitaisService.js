const pool = require("../config/db");

class SinaisVitaisService {
  static async criarSinalVital(dados) {
    const {
      id_paciente,
      data_medicao,
      peso,
      pressao_arterial,
      frequencia_cardiaca,
      glicemia_jejum,
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

    const result = await pool.query(
      `INSERT INTO sinais_vitais
      (id_paciente, data_medicao, peso, pressao_arterial, frequencia_cardiaca, glicemia_jejum)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        id_paciente,
        data_medicao || new Date().toISOString().split("T")[0],
        peso ?? null,
        pressao_arterial ?? null,
        frequencia_cardiaca ?? null,
        glicemia_jejum ?? null,
      ]
    );

    return result.rows[0];
  }

  static async listarSinaisVitais(idPaciente) {
    if (idPaciente) {
      const paciente = await pool.query(
        "SELECT * FROM paciente WHERE id_paciente = $1",
        [idPaciente]
      );

      if (paciente.rows.length === 0) {
        throw new Error("Paciente não encontrado.");
      }

      const result = await pool.query(
        `SELECT * FROM sinais_vitais WHERE id_paciente = $1 ORDER BY data_medicao DESC, id_sinal_vital DESC`,
        [idPaciente]
      );

      return result.rows;
    }

    const result = await pool.query(
      `SELECT * FROM sinais_vitais ORDER BY data_medicao DESC, id_sinal_vital DESC`
    );

    return result.rows;
  }

  static async editarSinalVital(idSinalVital, dados) {
    if (!idSinalVital) {
      throw new Error("ID do sinal vital é obrigatório.");
    }

    if (!dados || Object.keys(dados).length === 0) {
      throw new Error("Nenhum dado foi informado para atualização.");
    }

    const existente = await pool.query(
      "SELECT * FROM sinais_vitais WHERE id_sinal_vital = $1",
      [idSinalVital]
    );

    if (existente.rows.length === 0) {
      throw new Error("Sinal vital não encontrado.");
    }

    const camposPermitidos = [
      "id_paciente",
      "data_medicao",
      "peso",
      "pressao_arterial",
      "frequencia_cardiaca",
      "glicemia_jejum",
    ];
    const atualizacoes = [];
    const valores = [idSinalVital];

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
      `UPDATE sinais_vitais SET ${atualizacoes.join(", ")} WHERE id_sinal_vital = $1 RETURNING *`,
      valores
    );

    return result.rows[0];
  }

  static async excluirSinalVital(idSinalVital) {
    if (!idSinalVital) {
      throw new Error("ID do sinal vital é obrigatório.");
    }

    const result = await pool.query(
      `DELETE FROM sinais_vitais WHERE id_sinal_vital = $1 RETURNING *`,
      [idSinalVital]
    );

    if (result.rows.length === 0) {
      throw new Error("Sinal vital não encontrado.");
    }

    return result.rows[0];
  }
}

module.exports = SinaisVitaisService;
