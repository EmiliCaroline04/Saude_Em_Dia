const MedicamentoService = require("../service/medicamentoService");

exports.criarMedicamento = async (req, res) => {

    const dados = req.body;

    try {
        const medicamento = await MedicamentoService.criarMedicamento(dados);

        res.json(medicamento);

    } catch (error) {

        res.status(500).json({ erro: error.message });

    }
};