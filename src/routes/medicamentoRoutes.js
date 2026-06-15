const express = require("express");
const router = express.Router();

const medicamentoController = require("../controllers/medicamentoController");

router.post("/", medicamentoController.criarMedicamento);
router.get("/paciente/:id", medicamentoController.buscarMedicamentosPorPaciente);
router.delete("/:id_medicamento", medicamentoController.excluirMedicamento);

module.exports = router;