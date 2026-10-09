import express from "express";

import {
    obtenerProductos,
    obtenerProducto,
    buscarProductos
} from "../controllers/productos.controller.js";

const router = express.Router();

router.get("/", obtenerProductos);

router.get("/buscar", buscarProductos);

router.get("/:id", obtenerProducto);

export default router;

