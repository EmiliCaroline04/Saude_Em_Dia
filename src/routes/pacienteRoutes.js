const express = require("express");
const router = express.Router();

const pacienteController = require("../controllers/pacienteController");

router.post("/", pacienteController.criarPaciente);
router.get("/", pacienteController.listarPacientes);

module.exports = router;