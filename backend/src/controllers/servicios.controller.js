import pool from "../config/database.js";

export const crearSolicitud = async (req, res) => {
  try {
    const {
      tipo_documento,
      numero_documento,

      nombres,
      apellido_paterno,
      apellido_materno,
      razon_social,

      telefono,
      email,
      direccion,

      tipo_equipo,
      marca,
      modelo,
      numero_serie,
      numero_parte,
      color,
      accesorios,

      tipo_servicio,
      prioridad,

      problema_reportado,
      observaciones,

      garantia,
      tiene_garantia,
      fecha_garantia,
    } = req.body;

    /* ============================================
           VALIDACIONES BÁSICAS
        ============================================ */

    if (!tipo_documento) {
      return res.status(400).json({
        ok: false,
        mensaje: "El tipo de documento es obligatorio.",
      });
    }

    if (!numero_documento) {
      return res.status(400).json({
        ok: false,
        mensaje: "El número de documento es obligatorio.",
      });
    }

    if (!tipo_equipo) {
      return res.status(400).json({
        ok: false,
        mensaje: "El tipo de equipo es obligatorio.",
      });
    }

    if (!problema_reportado?.trim()) {
      return res.status(400).json({
        ok: false,
        mensaje: "El problema reportado es obligatorio.",
      });
    }

    /* ============================================
           1. OBTENER / CREAR CLIENTE
        ============================================ */

    const clienteResult = await pool.query(
      `
            SELECT erp.obtener_o_crear_cliente(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
            ) AS cliente_id;
            `,
      [
        tipo_documento,
        numero_documento,
        nombres || null,
        apellido_paterno || null,
        apellido_materno || null,
        razon_social || null,
        telefono || null,
        email || null,
        direccion || null,
      ],
    );

    const clienteId = clienteResult.rows[0].cliente_id;

    /* ============================================
           2. OBTENER / CREAR EQUIPO
        ============================================ */

    const equipoResult = await pool.query(
      `
            SELECT erp.obtener_o_crear_equipo(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11
            ) AS equipo_id;
            `,
      [
        clienteId,
        tipo_equipo,
        marca || null,
        modelo || null,
        numero_serie || null,
        numero_parte || null,
        color || null,
        accesorios || null,
        tiene_garantia ?? garantia ?? false,
        fecha_garantia || null,
        observaciones || null,
      ],
    );

    const equipoId = equipoResult.rows[0].equipo_id;

    /* ============================================
           3. CREAR SOLICITUD
        ============================================ */

    const solicitudResult = await pool.query(
      `
            SELECT *
            FROM erp.crear_solicitud(
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
        clienteId,
        equipoId,
        null,

        tipo_servicio || "NORMAL",

        prioridad || "NORMAL",

        problema_reportado.trim(),

        observaciones || null,

        garantia ?? false,
      ],
    );

    /* ============================================
           4. RESPUESTA
        ============================================ */

    res.status(201).json({
      ok: true,

      cliente_id: clienteId,

      equipo_id: equipoId,

      solicitud: solicitudResult.rows[0],
    });
  } catch (error) {
    console.error("Error creando solicitud:", error);

    res.status(400).json({
      ok: false,
      mensaje: error.message,
    });
  }
};
const TRANSICIONES_ESTADO = {
  DIAGNOSTICO: ["PRESUPUESTO"],

  PRESUPUESTO: ["PRESUPUESTO_APROBADO", "PRESUPUESTO_DESAPROBADO"],

  PRESUPUESTO_APROBADO: ["PENDIENTE_REPARACION", "ESPERANDO_REPUESTOS"],

  PRESUPUESTO_DESAPROBADO: ["ALMACEN_NO_REPARADOS"],

  ESPERANDO_REPUESTOS: ["REPUESTOS_RECIBIDOS"],

  REPUESTOS_RECIBIDOS: ["PENDIENTE_REPARACION"],

  PENDIENTE_REPARACION: ["MESA_REPARACIONES"],

  MESA_REPARACIONES: [
    "CONTROL_CALIDAD",
    "SE_NECESITAN_MAS_REPUESTOS",
    "REPARACION_SUSPENDIDA",
  ],

  SE_NECESITAN_MAS_REPUESTOS: ["ACTUALIZANDO_PRESUPUESTO"],

  ACTUALIZANDO_PRESUPUESTO: ["NUEVO_PRESUPUESTO"],

  NUEVO_PRESUPUESTO: ["PRESUPUESTO_APROBADO", "PRESUPUESTO_DESAPROBADO"],

  REPARACION_SUSPENDIDA: ["PENDIENTE_REPARACION"],

  CONTROL_CALIDAD: ["ALMACEN_REPARADOS"],

  ALMACEN_REPARADOS: ["POR_FACTURAR"],

  ALMACEN_NO_REPARADOS: ["ENTREGADO"],

  POR_FACTURAR: ["FACTURADO"],

  FACTURADO: ["ENTREGADO"],

  ENTREGADO: ["CERRADA"],

  CERRADA: [],
};
export const obtenerSolicitudes = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT
                s.id,
                s.numero_solicitud,
                s.fecha_solicitud,

                s.cliente_id,
                s.equipo_id,
                s.tecnico_id,

                s.tipo_servicio,
                s.estado,
                s.prioridad,

                s.problema_reportado,
                s.diagnostico,
                s.observaciones,

                s.presupuesto_aprobado,
                s.fecha_aprobacion_presupuesto,

                s.requiere_repuesto,
                s.repuestos_disponibles,
                s.garantia,

                s.fecha_ingreso,
                s.fecha_actualizacion,

                /* ============================================
                   ESTADOS DISPONIBLES
                ============================================ */

                CASE s.estado

                WHEN 'DIAGNOSTICO'
                THEN ARRAY[
                    'PRESUPUESTO'
                ]

                WHEN 'PRESUPUESTO'
                THEN ARRAY[
                    'PRESUPUESTO_APROBADO',
                    'PRESUPUESTO_DESAPROBADO'
                ]

                WHEN 'PRESUPUESTO_APROBADO'
                THEN ARRAY[
                    'PENDIENTE_REPARACION',
                    'ESPERANDO_REPUESTOS'
                ]

                WHEN 'PRESUPUESTO_DESAPROBADO'
                THEN ARRAY[
                    'ALMACEN_NO_REPARADOS'
                ]

                WHEN 'ESPERANDO_REPUESTOS'
                THEN ARRAY[
                    'REPUESTOS_RECIBIDOS'
                ]

                WHEN 'REPUESTOS_RECIBIDOS'
                THEN ARRAY[
                    'PENDIENTE_REPARACION'
                ]

                WHEN 'PENDIENTE_REPARACION'
                THEN ARRAY[
                    'MESA_REPARACIONES'
                ]

                WHEN 'MESA_REPARACIONES'
                THEN ARRAY[
                    'CONTROL_CALIDAD',
                    'SE_NECESITAN_MAS_REPUESTOS',
                    'REPARACION_SUSPENDIDA'
                ]

                WHEN 'SE_NECESITAN_MAS_REPUESTOS'
                THEN ARRAY[
                    'ACTUALIZANDO_PRESUPUESTO'
                ]

                WHEN 'ACTUALIZANDO_PRESUPUESTO'
                THEN ARRAY[
                    'NUEVO_PRESUPUESTO'
                ]

                WHEN 'NUEVO_PRESUPUESTO'
                THEN ARRAY[
                    'PRESUPUESTO_APROBADO',
                    'PRESUPUESTO_DESAPROBADO'
                ]

                WHEN 'REPARACION_SUSPENDIDA'
                THEN ARRAY[
                    'PENDIENTE_REPARACION'
                ]

                WHEN 'CONTROL_CALIDAD'
                THEN ARRAY[
                    'ALMACEN_REPARADOS'
                ]

                WHEN 'ALMACEN_REPARADOS'
                THEN ARRAY[
                    'POR_FACTURAR'
                ]

                WHEN 'ALMACEN_NO_REPARADOS'
                THEN ARRAY[
                    'ENTREGADO'
                ]

                WHEN 'POR_FACTURAR'
                THEN ARRAY[
                    'FACTURADO'
                ]

                WHEN 'FACTURADO'
                THEN ARRAY[
                    'ENTREGADO'
                ]

                WHEN 'ENTREGADO'
                THEN ARRAY[
                    'CERRADA'
                ]

                WHEN 'CERRADA'
                THEN ARRAY[]::VARCHAR[]

                ELSE ARRAY[]::VARCHAR[]

            END AS estados_disponibles,


                /* ============================================
                   HISTORIAL DE ESTADOS
                ============================================ */

                COALESCE(
                    historial.historial_estados,
                    '[]'::json
                ) AS historial_estados,


                /* ============================================
                   CLIENTE
                ============================================ */

                e.tipo_entidad,
                e.tipo_documento,
                e.numero_documento,

                e.razon_social,
                e.nombre_comercial,

                e.nombres,
                e.apellido_paterno,
                e.apellido_materno,

                e.telefono,
                e.telefono_secundario,
                e.email,

                e.direccion,
                e.distrito,
                e.provincia,
                e.departamento,

                c.codigo_cliente,

                COALESCE(
                    e.razon_social,
                    NULLIF(
                        CONCAT_WS(
                            ' ',
                            e.nombres,
                            e.apellido_paterno,
                            e.apellido_materno
                        ),
                        ''
                    ),
                    'Sin nombre'
                ) AS cliente,


                /* ============================================
                   EQUIPO
                ============================================ */

                eq.tipo_equipo,
                eq.marca,
                eq.modelo,
                eq.numero_serie,
                eq.numero_parte,
                eq.color,

                eq.fecha_ingreso AS equipo_fecha_ingreso,
                eq.fecha_garantia,
                eq.tiene_garantia,

                eq.accesorios AS accesorios_equipo,
                eq.estado_equipo,


                /* ============================================
                   TÉCNICO
                ============================================ */

                t.codigo_tecnico,
                t.especialidad,
                t.taller,
                t.sub_taller,

                CONCAT_WS(
                    ' ',
                    te.nombres,
                    te.apellido_paterno,
                    te.apellido_materno
                ) AS tecnico


            FROM erp.solicitudes_servicio s


            /* ============================================
               CLIENTE
            ============================================ */

            INNER JOIN erp.clientes c
                ON c.id = s.cliente_id

            INNER JOIN erp.entidades e
                ON e.id = c.entidad_id


            /* ============================================
               EQUIPO
            ============================================ */

            LEFT JOIN erp.equipos eq
                ON eq.id = s.equipo_id


            /* ============================================
               TÉCNICO
            ============================================ */

            LEFT JOIN erp.tecnicos t
                ON t.id = s.tecnico_id

            LEFT JOIN erp.empleados te
                ON te.id = t.empleado_id


            /* ============================================
               HISTORIAL
            ============================================ */

            LEFT JOIN LATERAL (

                SELECT
                    json_agg(
                        json_build_object(

                            'id',
                            h.id,

                            'estado_anterior',
                            h.estado_anterior,

                            'estado_nuevo',
                            h.estado_nuevo,

                            'fecha_cambio',
                            h.fecha_cambio,

                            'usuario_id',
                            h.usuario_id,

                            'observaciones',
                            h.observaciones

                        )
                        ORDER BY h.fecha_cambio ASC
                    ) AS historial_estados

                FROM erp.historial_estados_servicio h

                WHERE h.solicitud_id = s.id

            ) historial
                ON TRUE


            /* ============================================
               SOLAMENTE ACTIVAS
            ============================================ */

            WHERE s.activo = TRUE

            ORDER BY s.id DESC
        `);

    res.json({
      ok: true,
      total: result.rows.length,
      solicitudes: result.rows,
    });
  } catch (error) {
    console.error("Error obteniendo solicitudes:", error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener las solicitudes",
      error: error.message,
    });
  }
};

