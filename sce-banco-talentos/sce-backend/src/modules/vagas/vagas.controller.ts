import { pool } from "../../server";
import { Request, Response } from "express";

export async function criarVaga(req: Request, res: Response) {
  try {
    const { titulo, local, tipo, descricao } = req.body;

    const result = await pool.query(
      `INSERT INTO vagas (titulo, local, tipo, descricao)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, local, tipo, descricao]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("Erro ao criar vaga", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function listarVagas(req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM vagas ORDER BY id DESC");
    return res.json(result.rows);
  } catch (err: any) {
    console.error("Erro ao listar vagas", err);
    return res.status(500).json({ error: err.message });
  }
}
