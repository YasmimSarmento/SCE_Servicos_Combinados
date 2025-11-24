const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

// Configuração do banco
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SCE",
  password: "2025",
  port: 5432,
});

// App
const app = express();
app.use(express.json());
app.use(cors());

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend em JavaScript funcionando!");
});

// Enviar currículo
app.post("/curriculos", async (req, res) => {
  console.log("=== REQUISIÇÃO RECEBIDA ===");
  console.log("Body recebido:", req.body);

  const {
    nome,
    email,
    telefone,
    cidade,
    estado,
    area_interesse,
    tipo_vaga,
    link_cv,
  } = req.body;

  // Validação
  if (
    !nome ||
    !email ||
    !telefone ||
    !cidade ||
    !estado ||
    !area_interesse ||
    !link_cv
  ) {
    console.log("Validação falhou - campos faltantes");
    return res.status(400).json({
      error: "Todos os campos obrigatórios devem ser preenchidos",
    });
  }

  try {
    console.log("Tentando inserir no banco...");

    // Use os nomes corretos das colunas da sua tabela
    const result = await pool.query(
      `INSERT INTO curriculos 
       (nome_completo, email, telefone, cidade, estado, area_interesse, tipo_vaga, link_curriculo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        nome,
        email,
        telefone,
        cidade,
        estado,
        area_interesse,
        tipo_vaga,
        link_cv,
      ]
    );

    console.log("Inserção bem-sucedida:", result.rows[0]);

    res.status(201).json({
      message: "Currículo enviado com sucesso!",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Erro no banco de dados:", err);
    res.status(500).json({
      error: "Erro ao salvar currículo no banco de dados",
      details: err.message,
    });
  }
});

// Start servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
