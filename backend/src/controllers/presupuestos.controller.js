import pool from "../config/database.js";

// Crear presupuesto
export const crearPresupuesto = async (req, res) => {
  try {
    const { solicitud_id, observaciones } = req.body;

    if (!solicitud_id) {
      return res.status(400).json({
        ok: false,
        mensaje: "solicitud_id es obligatorio",
      });
    }

    const result = await pool.query(
      `
            SELECT *
            FROM erp.crear_presupuesto(
                $1,
                $2
            );
            `,
      [solicitud_id, observaciones || null],
    );

    res.status(201).json({
      ok: true,
      presupuesto: result.rows[0],
    });
  } catch (error) {
    console.error("Error creando presupuesto:", error);

    res.status(400).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

// Obtener presupuesto
// ======================================================
// OBTENER UN PRESUPUESTO
// ======================================================

export const obtenerPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;

    const presupuesto = await pool.query(
      `
      SELECT
        p.id,
        p.solicitud_id,
        p.numero_presupuesto,
        p.fecha_emision,
        p.estado,
        p.subtotal,
        p.descuento,
        p.igv,
        p.total,
        p.fecha_respuesta,
        p.observaciones,
        p.created_at,
        p.updated_at
      FROM erp.presupuestos p
      WHERE p.id = $1
      `,
      [id],
    );

    if (presupuesto.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Presupuesto no encontrado",
      });
    }

    const detalles = await pool.query(
      `
      SELECT
        d.id,
        d.tipo_item,
        d.descripcion,
        d.producto_id,

        p.codigo AS producto_codigo,
        p.modelo AS producto_modelo,
        p.unidad_medida,
        p.moneda,

        d.almacen_id,

        a.codigo AS almacen_codigo,
        a.nombre AS almacen_nombre,

        d.cantidad,
        d.precio_unitario,
        d.descuento,
        d.subtotal,
        d.observaciones

      FROM erp.detalle_presupuestos d

      LEFT JOIN erp.productos p
        ON p.id = d.producto_id

      LEFT JOIN erp.almacenes a
        ON a.id = d.almacen_id

      WHERE d.presupuesto_id = $1

      ORDER BY d.id
      `,
      [id],
    );

    return res.json({
      ok: true,
      presupuesto: presupuesto.rows[0],
      detalles: detalles.rows,
    });
  } catch (error) {
    console.error("Error obteniendo presupuesto:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al obtener el presupuesto",
      error: error.message,
    });
  }
};

// Agregar detalle
// ======================================================
// AGREGAR DETALLE
// ======================================================

