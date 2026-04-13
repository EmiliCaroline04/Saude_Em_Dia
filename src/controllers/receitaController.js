const ReceitaService = require("../service/receitaService");

exports.criarReceita = async (req, res) => {

    const dados = req.body;

    try {
        const receita = await ReceitaService.criarReceita(dados);
        res.json({ message: "Receita criada com sucesso!", receita: receita });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }

};