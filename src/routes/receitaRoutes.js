const express = require("express");
const router = express.Router();

const receitaController = require("../controllers/receitaController");

router.post("/", receitaController.criarReceita);

module.exports = router;