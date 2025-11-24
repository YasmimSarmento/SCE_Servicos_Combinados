import { Router } from "express";
import { criarVaga, listarVagas } from "./vagas.controller";

const router = Router();

router.post("/", criarVaga);
router.get("/", listarVagas);

export default router;
