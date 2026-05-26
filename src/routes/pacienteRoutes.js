const express = require("express");
const router = express.Router();

const pacienteController = require("../controllers/pacienteController");

router.post("/", pacienteController.criarPaciente);
router.get("/", pacienteController.listarPacientes);
router.post("/:id_paciente/agendar", pacienteController.agendarConsulta);
router.put("/:id_paciente/cancelar/:id_agendamento", pacienteController.cancelarConsulta);
router.get("/proximas-consultas", pacienteController.listarProximasConsultas);
router.get("/:id_paciente/proximas-consultas", pacienteController.listarProximasConsultas);

module.exports = router;