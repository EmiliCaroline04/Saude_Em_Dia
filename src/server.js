const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const usuarioRoutes = require("./routes/usuarioRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const medicoRoutes = require("./routes/medicoRoutes");
const receitaRoutes = require("./routes/receitaRoutes");
const medicamentoRoutes = require("./routes/medicamentoRoutes");
const authRoutes = require("./routes/authRoutes");  

app.use("/usuarios", usuarioRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/medicos", medicoRoutes);
app.use("/receitas", receitaRoutes);
app.use("/auth", authRoutes); 
app.use("/medicamentos", medicamentoRoutes);


//Inicialização do servidor
app.listen(process.env.PORT, () => {
  console.log("Servidor rodando na porta " + process.env.PORT);
});