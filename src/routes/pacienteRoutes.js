const express = require("express");
const router = express.Router();

const pacienteController = require("../controllers/pacienteController");

router.post("/", pacienteController.criarPaciente);
router.get("/", pacienteController.listarPacientes);
router.post("/:id_paciente/agendar", pacienteController.agendarConsulta);
router.put("/:id_paciente/cancelar/:id_agendamento", pacienteController.cancelarConsulta);

module.exports = router;