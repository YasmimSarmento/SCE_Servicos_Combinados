import type { Request, Response } from "express";
import { pool } from "../../database/pool";
export const createCurriculo = async (req: Request, res: Response) => {
  console.log("Recebido no backend (req.body):", req.body);

  try {
    const {
      nome_completo,
      email,
      telefone,
      cidade,
      estado,
      area_interesse,
      tipo_vaga,
      link_curriculo,
      autorizado,
    } = req.body;

    console.log(" Dados extraídos:", {
      nome_completo,
      email,
      telefone,
      cidade,
      estado,
      area_interesse,
      tipo_vaga,
      link_curriculo,
      autorizado,
    });

    console.log("🛠 Executando SQL INSERT em curriculos...");

    const result = await pool.query(
      `INSERT INTO curriculos (
        nome_completo,
        email,
        telefone,
        cidade,
        estado,
        area_interesse,
        tipo_vaga,
        link_curriculo,
        autorizado
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        nome_completo,
        email,
        telefone,
        cidade,
        estado,
        area_interesse,
        tipo_vaga,
        link_curriculo,
        autorizado,
      ]
    );

    console.log("✅ Currículo criado com sucesso:", result.rows[0]);

    return res.json(result.rows[0]);
  } catch (erro: any) {
    console.error("❌ ERRO AO CRIAR CURRÍCULO (detalhes):", erro);

    return res.status(500).json({
      error: "Erro interno ao criar currículo",
      detalhe: erro instanceof Error ? erro.message : String(erro),
    });
  }
};