export const agregarDetalle = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      tipo_item,
      descripcion,
      producto_id,
      almacen_id,
      cantidad,
      precio_unitario,
      descuento,
      observaciones,
    } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM erp.agregar_detalle_presupuesto(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      );
      `,
      [
        id,
        tipo_item,
        descripcion,
        producto_id || null,
        cantidad ?? 1,
        precio_unitario ?? 0,
        descuento ?? 0,
        observaciones || null,
      ],
    );

    const detalleCreado = result.rows[0];

    // ==================================================
    // GUARDAR ALMACÉN DEL REPUESTO
    // ==================================================

    if (tipo_item === "REPUESTO" && producto_id && almacen_id) {
      await pool.query(
        `
        UPDATE erp.detalle_presupuestos
        SET almacen_id = $1
        WHERE id = $2
        `,
        [almacen_id, detalleCreado.id],
      );
    }

    // Obtener nuevamente el detalle completo
    const detalleCompleto = await pool.query(
      `
      SELECT
        d.id,
        d.tipo_item,
        d.descripcion,
        d.producto_id,

        p.codigo AS producto_codigo,
        p.modelo AS producto_modelo,
        p.unidad_medida,
        p.moneda,

        d.almacen_id,

        a.codigo AS almacen_codigo,
        a.nombre AS almacen_nombre,

        d.cantidad,
        d.precio_unitario,
        d.descuento,
        d.subtotal,
        d.observaciones

      FROM erp.detalle_presupuestos d

      LEFT JOIN erp.productos p
        ON p.id = d.producto_id

      LEFT JOIN erp.almacenes a
        ON a.id = d.almacen_id

      WHERE d.id = $1
      `,
      [detalleCreado.id],
    );

    return res.status(201).json({
      ok: true,
      detalle: detalleCompleto.rows[0],
    });
  } catch (error) {
    console.error("Error agregando detalle:", error);

    return res.status(400).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

// Aprobar presupuesto
// ======================================================
// APROBAR PRESUPUESTO
// ======================================================

export const aprobarPresupuesto = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { observaciones } = req.body;

    await client.query("BEGIN");

    /* ============================================
       1. OBTENER PRESUPUESTO
    ============================================ */

    const presupuestoResult = await client.query(
      `
      SELECT
        id,
        solicitud_id,
        numero_presupuesto,
        estado
      FROM erp.presupuestos
      WHERE id = $1
      FOR UPDATE;
      `,
      [id],
    );

    if (presupuestoResult.rows.length === 0) {
      throw new Error("Presupuesto no encontrado.");
    }

    const presupuesto = presupuestoResult.rows[0];

    /* ============================================
       2. VALIDAR ESTADO DEL PRESUPUESTO
    ============================================ */

    if (presupuesto.estado !== "PENDIENTE") {
      throw new Error(
        `El presupuesto ${presupuesto.numero_presupuesto} no está pendiente.`,
      );
    }

    /* ============================================
       3. OBTENER SOLICITUD
    ============================================ */

    const solicitudResult = await client.query(
      `
      SELECT
        id,
        estado
      FROM erp.solicitudes_servicio
      WHERE id = $1
        AND activo = TRUE
      FOR UPDATE;
      `,
      [presupuesto.solicitud_id],
    );

    if (solicitudResult.rows.length === 0) {
      throw new Error("La solicitud de servicio no existe o está inactiva.");
    }

    const solicitud = solicitudResult.rows[0];

    /* ============================================
       4. VALIDAR ESTADO DE LA SOLICITUD
    ============================================ */

    if (
      solicitud.estado !== "PRESUPUESTO" &&
      solicitud.estado !== "NUEVO_PRESUPUESTO"
    ) {
      throw new Error(
        `La solicitud está en estado ${solicitud.estado} y no puede aprobarse desde Presupuestos.`,
      );
    }

    /* ============================================
       5. ACTUALIZAR PRESUPUESTO
    ============================================ */

    const presupuestoActualizado = await client.query(
      `
      UPDATE erp.presupuestos
      SET
        estado = 'APROBADO',
        fecha_respuesta = CURRENT_TIMESTAMP,
        observaciones = COALESCE($1, observaciones),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        solicitud_id,
        numero_presupuesto,
        estado,
        subtotal,
        descuento,
        igv,
        total,
        fecha_respuesta,
        observaciones,
        created_at,
        updated_at;
      `,
      [observaciones || null, id],
    );

    /* ============================================
       6. ACTUALIZAR SOLICITUD
    ============================================ */

    await client.query(
      `
      UPDATE erp.solicitudes_servicio
      SET
        estado = 'PRESUPUESTO_APROBADO',
        presupuesto_aprobado = TRUE,
        fecha_aprobacion_presupuesto = CURRENT_TIMESTAMP,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $1
        AND activo = TRUE;
      `,
      [presupuesto.solicitud_id],
    );

    /* ============================================
       7. GUARDAR HISTORIAL
    ============================================ */

    await client.query(
      `
      INSERT INTO erp.historial_estados_servicio (
        solicitud_id,
        estado_anterior,
        estado_nuevo,
        observaciones
      )
      VALUES (
        $1,
        $2,
        'PRESUPUESTO_APROBADO',
        $3
      );
      `,
      [
        presupuesto.solicitud_id,
        solicitud.estado,
        observaciones || null,
      ],
    );

    /* ============================================
       8. COMMIT
    ============================================ */

    await client.query("COMMIT");

    return res.json({
      ok: true,
      mensaje: "Presupuesto aprobado correctamente.",
      presupuesto: presupuestoActualizado.rows[0],
      estado_solicitud: "PRESUPUESTO_APROBADO",
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error aprobando presupuesto:", error);

    return res.status(400).json({
      ok: false,
      mensaje: error.message,
    });

  } finally {
    client.release();
  }
};
// ======================================================
// DESAPROBAR PRESUPUESTO
// ======================================================

export const desaprobarPresupuesto = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { observaciones } = req.body;

    await client.query("BEGIN");

    /* ============================================
       1. OBTENER PRESUPUESTO
    ============================================ */

    const presupuestoResult = await client.query(
      `
      SELECT
        id,
        solicitud_id,
        numero_presupuesto,
        estado
      FROM erp.presupuestos
      WHERE id = $1
      FOR UPDATE;
      `,
      [id],
    );

    if (presupuestoResult.rows.length === 0) {
      throw new Error("Presupuesto no encontrado.");
    }

    const presupuesto = presupuestoResult.rows[0];

    /* ============================================
       2. VALIDAR ESTADO
    ============================================ */

    if (presupuesto.estado !== "PENDIENTE") {
      throw new Error(
        `El presupuesto ${presupuesto.numero_presupuesto} no está pendiente.`,
      );
    }

    /* ============================================
       3. OBTENER SOLICITUD
    ============================================ */

    const solicitudResult = await client.query(
      `
      SELECT
        id,
        estado
      FROM erp.solicitudes_servicio
      WHERE id = $1
        AND activo = TRUE
      FOR UPDATE;
      `,
      [presupuesto.solicitud_id],
    );

    if (solicitudResult.rows.length === 0) {
      throw new Error("La solicitud de servicio no existe o está inactiva.");
    }

    const solicitud = solicitudResult.rows[0];

    /* ============================================
       4. VALIDAR ESTADO
    ============================================ */

    if (
      solicitud.estado !== "PRESUPUESTO" &&
      solicitud.estado !== "NUEVO_PRESUPUESTO"
    ) {
      throw new Error(
        `La solicitud está en estado ${solicitud.estado} y no puede desaprobarse desde Presupuestos.`,
      );
    }

    /* ============================================
       5. ACTUALIZAR PRESUPUESTO
    ============================================ */

    const presupuestoActualizado = await client.query(
      `
      UPDATE erp.presupuestos
      SET
        estado = 'RECHAZADO',
        fecha_respuesta = CURRENT_TIMESTAMP,
        observaciones = COALESCE($1, observaciones),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        solicitud_id,
        numero_presupuesto,
        estado,
        subtotal,
        descuento,
        igv,
        total,
        fecha_respuesta,
        observaciones,
        created_at,
        updated_at;
      `,
      [observaciones || null, id],
    );

    /* ============================================
       6. ACTUALIZAR SOLICITUD
    ============================================ */

    await client.query(
      `
      UPDATE erp.solicitudes_servicio
      SET
        estado = 'PRESUPUESTO_DESAPROBADO',
        presupuesto_aprobado = FALSE,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $1
        AND activo = TRUE;
      `,
      [presupuesto.solicitud_id],
    );

    /* ============================================
       7. HISTORIAL
    ============================================ */

    await client.query(
      `
      INSERT INTO erp.historial_estados_servicio (
        solicitud_id,
        estado_anterior,
        estado_nuevo,
        observaciones
      )
      VALUES (
        $1,
        $2,
        'PRESUPUESTO_DESAPROBADO',
        $3
      );
      `,
      [
        presupuesto.solicitud_id,
        solicitud.estado,
        observaciones || null,
      ],
    );

    /* ============================================
       8. COMMIT
    ============================================ */

    await client.query("COMMIT");

    return res.json({
      ok: true,
      mensaje: "Presupuesto rechazado correctamente.",
      presupuesto: presupuestoActualizado.rows[0],
      estado_solicitud: "PRESUPUESTO_DESAPROBADO",
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error desaprobando presupuesto:", error);

    return res.status(400).json({
      ok: false,
      mensaje: error.message,
    });

  } finally {
    client.release();
  }
};
// Obtener todos los presupuestos
export const obtenerPresupuestos = async (req, res) => {
  const inicio = performance.now();

  try {
    const inicioQuery = performance.now();

    const result = await pool.query(
      `
      SELECT
          p.id,
          p.solicitud_id,
          p.numero_presupuesto,
          p.fecha_emision,
          p.estado,
          p.subtotal,
          p.descuento,
          p.igv,
          p.total,
          p.fecha_respuesta,
          p.observaciones,
          p.created_at,
          p.updated_at,

          s.numero_solicitud,
          s.fecha_solicitud,
          s.fecha_ingreso,
          s.estado AS estado_solicitud,
          s.prioridad,
          s.problema_reportado,
          s.diagnostico,
          s.tipo_servicio,

          e.tipo_documento,
          e.numero_documento,
          e.razon_social,
          e.nombre_comercial,
          e.nombres,
          e.apellido_paterno,
          e.apellido_materno,
          e.telefono,
          e.email,
          e.direccion,
          e.distrito,
          e.provincia,
          e.departamento,

          eq.tipo_equipo,
          eq.marca,
          eq.modelo,
          eq.numero_serie,
          eq.numero_parte,
          eq.color,
          eq.tiene_garantia,
          eq.fecha_garantia,
          eq.accesorios,

          COALESCE(
                    (
                        SELECT JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', d.id,
                                'tipo_item', d.tipo_item,
                                'descripcion', d.descripcion,
                                'producto_id', d.producto_id,

                                'producto_codigo', pr.codigo,
                                'producto_modelo', pr.modelo,
                                'unidad_medida', pr.unidad_medida,
                                'moneda', pr.moneda,

                                'almacen_id', d.almacen_id,
                                'almacen_codigo', a.codigo,
                                'almacen_nombre', a.nombre,

                                'cantidad', d.cantidad,
                                'precio_unitario', d.precio_unitario,
                                'descuento', d.descuento,
                                'subtotal', d.subtotal,
                                'observaciones', d.observaciones
                            )
                            ORDER BY d.id
                        )
                        FROM erp.detalle_presupuestos d

                        LEFT JOIN erp.productos pr
                            ON pr.id = d.producto_id

                        LEFT JOIN erp.almacenes a
                            ON a.id = d.almacen_id

                        WHERE d.presupuesto_id = p.id
                    ),
                    '[]'::json
                ) AS detalles
      FROM erp.presupuestos p

      INNER JOIN erp.solicitudes_servicio s
          ON s.id = p.solicitud_id

      INNER JOIN erp.clientes c
          ON c.id = s.cliente_id

      INNER JOIN erp.entidades e
          ON e.id = c.entidad_id

      INNER JOIN erp.equipos eq
          ON eq.id = s.equipo_id

      ORDER BY p.id DESC
      `,
    );

    const finQuery = performance.now();

    console.log("SQL:", `${(finQuery - inicioQuery).toFixed(2)} ms`);

    res.json({
      ok: true,
      presupuestos: result.rows,
    });

    const fin = performance.now();

    console.log("TOTAL:", `${(fin - inicio).toFixed(2)} ms`);
  } catch (error) {
    console.error("Error obteniendo presupuestos:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener los presupuestos",
      error: error.message,
    });
  }
};
// Actualizar detalles de un presupuesto
export const actualizarDetallesPresupuesto = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { detalles } = req.body;

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El presupuesto debe tener al menos un detalle.",
      });
    }

    await client.query("BEGIN");

    // Verificar que exista el presupuesto
    const presupuestoResult = await client.query(
      `
      SELECT id, estado
      FROM erp.presupuestos
      WHERE id = $1
      `,
      [id],
    );

    if (presupuestoResult.rows.length === 0) {
      throw new Error("Presupuesto no encontrado.");
    }

    if (presupuestoResult.rows[0].estado !== "PENDIENTE") {
      throw new Error(
        "Solo se pueden editar presupuestos que estén en estado PENDIENTE.",
      );
    }

    // Eliminar los detalles anteriores
    await client.query(
      `
      DELETE FROM erp.detalle_presupuestos
      WHERE presupuesto_id = $1
      `,
      [id],
    );

    // Insertar nuevamente los detalles actuales
    for (const detalle of detalles) {
      const tipoItem = detalle.tipo_item;
      const descripcion = (detalle.descripcion || "").trim();
      const productoId = detalle.producto_id || null;
      const almacenId = detalle.almacen_id || null;
      const cantidad = Number(detalle.cantidad) || 1;
      const precioUnitario = Number(detalle.precio_unitario) || 0;
      const descuento = Number(detalle.descuento) || 0;

      if (!descripcion) {
        throw new Error("Todos los conceptos deben tener descripción.");
      }

      if (cantidad <= 0) {
        throw new Error(
          `La cantidad del concepto "${descripcion}" debe ser mayor que 0.`,
        );
      }

      if (precioUnitario < 0) {
        throw new Error(
          `El precio del concepto "${descripcion}" no puede ser negativo.`,
        );
      }

      if (descuento < 0) {
        throw new Error(
          `El descuento del concepto "${descripcion}" no puede ser negativo.`,
        );
      }

      if (tipoItem === "REPUESTO") {
        if (!productoId) {
          throw new Error(
            `El repuesto "${descripcion}" no tiene producto asociado.`,
          );
        }

        const productoResult = await client.query(
          `
          SELECT id
          FROM erp.productos
          WHERE id = $1
            AND activo = TRUE
          `,
          [productoId],
        );

        if (productoResult.rows.length === 0) {
          throw new Error(
            `El producto asociado al repuesto "${descripcion}" no existe o está inactivo.`,
          );
        }
      }

      const subtotal = cantidad * precioUnitario;

      // El descuento que recibe el backend es MONETARIO
      const subtotalConDescuento = subtotal - descuento;

      if (subtotalConDescuento < 0) {
        throw new Error(
          `El descuento del concepto "${descripcion}" no puede superar su subtotal.`,
        );
      }

      await client.query(
        `
        INSERT INTO erp.detalle_presupuestos (
          presupuesto_id,
          tipo_item,
          descripcion,
          producto_id,
          almacen_id,
          cantidad,
          precio_unitario,
          descuento,
          subtotal,
          observaciones
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10
        )
        `,
        [
          id,
          tipoItem,
          descripcion,
          productoId,
          almacenId,
          cantidad,
          precioUnitario,
          descuento,
          subtotalConDescuento,
          detalle.observaciones || null,
        ],
      );
    }

    // Recalcular totales del presupuesto
    const totalesResult = await client.query(
      `
      SELECT
        COALESCE(SUM(cantidad * precio_unitario), 0) AS subtotal,
        COALESCE(SUM(descuento), 0) AS descuento
      FROM erp.detalle_presupuestos
      WHERE presupuesto_id = $1
      `,
      [id],
    );

    const subtotal = Number(totalesResult.rows[0].subtotal) || 0;
    const descuento = Number(totalesResult.rows[0].descuento) || 0;
    const baseImponible = subtotal - descuento;
    const igv = baseImponible * 0.18;
    const total = baseImponible + igv;

    // Actualizar cabecera
    await client.query(
      `
      UPDATE erp.presupuestos
      SET
        subtotal = $1,
        descuento = $2,
        igv = $3,
        total = $4,
        observaciones = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      `,
      [
        subtotal,
        descuento,
        igv,
        total,
        req.body.observaciones || null,
        id,
      ],
    );

    await client.query("COMMIT");

    // Devolver presupuesto actualizado
    const presupuestoActualizado = await client.query(
      `
      SELECT
        p.id,
        p.solicitud_id,
        p.numero_presupuesto,
        p.fecha_emision,
        p.estado,
        p.subtotal,
        p.descuento,
        p.igv,
        p.total,
        p.observaciones,
        p.created_at,
        p.updated_at
      FROM erp.presupuestos p
      WHERE p.id = $1
      `,
      [id],
    );

    return res.json({
      ok: true,
      mensaje: "Presupuesto actualizado correctamente.",
      presupuesto: presupuestoActualizado.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error actualizando presupuesto:", error);

    return res.status(400).json({
      ok: false,
      mensaje: error.message,
    });
  } finally {
    client.release();
  }
};