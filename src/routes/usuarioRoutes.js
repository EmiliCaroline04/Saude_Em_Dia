const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.post("/", usuarioController.criarUsuario);
router.delete("/:id_usuario", usuarioController.excluirUsuario);
router.delete("/medico/:id_medico", usuarioController.excluirMedico);
router.delete("/paciente/:id_paciente", usuarioController.excluirPaciente);

module.exports = router;