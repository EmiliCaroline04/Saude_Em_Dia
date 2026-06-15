const express = require("express");
const router = express.Router();

const authController = require("../controllers/authControllers");
router.post("/", authController.logarUsuario); 

router.get("/", (req, res) => {
  res.send("AUTH OK");
});

module.exports = router;