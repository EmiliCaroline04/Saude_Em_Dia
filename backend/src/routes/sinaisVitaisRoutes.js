const express = require("express");
const sinaisVitaisController = require("../controllers/sinaisVitaisController");

const router = express.Router();

router.post("/", sinaisVitaisController.criarSinalVital);
router.get("/", sinaisVitaisController.listarSinaisVitais);
router.get("/:id_paciente", sinaisVitaisController.listarSinaisVitais);
router.put("/:id_sinal_vital", sinaisVitaisController.editarSinalVital);
router.delete("/:id_sinal_vital", sinaisVitaisController.excluirSinalVital);

module.exports = router;
