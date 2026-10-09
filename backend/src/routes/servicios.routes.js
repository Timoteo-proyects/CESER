import express from "express";

import {
    crearSolicitud,
    obtenerSolicitudes,
    actualizarSolicitud,
    eliminarSolicitud,
    actualizarEstadoSolicitud
} from "../controllers/servicios.controller.js";

const router = express.Router();

router.get("/", obtenerSolicitudes);
router.post("/", crearSolicitud);
router.put("/:id", actualizarSolicitud);
router.delete("/:id", eliminarSolicitud);
router.patch("/:id/estado", actualizarEstadoSolicitud);

export default router;