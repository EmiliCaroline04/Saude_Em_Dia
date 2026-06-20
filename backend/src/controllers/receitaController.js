const ReceitaService = require("../service/receitaService");

exports.criarReceita = async (req, res) => {

    const dados = req.body;
    const id_perfil = req.headers["id-perfil"];

    try {
        const receita = await ReceitaService.criarReceita(dados, id_perfil);
        res.json({ message: "Receita criada com sucesso!", receita: receita });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }

};