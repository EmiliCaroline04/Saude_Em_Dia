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

exports.buscarMedicamentosPorPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const medicamentos = await MedicamentoService.buscarMedicamentosPorPaciente(id);

        res.json(medicamentos);

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.excluirMedicamento = async (req, res) => {
    const { id_medicamento } = req.params;

    try {
        const medicamento = await MedicamentoService.excluirMedicamento(id_medicamento);

        res.json({ message: "Medicamento excluído com sucesso!", medicamento });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};