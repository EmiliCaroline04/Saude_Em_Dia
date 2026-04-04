const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.post("/", usuarioController.criarUsuario);
router.delete("/:id_usuario", usuarioController.excluirUsuario);

module.exports = router;