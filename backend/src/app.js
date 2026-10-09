import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database.js";

import clientesRoutes from "./routes/clientes.routes.js";
import serviciosRoutes from "./routes/servicios.routes.js";
import consultasRoutes from "./routes/consultas.routes.js";
import presupuestosRoutes from "./routes/presupuestos.routes.js";
import productosRoutes from "./routes/productos.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clientes", clientesRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/consultas", consultasRoutes);
app.use("/api/presupuestos", presupuestosRoutes);
app.use("/api/productos", productosRoutes);
app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            ok: true,
            mensaje: "Backend conectado a Supabase",
            fecha: result.rows[0].now
        });

    } catch (error) {
        console.error("Error de PostgreSQL:", error);

        res.status(500).json({
            ok: false,
            mensaje: "Error conectando a PostgreSQL",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend ejecutándose en http://localhost:${PORT}`);
});