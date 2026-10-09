import pool from "../config/database.js";

/**
 * Obtener productos
 *
 * GET /api/productos
 * GET /api/productos?buscar=texto
 */
export const obtenerProductos = async (req, res) => {
    try {
        const { buscar = "" } = req.query;

        let query = `
            SELECT
                id,
                codigo,
                descripcion,
                modelo,
                unidad_medida,
                moneda,
                numero_parte,
                marca_codigo,
                linea_codigo,
                categoria_codigo,
                subcategoria_codigo,
                peso,
                precio_sin_igv,
                precio_con_igv,
                activo
            FROM erp.productos
            WHERE activo = TRUE
        `;

        const valores = [];

        if (buscar.trim() !== "") {
            valores.push(`%${buscar.trim()}%`);

            query += `
                AND (
                    codigo ILIKE $1
                    OR descripcion ILIKE $1
                    OR modelo ILIKE $1
                    OR numero_parte ILIKE $1
                )
            `;
        }

        query += `
            ORDER BY codigo ASC
            LIMIT 50
        `;

        const resultado = await pool.query(query, valores);

        res.json({
            ok: true,
            total: resultado.rows.length,
            productos: resultado.rows
        });

    } catch (error) {
        console.error("Error obteniendo productos:", error);

        res.status(500).json({
            ok: false,
            mensaje: "Error obteniendo productos",
            error: error.message
        });
    }
};


/**
 * Obtener un producto por ID
 *
 * GET /api/productos/:id
 */
export const obtenerProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `
            SELECT
                id,
                codigo,
                descripcion,
                modelo,
                unidad_medida,
                moneda,
                numero_parte,
                marca_codigo,
                linea_codigo,
                categoria_codigo,
                subcategoria_codigo,
                peso,
                precio_sin_igv,
                precio_con_igv,
                activo
            FROM erp.productos
            WHERE id = $1
              AND activo = TRUE
            `,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Producto no encontrado"
            });
        }

        res.json({
            ok: true,
            producto: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error obteniendo producto:", error);

        res.status(500).json({
            ok: false,
            mensaje: "Error obteniendo producto",
            error: error.message
        });
    }
};

export const buscarProductos = async (req, res) => {
    try {
        const { buscar = "" } = req.query;
        const texto = buscar.trim();

        if (texto.length < 2) {
            return res.json({
                ok: true,
                productos: [],
            });
        }

        console.log("BUSCANDO PRODUCTOS:", texto);

        const pruebaConexion = await pool.query("SELECT NOW()");

        console.log("CONEXIÓN OK:", pruebaConexion.rows[0]);

        const resultado = await pool.query(
            `
            SELECT
                p.id,
                p.codigo,
                p.descripcion,
                p.modelo,
                p.unidad_medida,
                p.moneda,
                p.precio_sin_igv,
                p.precio_con_igv,

                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'almacen_id', a.id,
                            'codigo', a.codigo,
                            'nombre', a.nombre,
                            'stock_fisico', COALESCE(pa.stock_fisico, 0),
                            'stock_reservado', COALESCE(pa.stock_reservado, 0),
                            'disponible',
                                GREATEST(
                                    COALESCE(pa.stock_fisico, 0) -
                                    COALESCE(pa.stock_reservado, 0),
                                    0
                                )
                        )
                        ORDER BY a.codigo
                    ) FILTER (WHERE a.id IS NOT NULL),
                    '[]'
                ) AS almacenes

            FROM erp.productos p
            CROSS JOIN erp.almacenes a

            LEFT JOIN erp.productos_almacenes pa
                ON pa.producto_id = p.id
                AND pa.almacen_id = a.id

            WHERE
                p.activo = TRUE
                AND a.activo = TRUE
                AND (
                    p.codigo ILIKE $1
                    OR p.descripcion ILIKE $1
                    OR COALESCE(p.modelo, '') ILIKE $1
                )

            GROUP BY
                p.id,
                p.codigo,
                p.descripcion,
                p.modelo,
                p.unidad_medida,
                p.moneda,
                p.precio_sin_igv,
                p.precio_con_igv

            ORDER BY p.codigo
            LIMIT 30
            `,
            [`%${texto}%`]
        );

        console.log("PRODUCTOS ENCONTRADOS:", resultado.rows.length);

        return res.json({
            ok: true,
            productos: resultado.rows,
        });

    } catch (error) {
        console.error("ERROR BUSCANDO PRODUCTOS:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error buscando productos.",
            error: error.message,
        });
    }
};