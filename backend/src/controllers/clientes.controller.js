import pool from "../config/database.js";

export const obtenerClientes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                c.id,
                c.codigo_legacy,
                c.fecha_creacion,
                c.activo,
                e.razon_social,
                e.nombre_comercial,
                e.tipo_documento,
                e.documento_numero,
                e.telefono,
                e.email,
                e.direccion
            FROM erp.clientes c
            INNER JOIN erp.entidades e
                ON e.id = c.entidad_id
            ORDER BY c.id DESC
        `);

        res.json({
            ok: true,
            total: result.rows.length,
            clientes: result.rows
        });

    } catch (error) {
        console.error("Error obteniendo clientes:", error);

        res.status(500).json({
            ok: false,
            mensaje: "Error al obtener los clientes",
            error: error.message
        });
    }
};