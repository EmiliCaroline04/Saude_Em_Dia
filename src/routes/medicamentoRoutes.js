const express = require("express");
const router = express.Router();

const medicamentoController = require("../controllers/medicamentoController");

router.post("/", medicamentoController.criarMedicamento);

module.exports = router;