import express from "express";

import {
    consultarDNIController,
    consultarRUCController
} from "../controllers/consultas.controller.js";

const router = express.Router();

router.get(
    "/dni/:dni",
    consultarDNIController
);

router.get(
    "/ruc/:ruc",
    consultarRUCController
);

export default router;