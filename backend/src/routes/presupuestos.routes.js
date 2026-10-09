import express from "express";

import {
  crearPresupuesto,
  obtenerPresupuesto,
  obtenerPresupuestos,
  agregarDetalle,
  actualizarDetallesPresupuesto,
  aprobarPresupuesto,
  desaprobarPresupuesto,
} from "../controllers/presupuestos.controller.js";

const router = express.Router();

router.get("/", obtenerPresupuestos);

router.post("/", crearPresupuesto);

router.get("/:id", obtenerPresupuesto);

router.post("/:id/detalles", agregarDetalle);

router.put("/:id/detalles", actualizarDetallesPresupuesto);

router.post("/:id/aprobar", aprobarPresupuesto);

router.post("/:id/desaprobar", desaprobarPresupuesto);


export default router;