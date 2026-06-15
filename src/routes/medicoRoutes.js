const express = require("express");
const router = express.Router();

const medicoController = require("../controllers/medicoController");

router.post("/", medicoController.criarMedico);

module.exports = router;