import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { createCurriculo } from "./curriculo.controller";

const router = Router();

router.post("/", createCurriculo); // público

export default router;
