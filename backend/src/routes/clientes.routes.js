import express from "express";
import { obtenerClientes } from "../controllers/clientes.controller.js";

const router = express.Router();

router.get("/", obtenerClientes);

export default router;