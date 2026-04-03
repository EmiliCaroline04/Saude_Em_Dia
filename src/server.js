const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

// Middleware para CORS e remover CSP restritivo
app.use((req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