/* ============================================
   EDITAR SOLICITUD
============================================ */
export const actualizarSolicitud = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      tipo_documento,
      numero_documento,

      nombres,
      apellido_paterno,
      apellido_materno,
      razon_social,

      telefono,
      email,
      direccion,

      tipo_equipo,
      marca,
      modelo,
      numero_serie,
      numero_parte,
      color,
      accesorios,

      tipo_servicio,
      prioridad,

      problema_reportado,
      observaciones,

      garantia,
      tiene_garantia,
      fecha_garantia,
    } = req.body;

    /* ============================================
           VALIDACIONES
        ============================================ */

    if (!tipo_documento) {
      return res.status(400).json({
        ok: false,
        mensaje: "El tipo de documento es obligatorio.",
      });
    }

    if (!numero_documento) {
      return res.status(400).json({
        ok: false,
        mensaje: "El número de documento es obligatorio.",
      });
    }

    if (!tipo_equipo) {
      return res.status(400).json({
        ok: false,
        mensaje: "El tipo de equipo es obligatorio.",
      });
    }

    if (!problema_reportado?.trim()) {
      return res.status(400).json({
        ok: false,
        mensaje: "El problema reportado es obligatorio.",
      });
    }

    /* ============================================
           INICIAR TRANSACCIÓN
        ============================================ */

    await client.query("BEGIN");

    /* ============================================
           1. OBTENER CLIENTE Y EQUIPO ACTUALES
        ============================================ */

    const actualResult = await client.query(
      `
            SELECT
                cliente_id,
                equipo_id
            FROM erp.solicitudes_servicio
            WHERE id = $1
              AND activo = TRUE
            FOR UPDATE;
            `,
      [id],
    );

    if (actualResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        ok: false,
        mensaje: "La solicitud no existe o ya fue eliminada.",
      });
    }

    const clienteId = actualResult.rows[0].cliente_id;

    const equipoId = actualResult.rows[0].equipo_id;

    /* ============================================
           2. ACTUALIZAR DATOS DEL CLIENTE
        ============================================ */

    await client.query(
      `
            UPDATE erp.entidades e
            SET
                tipo_documento = $1,
                numero_documento = $2,
                nombres = $3,
                apellido_paterno = $4,
                apellido_materno = $5,
                razon_social = $6,
                telefono = $7,
                email = $8,
                direccion = $9,
                updated_at = CURRENT_TIMESTAMP
            FROM erp.clientes c
            WHERE c.id = $10
              AND e.id = c.entidad_id;
            `,
      [
        tipo_documento,
        numero_documento,
        nombres || null,
        apellido_paterno || null,
        apellido_materno || null,
        razon_social || null,
        telefono || null,
        email || null,
        direccion || null,
        clienteId,
      ],
    );

    /* ============================================
           3. ACTUALIZAR EQUIPO EXISTENTE
        ============================================ */

    await client.query(
      `
            UPDATE erp.equipos
            SET
                tipo_equipo = $1,
                marca = $2,
                modelo = $3,
                numero_serie = $4,
                numero_parte = $5,
                color = $6,
                accesorios = $7,
                tiene_garantia = $8,
                fecha_garantia = $9,
                observaciones = $10,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $11;
            `,
      [
        tipo_equipo,
        marca || null,
        modelo || null,
        numero_serie || null,
        numero_parte || null,
        color || null,
        accesorios || null,
        tiene_garantia ?? garantia ?? false,
        fecha_garantia || null,
        observaciones || null,
        equipoId,
      ],
    );

    /* ============================================
           4. ACTUALIZAR SOLICITUD
        ============================================ */

    const solicitudResult = await client.query(
      `
            UPDATE erp.solicitudes_servicio
            SET
                tipo_servicio = $1,
                prioridad = $2,
                problema_reportado = $3,
                observaciones = $4,
                garantia = $5,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = $6
              AND activo = TRUE
            RETURNING *;
            `,
      [
        tipo_servicio || "NORMAL",
        prioridad || "NORMAL",
        problema_reportado.trim(),
        observaciones || null,
        garantia ?? false,
        id,
      ],
    );

    await client.query("COMMIT");

    /* ============================================
           RESPUESTA
        ============================================ */

    res.json({
      ok: true,
      mensaje: "Solicitud actualizada correctamente.",
      solicitud: solicitudResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error actualizando solicitud:", error);

    res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  } finally {
    client.release();
  }
};
export const eliminarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
            UPDATE erp.solicitudes_servicio
            SET
                activo = FALSE,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = $1
              AND activo = TRUE
            RETURNING id, numero_solicitud;
            `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "La solicitud no existe o ya fue eliminada.",
      });
    }

    res.json({
      ok: true,
      mensaje: "Solicitud eliminada correctamente.",
      solicitud: result.rows[0],
    });
  } catch (error) {
    console.error("Error eliminando solicitud:", error);

    res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

export const actualizarEstadoSolicitud = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { estado, observacion } = req.body;

    /* ============================================
       VALIDAR ESTADO
    ============================================ */

    if (!estado) {
      return res.status(400).json({
        ok: false,
        mensaje: "El estado es obligatorio.",
      });
    }

    await client.query("BEGIN");

    /* ============================================
       OBTENER ESTADO ACTUAL
    ============================================ */

    const actualResult = await client.query(
      `
      SELECT
        id,
        estado
      FROM erp.solicitudes_servicio
      WHERE id = $1
        AND activo = TRUE
      FOR UPDATE;
      `,
      [id],
    );

    if (actualResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        ok: false,
        mensaje: "La solicitud no existe o ya fue eliminada.",
      });
    }

    const estadoActual = actualResult.rows[0].estado;

    /* ============================================
       VALIDAR TRANSICIÓN
    ============================================ */

    const estadosSiguientes = TRANSICIONES_ESTADO[estadoActual] || [];

    if (!estadosSiguientes.includes(estado)) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        ok: false,
        mensaje: `No se puede pasar de ${estadoActual} a ${estado}.`,
        estado_actual: estadoActual,
        estados_disponibles: estadosSiguientes,
      });
    }

    /* ============================================
       ACTUALIZAR SOLICITUD
    ============================================ */

    const solicitudResult = await client.query(
      `
      UPDATE erp.solicitudes_servicio
      SET
        estado = $1,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $2
        AND activo = TRUE
      RETURNING *;
      `,
      [estado, id],
    );

    /* ============================================
       GUARDAR HISTORIAL
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
        $3,
        $4
      );
      `,
      [id, estadoActual, estado, observacion || null],
    );

    /* ============================================
       SINCRONIZAR PRESUPUESTO
    ============================================ */

    let presupuestoActualizado = null;

    if (
      estado === "PRESUPUESTO_APROBADO" ||
      estado === "PRESUPUESTO_DESAPROBADO"
    ) {
      let estadoPresupuesto = null;

      if (estado === "PRESUPUESTO_APROBADO") {
        estadoPresupuesto = "APROBADO";
      }

      if (estado === "PRESUPUESTO_DESAPROBADO") {
        estadoPresupuesto = "RECHAZADO";
      }

      const presupuestoResult = await client.query(
        `
        UPDATE erp.presupuestos
        SET
          estado = $1,
          fecha_respuesta = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP,
          observaciones = COALESCE($2, observaciones)
        WHERE solicitud_id = $3
          AND estado = 'PENDIENTE'
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
          observaciones;
        `,
        [
          estadoPresupuesto,
          observacion || null,
          id,
        ],
      );

      if (presupuestoResult.rows.length > 0) {
        presupuestoActualizado = presupuestoResult.rows[0];
      }
    }

    /* ============================================
       COMMIT
    ============================================ */

    await client.query("COMMIT");

    /* ============================================
       RESPUESTA
    ============================================ */

    return res.json({
      ok: true,

      mensaje: "Estado actualizado correctamente.",

      estado_anterior: estadoActual,

      estado_nuevo: estado,

      estados_disponibles:
        TRANSICIONES_ESTADO[estado] || [],

      solicitud: solicitudResult.rows[0],

      presupuesto: presupuestoActualizado,
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error actualizando estado:", error);

    return res.status(500).json({
      ok: false,
      mensaje: error.message,
    });

  } finally {
    client.release();
  }
};