import express from "express";
import cors from "cors";
import { Pool } from "pg";
import vagasRoutes from "./modules/vagas/vagas.routes";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SCE",
  password: "2025",
  port: 5432,
});

// disponibilizar pool para outros módulos
export { pool };

const app = express();
app.use(express.json());
app.use(cors());

// rotas
app.use("/vagas", vagasRoutes);

app.get("/", (req, res) => {
  res.send("Backend rodando!");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
