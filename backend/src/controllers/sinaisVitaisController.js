const SinaisVitaisService = require("../service/sinaisVitaisService");

exports.criarSinalVital = async (req, res) => {
  try {
    const sinal = await SinaisVitaisService.criarSinalVital(req.body);
    res.json(sinal);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.listarSinaisVitais = async (req, res) => {
  const { id_paciente } = req.params;

  try {
    const sinais = await SinaisVitaisService.listarSinaisVitais(id_paciente);
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.editarSinalVital = async (req, res) => {
  const { id_sinal_vital } = req.params;

  try {
    const sinal = await SinaisVitaisService.editarSinalVital(id_sinal_vital, req.body);
    res.json(sinal);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.excluirSinalVital = async (req, res) => {
  const { id_sinal_vital } = req.params;

  try {
    const sinal = await SinaisVitaisService.excluirSinalVital(id_sinal_vital);
    res.json({ message: "Sinal vital excluído com sucesso!", sinal });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
