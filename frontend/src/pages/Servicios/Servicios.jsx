import { useEffect, useState } from "react";
import "./Servicios.css";

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ESTADOS = [
  "Diagnóstico",
  "Presupuesto",
  "Presupuesto aprobado",
  "Presupuesto desaprobado",
  "Esperando repuestos",
  "Repuestos recibidos",
  "Pendiente de reparación",
  "Mesa de reparación",
  "Se necesitan más repuestos",
  "Actualizando presupuesto",
  "Nuevo presupuesto",
  "Reparación suspendida",
  "Control de calidad",
  "Almacén de reparados",
  "Almacén de no reparados",
  "Por facturar",
  "Facturado",
  "Entregado",
  "Cerrada",
];

const TIPOS_ATENCION = ["Servicio particular", "Garantía"];

const TIPOS_SERVICIO = [
  "Diagnóstico",
  "Mantenimiento preventivo",
  "Mantenimiento correctivo",
  "Reparación",
  "Instalación",
  "Configuración",
  "Soporte técnico",
];

const PRIORIDADES = ["Baja", "Normal", "Alta", "Urgente"];

const TECNICOS = [
  "Sin asignar",
  "Carlos Mendoza",
  "Luis Torres",
  "Miguel Rojas",
  "José Ramírez",
];

const MEDIOS_CONTACTO = [
  "Teléfono",
  "WhatsApp",
  "Correo electrónico",
  "No especificado",
];

const RESULTADOS_GARANTIA = ["Pendiente", "Procede", "No procede"];

const OPCIONES_SI_NO_PENDIENTE = ["Pendiente", "Sí", "No"];

const ESTADO_UI_A_DB = {
  Diagnóstico: "DIAGNOSTICO",
  Presupuesto: "PRESUPUESTO",
  "Presupuesto aprobado": "PRESUPUESTO_APROBADO",
  "Presupuesto desaprobado": "PRESUPUESTO_DESAPROBADO",
  "Esperando repuestos": "ESPERANDO_REPUESTOS",
  "Repuestos recibidos": "REPUESTOS_RECIBIDOS",
  "Pendiente de reparación": "PENDIENTE_REPARACION",
  "Mesa de reparación": "MESA_REPARACIONES",
  "Se necesitan más repuestos": "SE_NECESITAN_MAS_REPUESTOS",
  "Actualizando presupuesto": "ACTUALIZANDO_PRESUPUESTO",
  "Nuevo presupuesto": "NUEVO_PRESUPUESTO",
  "Reparación suspendida": "REPARACION_SUSPENDIDA",
  "Control de calidad": "CONTROL_CALIDAD",
  "Almacén de reparados": "ALMACEN_REPARADOS",
  "Almacén de no reparados": "ALMACEN_NO_REPARADOS",
  "Por facturar": "POR_FACTURAR",
  Facturado: "FACTURADO",
  Entregado: "ENTREGADO",
  Cerrada: "CERRADA",
};

const ESTADO_DB_A_UI = Object.fromEntries(
  Object.entries(ESTADO_UI_A_DB).map(([ui, db]) => [db, ui]),
);
const PRIORIDAD_UI_A_DB = {
  Baja: "BAJA",
  Normal: "NORMAL",
  Alta: "ALTA",
  Urgente: "URGENTE",
};

const PRIORIDAD_DB_A_UI = Object.fromEntries(
  Object.entries(PRIORIDAD_UI_A_DB).map(([ui, db]) => [db, ui]),
);
/* =========================================================
   FORMULARIO INICIAL
========================================================= */

const FORMULARIO_INICIAL = {
  codigoSolicitud: "",
  fechaIngreso: "",
  horaIngreso: "",

  numeroDocumento: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  razonSocial: "",
  direccion: "",
  telefono: "",
  email: "",

  equipo: "",
  marca: "",
  modelo: "",
  numeroSerie: "",

  tipoAtencion: "Servicio particular",
  tipoServicio: "Reparación",

  prioridad: "Normal",
  tecnicoAsignado: "Sin asignar",
  fechaEntregaEstimada: "",

  requierePresupuesto: true,

  evaluacionGarantia: {
    comprobante: "",
    fechaCompra: "",
    fechaVencimiento: "",
    serieCoincide: "Pendiente",
    danoFisico: "Pendiente",
    manipulacion: "Pendiente",
    fallaCubierta: "Pendiente",
    resultado: "Pendiente",
    continuarComoParticular: "Pendiente",
    observaciones: "",
  },

  condicionRecepcion: "",
  accesoriosRecibidos: "",
  observacionesRecepcion: "",

  claveEquipo: "",
  estadoEncendido: "",
  estadoPantalla: "",
  estadoBateria: "",

  contactoPreferido: "Teléfono",

  estado: "Diagnóstico",
  problemaReportado: "",
  observaciones: "",
};

/* =========================================================
   COMPONENTE
========================================================= */

function Servicios() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [tipoDocumento, setTipoDocumento] = useState("");

  //const [solicitudes, setSolicitudes] =
  //useState(SOLICITUDES_DEMO);

  const [solicitudes, setSolicitudes] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);

  const [modoEdicion, setModoEdicion] = useState(false);

  const [idEditando, setIdEditando] = useState(null);

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");

  const [filtroTecnico, setFiltroTecnico] = useState("Todos");

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const [estadoSeleccionadoDetalle, setEstadoSeleccionadoDetalle] =
    useState("");

 const [mensaje, setMensaje] = useState("");
const [consultandoDocumento, setConsultandoDocumento] = useState(false);


/* =====================================================
   CAMBIAR CAMPOS DEL FORMULARIO
===================================================== */

const cambiarCampo = (e) => {
  const { name, value } = e.target;

  setFormulario((prev) => ({
    ...prev,
    [name]: value,
  }));
};
 /* =====================================================
   DOCUMENTOS
===================================================== */

/* =====================================================
   DOCUMENTOS
===================================================== */

function obtenerLongitudDocumento() {
  if (tipoDocumento === "DNI") {
    return 8;
  }

  if (tipoDocumento === "RUC") {
    return 11;
  }

  if (tipoDocumento === "CE") {
    return 11;
  }

  return 0;
}

const cambiarTipoDocumento = (e) => {
  const tipo = e.target.value;

  setTipoDocumento(tipo);

  setFormulario((prev) => ({
    ...prev,
    numeroDocumento: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    razonSocial: "",
    direccion: "",
    telefono: "",
    email: "",
  }));

  setMensaje("");
};

const manejarDocumento = (e) => {
  const valor = e.target.value.replace(/\D/g, "");

  const longitud = obtenerLongitudDocumento();

  if (longitud && valor.length > longitud) {
    return;
  }

  setFormulario((prev) => ({
    ...prev,
    numeroDocumento: valor,
  }));

  setMensaje("");
};

const consultarDocumento = async () => {
  if (consultandoDocumento) {
    return;
  }

  if (!tipoDocumento) {
    setMensaje("Selecciona primero el tipo de documento.");
    return;
  }

  const numeroDocumento = formulario.numeroDocumento;
  const longitud = obtenerLongitudDocumento();

  if (numeroDocumento.length !== longitud) {
    setMensaje(`El ${tipoDocumento} debe tener ${longitud} dígitos.`);
    return;
  }

  setMensaje("");

  if (tipoDocumento === "CE") {
    setMensaje(
      "Documento válido. Completa manualmente los datos del cliente.",
    );

    return;
  }

  try {
    setConsultandoDocumento(true);

    let url = "";

    if (tipoDocumento === "DNI") {
      url = `http://localhost:3000/api/consultas/dni/${numeroDocumento}`;
    }

    if (tipoDocumento === "RUC") {
      url = `http://localhost:3000/api/consultas/ruc/${numeroDocumento}`;
    }

    const response = await fetch(url);

    const data = await response.json();

    console.log(`RESPUESTA CONSULTA ${tipoDocumento}:`, data);

    if (!response.ok || !data.ok) {
      setMensaje(
        data.mensaje ||
          `No se encontraron datos para este ${tipoDocumento}.`,
      );

      return;
    }

    if (tipoDocumento === "DNI") {
      const cliente = data.cliente;

      if (!cliente) {
        setMensaje(
          "La consulta fue exitosa, pero no se recibieron datos del DNI.",
        );

        return;
      }

      setFormulario((prev) => ({
        ...prev,
        nombres:
          cliente.nombres ||
          cliente.nombre ||
          "",
        apellidoPaterno:
          cliente.apellido_paterno ||
          cliente.apellidoPaterno ||
          "",
        apellidoMaterno:
          cliente.apellido_materno ||
          cliente.apellidoMaterno ||
          "",
        razonSocial: "",
      }));

      setMensaje("Datos del DNI encontrados correctamente.");

      return;
    }

    if (tipoDocumento === "RUC") {
      const empresa = data.empresa || data.cliente;

      if (!empresa) {
        setMensaje(
          "La consulta fue exitosa, pero no se recibieron datos del RUC.",
        );

        return;
      }

      setFormulario((prev) => ({
        ...prev,
        razonSocial:
          empresa.razon_social ||
          empresa.razonSocial ||
          empresa.nombre_o_razon_social ||
          empresa.nombre ||
          "",
        direccion:
          empresa.direccion ||
          empresa.domicilio_fiscal ||
          "",
        telefono:
          empresa.telefono ||
          "",
        email:
          empresa.email ||
          "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
      }));

      setMensaje("Datos del RUC encontrados correctamente.");
    }
  } catch (error) {
    console.error(
      `ERROR CONSULTANDO ${tipoDocumento}:`,
      error,
    );

    setMensaje(
      `No se pudo consultar el ${tipoDocumento}. Verifica la conexión con el servidor.`,
    );
  } finally {
    setConsultandoDocumento(false);
  }
};

/* =================================================
   CONSULTA AUTOMÁTICA
================================================= */
  const mapearSolicitudBackend = (s) => {
    const fecha = s.fecha_solicitud ? new Date(s.fecha_solicitud) : null;
    console.log("FECHA ORIGINAL:", s.fecha_solicitud);
    console.log("FECHA JS:", fecha);
    console.log(
      "HORA PERÚ:",
      fecha?.toLocaleString("es-PE", {
        timeZone: "America/Lima",
      }),
    );
    console.log(
      s.numero_solicitud,
      "→",
      s.fecha_solicitud,
      "→",
      fecha?.toLocaleString("es-PE", {
        timeZone: "America/Lima",
      }),
    );

    const nombreCliente =
      s.cliente ||
      [s.nombres, s.apellido_paterno, s.apellido_materno]
        .filter(Boolean)
        .join(" ");

    return {
      id: Number(s.id),

      codigoSolicitud: s.numero_solicitud,

      fechaIngreso: fecha
        ? fecha.toLocaleDateString("es-PE", {
            timeZone: "America/Lima",
          })
        : "",

      horaIngreso: fecha
        ? fecha.toLocaleTimeString("es-PE", {
            timeZone: "America/Lima",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",

      // CLIENTE
      tipoDocumento: s.tipo_documento || "",
      numeroDocumento: s.numero_documento || "",

      nombres: s.nombres || "",
      apellidoPaterno: s.apellido_paterno || "",
      apellidoMaterno: s.apellido_materno || "",

      razonSocial: s.razon_social || "",

      direccion: s.direccion || "",
      telefono: s.telefono || "",
      email: s.email || "",

      cliente: nombreCliente,

      // EQUIPO
      equipo: s.tipo_equipo || "",
      marca: s.marca || "",
      modelo: s.modelo || "",
      numeroSerie: s.numero_serie || "",

      // CLASIFICACIÓN
      tipoAtencion:
        s.tipo_servicio === "GARANTIA" ? "Garantía" : "Servicio particular",

      tipoServicio: "Reparación",

      prioridad: PRIORIDAD_DB_A_UI[s.prioridad] || s.prioridad || "Normal",

      tecnicoAsignado: s.tecnico || "Sin asignar",

      fechaEntregaEstimada: "",

      requierePresupuesto: s.requiere_presupuesto ?? false,

      // GARANTÍA
      evaluacionGarantia: {
        ...FORMULARIO_INICIAL.evaluacionGarantia,
      },

      // RECEPCIÓN
      condicionRecepcion: "",
      accesoriosRecibidos: s.accesorios_equipo || "",
      observacionesRecepcion: "",

      // CHECKLIST
      claveEquipo: "",
      estadoEncendido: "",
      estadoPantalla: "",
      estadoBateria: "",

      contactoPreferido: "Teléfono",

      // ESTADO
      // ESTADO
      estado: ESTADO_DB_A_UI[s.estado] || s.estado,

      // FLUJO DEL SERVICIO
      estadosDisponiblesDB: s.estados_disponibles || [],

      estadosDisponibles: (s.estados_disponibles || []).map(
        (estado) => ESTADO_DB_A_UI[estado] || estado,
      ),

      historialEstados: (s.historial_estados || []).map((historial) => ({
        id: historial.id,
        estadoAnterior:
          ESTADO_DB_A_UI[historial.estado_anterior] ||
          historial.estado_anterior ||
          null,
        estadoNuevo:
          ESTADO_DB_A_UI[historial.estado_nuevo] || historial.estado_nuevo,
        fechaCambio: historial.fecha_cambio,
        usuarioId: historial.usuario_id,
        observaciones: historial.observaciones || "",
      })),

      problemaReportado: s.problema_reportado || "",

      observaciones: s.observaciones || "",

      // Datos originales del backend
      clienteId: Number(s.cliente_id),
      equipoId: s.equipo_id ? Number(s.equipo_id) : null,
      tecnicoId: s.tecnico_id ? Number(s.tecnico_id) : null,

      diagnostico: s.diagnostico || "",
      garantia: s.garantia ?? false,
      presupuestoAprobado: s.presupuesto_aprobado ?? null,
      requiereRepuesto: s.requiere_repuesto ?? false,
      repuestosDisponibles: s.repuestos_disponibles ?? null,

      formulario: {
        ...FORMULARIO_INICIAL,
        codigoSolicitud: s.numero_solicitud,
        fechaIngreso: fecha ? fecha.toLocaleDateString("es-PE") : "",
        horaIngreso: fecha
          ? fecha.toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",

        tipoDocumento: s.tipo_documento || "",
        numeroDocumento: s.numero_documento || "",

        nombres: s.nombres || "",
        apellidoPaterno: s.apellido_paterno || "",
        apellidoMaterno: s.apellido_materno || "",
        razonSocial: s.razon_social || "",

        direccion: s.direccion || "",
        telefono: s.telefono || "",
        email: s.email || "",

        equipo: s.tipo_equipo || "",
        marca: s.marca || "",
        modelo: s.modelo || "",
        numeroSerie: s.numero_serie || "",

        tipoAtencion:
          s.tipo_servicio === "GARANTIA" ? "Garantía" : "Servicio particular",

        prioridad: PRIORIDAD_DB_A_UI[s.prioridad] || "Normal",

        tecnicoAsignado: s.tecnico || "Sin asignar",

        estado: ESTADO_DB_A_UI[s.estado] || s.estado,

        problemaReportado: s.problema_reportado || "",

        observaciones: s.observaciones || "",
      },
    };
  };
  const cargarSolicitudes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/servicios");

      if (!response.ok) {
        throw new Error("No se pudieron obtener las solicitudes");
      }

      const data = await response.json();

      console.log("RESPUESTA BACKEND:", data);

      if (!data.ok) {
        throw new Error(data.mensaje || "Error obteniendo solicitudes");
      }

      const solicitudesMapeadas = data.solicitudes.map(mapearSolicitudBackend);

      setSolicitudes(solicitudesMapeadas);

      return solicitudesMapeadas;
    } catch (error) {
      console.error("ERROR CARGANDO SOLICITUDES:", error);
      setMensaje(error.message || "Error al cargar las solicitudes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);
  /* =====================================================
       TIPO DE ATENCIÓN
    ===================================================== */

  const cambiarTipoAtencion = (tipo) => {
    setFormulario((prev) => {
      if (tipo === "Garantía") {
        return {
          ...prev,
          tipoAtencion: "Garantía",
          requierePresupuesto: false,
          estado: "Diagnóstico",

          evaluacionGarantia: {
            ...prev.evaluacionGarantia,
            resultado: prev.evaluacionGarantia?.resultado || "Pendiente",
            continuarComoParticular:
              prev.evaluacionGarantia?.continuarComoParticular || "Pendiente",
          },
        };
      }

      return {
        ...prev,
        tipoAtencion: "Servicio particular",
      };
    });

    setMensaje("");
  };

  /* =====================================================
       REQUIERE PRESUPUESTO
    ===================================================== */

  const cambiarRequierePresupuesto = (valor) => {
    setFormulario((prev) => ({
      ...prev,
      requierePresupuesto: valor === "Sí",
    }));
  };

  /* =====================================================
       EVALUACIÓN DE GARANTÍA
    ===================================================== */

  const cambiarCampoGarantia = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => {
      const nuevaEvaluacion = {
        ...prev.evaluacionGarantia,
        [name]: value,
      };

      if (name === "resultado" && value === "Procede") {
        return {
          ...prev,
          requierePresupuesto: false,
          evaluacionGarantia: nuevaEvaluacion,
        };
      }

      return {
        ...prev,
        evaluacionGarantia: nuevaEvaluacion,
      };
    });
  };

  /* =====================================================
       CAMBIAR RESULTADO GARANTÍA
    ===================================================== */

  const cambiarResultadoGarantia = (resultado) => {
    setFormulario((prev) => {
      if (resultado === "Procede") {
        return {
          ...prev,
          requierePresupuesto: false,

          evaluacionGarantia: {
            ...prev.evaluacionGarantia,
            resultado: "Procede",
            continuarComoParticular: "Pendiente",
          },
        };
      }

      if (resultado === "No procede") {
        return {
          ...prev,

          evaluacionGarantia: {
            ...prev.evaluacionGarantia,
            resultado: "No procede",
          },
        };
      }

      return {
        ...prev,

        evaluacionGarantia: {
          ...prev.evaluacionGarantia,
          resultado: "Pendiente",
          continuarComoParticular: "Pendiente",
        },
      };
    });
  };

  /* =====================================================
       CONTINUAR COMO PARTICULAR
    ===================================================== */

  const cambiarContinuarComoParticular = (valor) => {
    setFormulario((prev) => {
      if (valor === "No") {
        return {
          ...prev,
          requierePresupuesto: false,

          evaluacionGarantia: {
            ...prev.evaluacionGarantia,
            continuarComoParticular: "No",
          },
        };
      }

      return {
        ...prev,

        evaluacionGarantia: {
          ...prev.evaluacionGarantia,
          continuarComoParticular: valor,
        },
      };
    });
  };

  /* =====================================================
       GENERAR CÓDIGO
    ===================================================== */

  const generarCodigoSolicitud = () => {
    if (solicitudes.length === 0) {
      return "ST-000001";
    }

    const numeros = solicitudes.map((s) => {
      const numero = parseInt(s.codigoSolicitud.replace("ST-", ""), 10);

      return isNaN(numero) ? 0 : numero;
    });

    const mayor = Math.max(...numeros);

    return `ST-${String(mayor + 1).padStart(6, "0")}`;
  };

  /* =====================================================
       NUEVA SOLICITUD
    ===================================================== */

  const nuevaSolicitud = () => {
    setModoEdicion(false);

    setIdEditando(null);

    setTipoDocumento("");

    setFormulario({
      ...FORMULARIO_INICIAL,

      evaluacionGarantia: {
        ...FORMULARIO_INICIAL.evaluacionGarantia,
      },

      codigoSolicitud: generarCodigoSolicitud(),
    });

    setMensaje("");

    setMostrarFormulario(true);
  };

  /* =====================================================
       EDITAR
    ===================================================== */

  const editarSolicitud = (solicitud) => {
    setModoEdicion(true);

    setIdEditando(solicitud.id);

    setTipoDocumento(solicitud.tipoDocumento || "");

    setFormulario({
      ...FORMULARIO_INICIAL,

      ...solicitud.formulario,

      codigoSolicitud: solicitud.codigoSolicitud,

      fechaIngreso: solicitud.fechaIngreso,

      horaIngreso: solicitud.horaIngreso,

      numeroDocumento: solicitud.numeroDocumento,

      equipo: solicitud.equipo,

      marca: solicitud.marca,

      modelo: solicitud.modelo,

      tipoAtencion: solicitud.tipoAtencion || "Servicio particular",

      tipoServicio: solicitud.tipoServicio,

      prioridad: solicitud.prioridad,

      tecnicoAsignado: solicitud.tecnicoAsignado,

      fechaEntregaEstimada: solicitud.fechaEntregaEstimada,

      requierePresupuesto: solicitud.requierePresupuesto,

      evaluacionGarantia: {
        ...FORMULARIO_INICIAL.evaluacionGarantia,

        ...(solicitud.evaluacionGarantia || {}),
      },

      estado: solicitud.estado,

      problemaReportado: solicitud.problemaReportado,

      observaciones: solicitud.observaciones,

      numeroSerie: solicitud.numeroSerie,

      condicionRecepcion: solicitud.condicionRecepcion,

      accesoriosRecibidos: solicitud.accesoriosRecibidos,

      observacionesRecepcion: solicitud.observacionesRecepcion,

      claveEquipo: solicitud.claveEquipo,

      estadoEncendido: solicitud.estadoEncendido,

      estadoPantalla: solicitud.estadoPantalla,

      estadoBateria: solicitud.estadoBateria,

      contactoPreferido: solicitud.contactoPreferido,
    });

    setMensaje("");

    setMostrarFormulario(true);
  };

  /* =====================================================
       ELIMINAR
    ===================================================== */
  const eliminarSolicitud = async (id) => {
    const confirmar = window.confirm(
      "¿Deseas eliminar esta solicitud de servicio?",
    );

    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/servicios/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      console.log("RESPUESTA ELIMINAR SOLICITUD:", data);

      if (!response.ok || !data.ok) {
        throw new Error(data.mensaje || "No se pudo eliminar la solicitud.");
      }

      setMensaje("Solicitud eliminada correctamente.");

      if (solicitudSeleccionada && solicitudSeleccionada.id === id) {
        setSolicitudSeleccionada(null);
        setMostrarDetalle(false);
      }

      await cargarSolicitudes();
    } catch (error) {
      console.error("ERROR ELIMINANDO SOLICITUD:", error);

      setMensaje(error.message || "Error al eliminar la solicitud.");
    }
  };

  /* =====================================================
       VALIDACIONES
    ===================================================== */

  const guardarSolicitud = async () => {
    if (!tipoDocumento) {
      setMensaje("Selecciona el tipo de documento.");

      return;
    }

    const longitud = obtenerLongitudDocumento();

    if (formulario.numeroDocumento.length !== longitud) {
      setMensaje(`El ${tipoDocumento} debe tener ${longitud} dígitos.`);

      return;
    }

    if (!formulario.telefono.trim()) {
      setMensaje("Ingresa el teléfono del cliente.");

      return;
    }

    if (!formulario.equipo.trim()) {
      setMensaje("Ingresa el equipo.");

      return;
    }

    if (!formulario.problemaReportado.trim()) {
      setMensaje("Describe el problema reportado.");

      return;
    }

    /* ================================================
           VALIDACIÓN DE GARANTÍA
        ================================================ */

    if (formulario.tipoAtencion === "Garantía") {
      const evaluacion = formulario.evaluacionGarantia;

      if (evaluacion.resultado === "Pendiente") {
        if (formulario.estado !== "Diagnóstico") {
          setMensaje(
            "Una garantía pendiente debe permanecer en Diagnóstico hasta completar su evaluación.",
          );

          return;
        }
      }

      if (evaluacion.resultado === "Procede") {
        if (formulario.requierePresupuesto) {
          setMensaje("Una garantía aprobada no requiere presupuesto.");

          return;
        }
      }

      if (evaluacion.resultado === "No procede") {
        if (evaluacion.continuarComoParticular === "Pendiente") {
          setMensaje(
            "Indica si el cliente continuará como servicio particular.",
          );

          return;
        }

        if (evaluacion.continuarComoParticular === "No") {
          setMensaje(
            "La solicitud queda sin continuidad como servicio particular.",
          );

          return;
        }
      }
    }

    /* ================================================
           EDITAR
        ================================================ */
    if (modoEdicion) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/servicios/${idEditando}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tipo_documento: tipoDocumento,
              numero_documento: formulario.numeroDocumento,

              nombres: formulario.nombres,

              apellido_paterno: formulario.apellidoPaterno,

              apellido_materno: formulario.apellidoMaterno,

              razon_social: formulario.razonSocial,

              telefono: formulario.telefono,

              email: formulario.email,

              direccion: formulario.direccion,

              tipo_equipo: formulario.equipo,

              marca: formulario.marca,

              modelo: formulario.modelo,

              numero_serie: formulario.numeroSerie,
              accesorios: formulario.accesoriosRecibidos || null,

              tiene_garantia: formulario.tipoAtencion === "Garantía",

              fecha_garantia:
                formulario.evaluacionGarantia?.fechaVencimiento || null,
              tipo_servicio:
                formulario.tipoAtencion === "Garantía" ? "GARANTIA" : "NORMAL",

              prioridad: PRIORIDAD_UI_A_DB[formulario.prioridad] || "NORMAL",

              problema_reportado: formulario.problemaReportado,

              observaciones: formulario.observaciones,

              garantia: formulario.tipoAtencion === "Garantía",
            }),
          },
        );

        const data = await response.json();

        console.log("RESPUESTA ACTUALIZAR SOLICITUD:", data);

        if (!response.ok || !data.ok) {
          throw new Error(
            data.mensaje || "No se pudo actualizar la solicitud.",
          );
        }

        setMensaje("Solicitud actualizada correctamente.");

        setMostrarFormulario(false);

        setModoEdicion(false);

        setIdEditando(null);

        /* ============================================
           VOLVER A CARGAR DESDE EL BACKEND
        ============================================ */

        await cargarSolicitudes();
      } catch (error) {
        console.error("ERROR ACTUALIZANDO SOLICITUD:", error);

        setMensaje(error.message || "Error al actualizar la solicitud.");
      }

      return;
    }

    /* ================================================
           NUEVA SOLICITUD
        ================================================ */

    try {
      const response = await fetch("http://localhost:3000/api/servicios", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          tipo_documento: tipoDocumento,

          numero_documento: formulario.numeroDocumento,

          nombres: formulario.nombres,

          apellido_paterno: formulario.apellidoPaterno,

          apellido_materno: formulario.apellidoMaterno,

          razon_social: formulario.razonSocial,

          telefono: formulario.telefono,

          email: formulario.email,

          direccion: formulario.direccion,

          tipo_equipo: formulario.equipo,

          marca: formulario.marca,

          modelo: formulario.modelo,

          numero_serie: formulario.numeroSerie,

          tipo_servicio:
            formulario.tipoAtencion === "Garantía" ? "GARANTIA" : "NORMAL",

          prioridad: PRIORIDAD_UI_A_DB[formulario.prioridad] || "NORMAL",

          estado: ESTADO_UI_A_DB[formulario.estado] || "DIAGNOSTICO",

          problema_reportado: formulario.problemaReportado,

          observaciones: formulario.observaciones,

          garantia: formulario.tipoAtencion === "Garantía",
        }),
      });

      const data = await response.json();

      console.log("RESPUESTA CREAR SOLICITUD:", data);

      if (!response.ok || !data.ok) {
        throw new Error(data.mensaje || "No se pudo crear la solicitud.");
      }

      setMensaje("Solicitud creada correctamente.");

      setMostrarFormulario(false);

      /*
       Volvemos a consultar el backend.
       Así obtenemos el ID y código reales
       generados por Supabase.
    */

      await cargarSolicitudes();
    } catch (error) {
      console.error("ERROR CREANDO SOLICITUD:", error);

      setMensaje(error.message || "Error al crear la solicitud.");
    }
  };

  /* =====================================================
       CERRAR FORMULARIO
    ===================================================== */

  const cerrarFormulario = () => {
    setMostrarFormulario(false);

    setModoEdicion(false);

    setIdEditando(null);

    setMensaje("");
  };

  /* =====================================================
       DETALLE
    ===================================================== */

  const abrirDetalle = (solicitud) => {
    setSolicitudSeleccionada(solicitud);

    setEstadoSeleccionadoDetalle("");

    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);

    setSolicitudSeleccionada(null);

    setEstadoSeleccionadoDetalle("");
  };

  /* =====================================================
       CAMBIAR ESTADO DESDE DETALLE
    ===================================================== */
  const cambiarEstadoDesdeDetalle = async (nuevoEstado) => {
    if (!solicitudSeleccionada) {
      return;
    }

    if (!nuevoEstado) {
      return;
    }

    //const estadoActual = solicitudSeleccionada.estado;

    const estadosPermitidos = solicitudSeleccionada.estadosDisponibles || [];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      return;
    }

    try {
      const estadoDB = ESTADO_UI_A_DB[nuevoEstado] || nuevoEstado;

      const response = await fetch(
        `http://localhost:3000/api/servicios/${solicitudSeleccionada.id}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: estadoDB,
            observacion: null,
          }),
        },
      );

      const data = await response.json();

      console.log("RESPUESTA ACTUALIZAR ESTADO:", data);

      if (!response.ok || !data.ok) {
        throw new Error(data.mensaje || "No se pudo actualizar el estado.");
      }

      const solicitudesActualizadas = await cargarSolicitudes();

      const solicitudNueva = solicitudesActualizadas.find(
        (s) => s.id === solicitudSeleccionada.id,
      );

      if (solicitudNueva) {
        setSolicitudSeleccionada(solicitudNueva);

        setEstadoSeleccionadoDetalle("");
      }
    } catch (error) {
      console.error("ERROR ACTUALIZANDO ESTADO:", error);
    }
  };

  /* =====================================================
       FILTROS
    ===================================================== */

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const texto = busqueda.toLowerCase().trim();

    const coincideBusqueda =
      !texto ||
      solicitud.codigoSolicitud.toLowerCase().includes(texto) ||
      solicitud.numeroDocumento.toLowerCase().includes(texto) ||
      solicitud.cliente.toLowerCase().includes(texto) ||
      solicitud.equipo.toLowerCase().includes(texto) ||
      solicitud.marca.toLowerCase().includes(texto) ||
      solicitud.modelo.toLowerCase().includes(texto) ||
      solicitud.numeroSerie.toLowerCase().includes(texto);

    const coincideEstado =
      filtroEstado === "Todos" || solicitud.estado === filtroEstado;

    const coincidePrioridad =
      filtroPrioridad === "Todas" || solicitud.prioridad === filtroPrioridad;

    const coincideTecnico =
      filtroTecnico === "Todos" || solicitud.tecnicoAsignado === filtroTecnico;

    return (
      coincideBusqueda && coincideEstado && coincidePrioridad && coincideTecnico
    );
  });

  /* =====================================================
       INDICADORES
    ===================================================== */

  const totalSolicitudes = solicitudes.length;

  const solicitudesUrgentes = solicitudes.filter(
    (s) => s.prioridad === "Urgente" || s.prioridad === "Alta",
  ).length;

  const enDiagnostico = solicitudes.filter(
    (s) => s.estado === "Diagnóstico",
  ).length;

  const enReparacion = solicitudes.filter(
    (s) =>
      s.estado === "Mesa de reparación" ||
      s.estado === "Pendiente de reparación",
  ).length;

  const pendientesPresupuesto = solicitudes.filter(
    (s) => s.estado === "Presupuesto",
  ).length;

  const controlCalidad = solicitudes.filter(
    (s) => s.estado === "Control de calidad",
  ).length;

  /* =====================================================
       RENDER
    ===================================================== */

  return (
    <div className="servicios-container">
      {/* =================================================
                CABECERA
            ================================================= */}

      <div className="servicios-header">
        <div>
          <h1>Servicio Técnico</h1>

          <p>Gestión de solicitudes, recepción y seguimiento de equipos.</p>
        </div>

        <button className="btn-nueva" onClick={nuevaSolicitud}>
          + Nueva solicitud
        </button>
      </div>

      {/* =================================================
                INDICADORES
            ================================================= */}

      <div className="servicios-resumen">
        <div className="resumen-card">
          <div>
            <span>Total solicitudes</span>

            <strong>{totalSolicitudes}</strong>
          </div>
        </div>

        <div className="resumen-card">
          <div>
            <span>En diagnóstico</span>

            <strong>{enDiagnostico}</strong>
          </div>
        </div>

        <div className="resumen-card">
          <div>
            <span>Pendientes presupuesto</span>

            <strong>{pendientesPresupuesto}</strong>
          </div>
        </div>

        <div className="resumen-card">
          <div>
            <span>En reparación</span>

            <strong>{enReparacion}</strong>
          </div>
        </div>

        <div className="resumen-card">
          <div>
            <span>Alta prioridad</span>

            <strong>{solicitudesUrgentes}</strong>
          </div>
        </div>

        <div className="resumen-card">
          <div>
            <span>Control de calidad</span>

            <strong>{controlCalidad}</strong>
          </div>
        </div>
      </div>

      {/* =================================================
                FILTROS
            ================================================= */}

      <div className="servicios-filtros">
        <div className="busqueda-container">
          <span>🔎</span>

          <input
            type="text"
            placeholder="Buscar por código, documento, cliente, equipo o serie..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>

          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>

        <select
          value={filtroPrioridad}
          onChange={(e) => setFiltroPrioridad(e.target.value)}
        >
          <option value="Todas">Todas las prioridades</option>

          {PRIORIDADES.map((prioridad) => (
            <option key={prioridad} value={prioridad}>
              {prioridad}
            </option>
          ))}
        </select>

        <select
          value={filtroTecnico}
          onChange={(e) => setFiltroTecnico(e.target.value)}
        >
          <option value="Todos">Todos los técnicos</option>

          {TECNICOS.map((tecnico) => (
            <option key={tecnico} value={tecnico}>
              {tecnico}
            </option>
          ))}
        </select>
      </div>

      {/* =================================================
                FORMULARIO
            ================================================= */}

      {mostrarFormulario && (
        <div className="solicitud-form">
          <div className="form-header">
            <div>
              <h2>
                {modoEdicion
                  ? "Editar solicitud"
                  : "Nueva solicitud de servicio"}
              </h2>

              <span className="codigo-solicitud">
                {formulario.codigoSolicitud}
              </span>
            </div>

            <button className="btn-cerrar" onClick={cerrarFormulario}>
              ✕
            </button>
          </div>
          {/* MENSAJE */}
          {mensaje && <div className="mensaje-formulario">⚠️ {mensaje}</div>}
          {/* =================================================
                        DATOS DEL CLIENTE
                    ================================================= */}

          <div className="form-section">
            <div className="section-title">
              <div>
                <h3>Datos del cliente</h3>

                <p>Identificación y datos de contacto</p>
              </div>
            </div>

            <div className="documento-grid">
              <div className="campo">
                <label>Tipo de documento *</label>

                <select value={tipoDocumento} onChange={cambiarTipoDocumento}>
                  <option value="">Seleccionar</option>

                  <option value="DNI">DNI</option>

                  <option value="RUC">RUC</option>

                  <option value="CE">Carné de Extranjería</option>
                </select>
              </div>

              <div className="campo">
                <label>Número de documento *</label>

                <div className="documento-input">
                  <input
                    type="text"
                    value={formulario.numeroDocumento}
                    onChange={manejarDocumento}
                    placeholder={
                      tipoDocumento === "DNI"
                        ? "8 dígitos"
                        : tipoDocumento === "RUC"
                          ? "11 dígitos"
                          : "Número"
                    }
                  />

                  <button
                    type="button"
                    onClick={consultarDocumento}
                    disabled={consultandoDocumento}
                  >
                    {consultandoDocumento ? "Consultando..." : "Consultar"}
                  </button>
                </div>
              </div>
            </div>

            {tipoDocumento === "RUC" ? (
              <div className="form-grid">
                <div className="campo campo-completo">
                  <label>Razón social *</label>

                  <input
                    type="text"
                    name="razonSocial"
                    value={formulario.razonSocial}
                    onChange={cambiarCampo}
                    placeholder="Razón social"
                  />
                </div>
              </div>
            ) : (
              <div className="datos-personales-grid">
                <div className="campo">
                  <label>Nombres</label>

                  <input
                    type="text"
                    name="nombres"
                    value={formulario.nombres}
                    onChange={cambiarCampo}
                  />
                </div>

                <div className="campo">
                  <label>Apellido paterno</label>

                  <input
                    type="text"
                    name="apellidoPaterno"
                    value={formulario.apellidoPaterno}
                    onChange={cambiarCampo}
                  />
                </div>

                <div className="campo">
                  <label>Apellido materno</label>

                  <input
                    type="text"
                    name="apellidoMaterno"
                    value={formulario.apellidoMaterno}
                    onChange={cambiarCampo}
                  />
                </div>
              </div>
            )}

            <div className="contacto-grid">
              <div className="campo">
                <label>Dirección</label>

                <input
                  type="text"
                  name="direccion"
                  value={formulario.direccion}
                  onChange={cambiarCampo}
                  placeholder="Dirección"
                />
              </div>

              <div className="campo">
                <label>Teléfono *</label>

                <input
                  type="text"
                  name="telefono"
                  value={formulario.telefono}
                  onChange={cambiarCampo}
                  placeholder="987654321"
                />
              </div>

              <div className="campo">
                <label>Correo electrónico</label>

                <input
                  type="email"
                  name="email"
                  value={formulario.email}
                  onChange={cambiarCampo}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="campo">
                <label>Medio de contacto</label>

                <select
                  name="contactoPreferido"
                  value={formulario.contactoPreferido}
                  onChange={cambiarCampo}
                >
                  {MEDIOS_CONTACTO.map((medio) => (
                    <option key={medio} value={medio}>
                      {medio}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* =================================================
                        EQUIPO
                    ================================================= */}

          <div className="form-section">
            <div className="section-title">
              <div>
                <h3>Equipo recibido</h3>

                <p>Identificación del equipo ingresado</p>
              </div>
            </div>

            <div className="equipo-grid">
              <div className="campo">
                <label>Equipo *</label>

                <input
                  type="text"
                  name="equipo"
                  value={formulario.equipo}
                  onChange={cambiarCampo}
                  placeholder="Laptop, PC, impresora..."
                />
              </div>

              <div className="campo">
                <label>Marca</label>

                <input
                  type="text"
                  name="marca"
                  value={formulario.marca}
                  onChange={cambiarCampo}
                  placeholder="Marca"
                />
              </div>

              <div className="campo">
                <label>Modelo</label>

                <input
                  type="text"
                  name="modelo"
                  value={formulario.modelo}
                  onChange={cambiarCampo}
                  placeholder="Modelo"
                />
              </div>

              <div className="campo">
                <label>Número de serie</label>

                <input
                  type="text"
                  name="numeroSerie"
                  value={formulario.numeroSerie}
                  onChange={cambiarCampo}
                  placeholder="Número de serie"
                />
              </div>
            </div>
          </div>

          {/* =================================================
    CLASIFICACIÓN
================================================= */}

          <div className="form-section">
            <div className="section-title">
              <div>
                <h3>Clasificación del servicio</h3>

                <p>Información operativa y comercial de la solicitud</p>
              </div>
            </div>

            {/* TIPO DE ATENCIÓN */}

            <div className="clasificacion-atencion">
              <div className="campo">
                <label>Tipo de atención *</label>

                <p className="campo-ayuda">
                  Define el tratamiento comercial de la solicitud.
                </p>

                <div className="atencion-opciones">
                  {TIPOS_ATENCION.map((tipo) => (
                    <label
                      key={tipo}
                      className={`radio-card ${
                        formulario.tipoAtencion === tipo
                          ? "radio-card-activo"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipoAtencion"
                        value={tipo}
                        checked={formulario.tipoAtencion === tipo}
                        onChange={() => cambiarTipoAtencion(tipo)}
                      />

                      <div>
                        <strong>{tipo}</strong>

                        <span>
                          {tipo === "Garantía"
                            ? "Requiere evaluación antes de determinar si procede."
                            : "Atención particular del cliente."}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* DATOS OPERATIVOS */}

            <div className="clasificacion-datos">
              <div className="campo">
                <label>Tipo de servicio</label>

                <select
                  name="tipoServicio"
                  value={formulario.tipoServicio}
                  onChange={cambiarCampo}
                >
                  {TIPOS_SERVICIO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label>Prioridad</label>

                <select
                  name="prioridad"
                  value={formulario.prioridad}
                  onChange={cambiarCampo}
                >
                  {PRIORIDADES.map((prioridad) => (
                    <option key={prioridad} value={prioridad}>
                      {prioridad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label>Técnico asignado</label>

                <select
                  name="tecnicoAsignado"
                  value={formulario.tecnicoAsignado}
                  onChange={cambiarCampo}
                >
                  {TECNICOS.map((tecnico) => (
                    <option key={tecnico} value={tecnico}>
                      {tecnico}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label>Fecha estimada de entrega</label>

                <input
                  type="date"
                  name="fechaEntregaEstimada"
                  value={formulario.fechaEntregaEstimada}
                  onChange={cambiarCampo}
                />
              </div>

              <div className="campo">
                <label>Estado actual</label>

                <input type="text" value={formulario.estado} disabled />

                <p className="campo-ayuda">
                  El estado se modifica desde el flujo de la solicitud.
                </p>
              </div>
            </div>

            {/* =================================================
        PRESUPUESTO PARTICULAR
    ================================================= */}

            {formulario.tipoAtencion === "Servicio particular" && (
              <div className="clasificacion-subseccion presupuesto-subseccion">
                <div className="subseccion-titulo">Presupuesto</div>

                <div className="campo">
                  <label>¿Requiere presupuesto? *</label>

                  <div className="presupuesto-opciones">
                    <label
                      className={`radio-inline ${
                        formulario.requierePresupuesto
                          ? "radio-inline-activo"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="requierePresupuesto"
                        checked={formulario.requierePresupuesto}
                        onChange={() => cambiarRequierePresupuesto("Sí")}
                      />

                      <span>Sí, requiere presupuesto</span>
                    </label>

                    <label
                      className={`radio-inline ${
                        !formulario.requierePresupuesto
                          ? "radio-inline-activo"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="requierePresupuesto"
                        checked={!formulario.requierePresupuesto}
                        onChange={() => cambiarRequierePresupuesto("No")}
                      />

                      <span>No, reparación directa</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
        EVALUACIÓN DE GARANTÍA
    ================================================= */}

            {formulario.tipoAtencion === "Garantía" && (
              <div className="garantia-panel">
                <div className="garantia-header">
                  <div>
                    <h3>Evaluación de garantía</h3>

                    <p>
                      La garantía debe ser evaluada antes de determinar si la
                      reparación está cubierta.
                    </p>
                  </div>

                  <span
                    className={`garantia-resultado resultado-${formulario.evaluacionGarantia.resultado
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {formulario.evaluacionGarantia.resultado}
                  </span>
                </div>

                <div className="garantia-grid">
                  <div className="campo">
                    <label>Comprobante de compra</label>

                    <input
                      type="text"
                      name="comprobante"
                      value={formulario.evaluacionGarantia.comprobante}
                      onChange={cambiarCampoGarantia}
                      placeholder="Boleta, factura, comprobante..."
                    />
                  </div>

                  <div className="campo">
                    <label>Fecha de compra</label>

                    <input
                      type="date"
                      name="fechaCompra"
                      value={formulario.evaluacionGarantia.fechaCompra}
                      onChange={cambiarCampoGarantia}
                    />
                  </div>

                  <div className="campo">
                    <label>Fecha de vencimiento</label>

                    <input
                      type="date"
                      name="fechaVencimiento"
                      value={formulario.evaluacionGarantia.fechaVencimiento}
                      onChange={cambiarCampoGarantia}
                    />
                  </div>

                  <div className="campo">
                    <label>¿La serie coincide?</label>

                    <select
                      name="serieCoincide"
                      value={formulario.evaluacionGarantia.serieCoincide}
                      onChange={cambiarCampoGarantia}
                    >
                      {OPCIONES_SI_NO_PENDIENTE.map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="campo">
                    <label>¿Tiene daño físico?</label>

                    <select
                      name="danoFisico"
                      value={formulario.evaluacionGarantia.danoFisico}
                      onChange={cambiarCampoGarantia}
                    >
                      {OPCIONES_SI_NO_PENDIENTE.map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="campo">
                    <label>¿Hay manipulación?</label>

                    <select
                      name="manipulacion"
                      value={formulario.evaluacionGarantia.manipulacion}
                      onChange={cambiarCampoGarantia}
                    >
                      {OPCIONES_SI_NO_PENDIENTE.map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="campo">
                    <label>¿La falla está cubierta?</label>

                    <select
                      name="fallaCubierta"
                      value={formulario.evaluacionGarantia.fallaCubierta}
                      onChange={cambiarCampoGarantia}
                    >
                      {OPCIONES_SI_NO_PENDIENTE.map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* RESULTADO */}

                <div className="garantia-resultado-section">
                  <div className="campo">
                    <label>Resultado de la evaluación *</label>

                    <div className="resultado-opciones">
                      {RESULTADOS_GARANTIA.map((resultado) => (
                        <label
                          key={resultado}
                          className={`radio-inline ${
                            formulario.evaluacionGarantia.resultado ===
                            resultado
                              ? "radio-inline-activo"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="resultadoGarantia"
                            checked={
                              formulario.evaluacionGarantia.resultado ===
                              resultado
                            }
                            onChange={() => cambiarResultadoGarantia(resultado)}
                          />

                          <span>{resultado}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NO PROCEDE */}

                {formulario.evaluacionGarantia.resultado === "No procede" && (
                  <div className="garantia-rechazada">
                    <div className="campo">
                      <label>
                        ¿El cliente desea continuar como servicio particular?
                      </label>

                      <div className="resultado-opciones">
                        {["Pendiente", "Sí", "No"].map((opcion) => (
                          <label
                            key={opcion}
                            className={`radio-inline ${
                              formulario.evaluacionGarantia
                                .continuarComoParticular === opcion
                                ? "radio-inline-activo"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="continuarComoParticular"
                              checked={
                                formulario.evaluacionGarantia
                                  .continuarComoParticular === opcion
                              }
                              onChange={() =>
                                cambiarContinuarComoParticular(opcion)
                              }
                            />

                            <span>{opcion}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {formulario.evaluacionGarantia.continuarComoParticular ===
                      "Sí" && (
                      <div className="campo">
                        <label>
                          ¿Requiere presupuesto como servicio particular?
                        </label>

                        <div className="resultado-opciones">
                          <label
                            className={`radio-inline ${
                              formulario.requierePresupuesto
                                ? "radio-inline-activo"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="requierePresupuestoGarantia"
                              checked={formulario.requierePresupuesto}
                              onChange={() => cambiarRequierePresupuesto("Sí")}
                            />

                            <span>Sí</span>
                          </label>

                          <label
                            className={`radio-inline ${
                              !formulario.requierePresupuesto
                                ? "radio-inline-activo"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="requierePresupuestoGarantia"
                              checked={!formulario.requierePresupuesto}
                              onChange={() => cambiarRequierePresupuesto("No")}
                            />

                            <span>No</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* OBSERVACIONES GARANTÍA */}

                <div className="campo campo-completo garantia-observaciones">
                  <label>Observaciones de la evaluación</label>

                  <textarea
                    name="observaciones"
                    value={formulario.evaluacionGarantia.observaciones}
                    onChange={cambiarCampoGarantia}
                    rows="4"
                    placeholder="Registra los criterios, evidencias y conclusiones de la evaluación..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* =================================================
                        RECEPCIÓN
                    ================================================= */}

          <div className="form-section">
            <div className="section-title">
              <div>
                <h3>Recepción del equipo</h3>

                <p>Estado físico y elementos entregados</p>
              </div>
            </div>

            <div className="recepcion-grid">
              <div className="campo">
                <label>Condición de recepción</label>

                <textarea
                  name="condicionRecepcion"
                  value={formulario.condicionRecepcion}
                  onChange={cambiarCampo}
                  rows="3"
                  placeholder="Describe el estado físico del equipo..."
                />
              </div>

              <div className="campo">
                <label>Accesorios recibidos</label>

                <textarea
                  name="accesoriosRecibidos"
                  value={formulario.accesoriosRecibidos}
                  onChange={cambiarCampo}
                  rows="3"
                  placeholder="Cargador, cable, mouse, teclado..."
                />
              </div>

              <div className="campo campo-completo">
                <label>Observaciones de recepción</label>

                <textarea
                  name="observacionesRecepcion"
                  value={formulario.observacionesRecepcion}
                  onChange={cambiarCampo}
                  rows="3"
                  placeholder="Observaciones realizadas al momento de recibir el equipo..."
                />
              </div>
            </div>
          </div>

          {/* =================================================
                        CHECKLIST
                    ================================================= */}

          <div className="form-section">
            <div className="section-title">
              <div>
                <h3>Verificación inicial</h3>

                <p>Checklist realizado durante la recepción</p>
              </div>
            </div>

            <div className="verificacion-grid">
              <div className="campo">
                <label>¿El equipo enciende?</label>

                <select
                  name="estadoEncendido"
                  value={formulario.estadoEncendido}
                  onChange={cambiarCampo}
                >
                  <option value="">Seleccionar</option>

                  <option value="Enciende">Sí</option>

                  <option value="No enciende">No</option>

                  <option value="Intermitente">Intermitente</option>

                  <option value="No verificado">No verificado</option>
                </select>
              </div>

              <div className="campo">
                <label>Estado de pantalla</label>

                <select
                  name="estadoPantalla"
                  value={formulario.estadoPantalla}
                  onChange={cambiarCampo}
                >
                  <option value="">Seleccionar</option>

                  <option value="Operativa">Operativa</option>

                  <option value="Presenta fallas">Presenta fallas</option>

                  <option value="Daño físico">Daño físico</option>

                  <option value="No aplica">No aplica</option>

                  <option value="No verificado">No verificado</option>
                </select>
              </div>

              <div className="campo">
                <label>Estado de batería</label>

                <select
                  name="estadoBateria"
                  value={formulario.estadoBateria}
                  onChange={cambiarCampo}
                >
                  <option value="">Seleccionar</option>

                  <option value="Buena">Buena</option>

                  <option value="Regular">Regular</option>

                  <option value="Deficiente">Deficiente</option>

                  <option value="No aplica">No aplica</option>

                  <option value="No verificado">No verificado</option>
                </select>
              </div>

              <div className="campo">
                <label>Clave / patrón del equipo</label>

                <input
                  type="text"
                  name="claveEquipo"
                  value={formulario.claveEquipo}
                  onChange={cambiarCampo}
                  placeholder="Opcional"
                />
              </div>
            </div>
          </div>

          {/* =================================================
                        PROBLEMA
                    ================================================= */}

          <div className="form-section">
            <div className="section-title">
              <div>
                <h3>Problema y observaciones</h3>

                <p>Información proporcionada por el cliente</p>
              </div>
            </div>

            <div className="problema-grid">
              <div className="campo campo-completo">
                <label>Problema reportado *</label>

                <textarea
                  name="problemaReportado"
                  value={formulario.problemaReportado}
                  onChange={cambiarCampo}
                  rows="4"
                  placeholder="Describe el problema que reporta el cliente..."
                />
              </div>

              <div className="campo campo-completo">
                <label>Observaciones internas</label>

                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={cambiarCampo}
                  rows="4"
                  placeholder="Observaciones para el personal técnico..."
                />
              </div>
            </div>
          </div>

          {/* =================================================
                        BOTONES
                    ================================================= */}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={cerrarFormulario}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn-guardar"
              onClick={guardarSolicitud}
            >
              {modoEdicion ? "Guardar cambios" : "Registrar solicitud"}
            </button>
          </div>
        </div>
      )}

      {/* =================================================
                TABLA
            ================================================= */}

      <div className="tabla-container">
        <div className="tabla-header">
          <div>
            <h2>Solicitudes de servicio</h2>

            <span>{solicitudesFiltradas.length} registro(s)</span>
          </div>
        </div>

        {cargando ? (
          <div className="tabla-vacia">
            <div>⏳</div>

            <h3>Cargando solicitudes...</h3>

            <p>Obteniendo información del sistema.</p>
          </div>
        ) : solicitudesFiltradas.length === 0 ? (
          <div className="tabla-vacia">
            <div>🔍</div>

            <h3>No se encontraron solicitudes</h3>

            <p>Prueba cambiando los filtros o registra una nueva solicitud.</p>
          </div>
        ) : (
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>Código</th>

                  <th>Ingreso</th>

                  <th>Cliente</th>

                  <th>Equipo</th>

                  <th>Atención</th>

                  <th>Prioridad</th>

                  <th>Técnico</th>

                  <th>Estado</th>

                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {solicitudesFiltradas.map((solicitud) => (
                  <tr key={solicitud.id}>
                    <td>
                      <button
                        className="codigo-tabla codigo-link"
                        onClick={() => abrirDetalle(solicitud)}
                      >
                        {solicitud.codigoSolicitud}
                      </button>

                      <small>{solicitud.horaIngreso}</small>
                    </td>

                    <td>{solicitud.fechaIngreso}</td>

                    <td>
                      <strong>{solicitud.cliente}</strong>

                      <small>{solicitud.numeroDocumento}</small>
                    </td>

                    <td>
                      <strong>{solicitud.equipo}</strong>

                      <small>{solicitud.modelo}</small>
                    </td>

                    <td>
                      <span
                        className={`tipo-atencion-badge ${
                          solicitud.tipoAtencion === "Garantía"
                            ? "atencion-garantia"
                            : "atencion-particular"
                        }`}
                      >
                        {solicitud.tipoAtencion === "Garantía"
                          ? "Garantía"
                          : "Particular"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`prioridad prioridad-${solicitud.prioridad
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {solicitud.prioridad}
                      </span>
                    </td>

                    <td>{solicitud.tecnicoAsignado}</td>

                    <td>
                      <span
                        className={`estado estado-${solicitud.estado
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                      >
                        {solicitud.estado}
                      </span>
                    </td>

                    <td>
                      <div className="acciones-tabla">
                        <button
                          className="btn-accion btn-ver"
                          title="Ver detalle"
                          onClick={() => abrirDetalle(solicitud)}
                        >
                          Ver
                        </button>

                        <button
                          className="btn-accion"
                          title="Editar"
                          onClick={() => editarSolicitud(solicitud)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn-accion btn-eliminar"
                          title="Eliminar"
                          onClick={() => eliminarSolicitud(solicitud.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
                MODAL DETALLE
            ================================================= */}

      {mostrarDetalle && solicitudSeleccionada && (
        <div className="modal-overlay" onClick={cerrarDetalle}>
          <div className="detalle-modal" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}

            <div className="detalle-header">
              <div>
                <span>Solicitud de servicio</span>

                <h2>{solicitudSeleccionada.codigoSolicitud}</h2>

                <div className="detalle-header-badges">
                  <span
                    className={`estado estado-${solicitudSeleccionada.estado
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                  >
                    {solicitudSeleccionada.estado}
                  </span>

                  <span
                    className={`prioridad prioridad-${solicitudSeleccionada.prioridad
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {solicitudSeleccionada.prioridad}
                  </span>

                  <span
                    className={`tipo-atencion-badge ${
                      solicitudSeleccionada.tipoAtencion === "Garantía"
                        ? "atencion-garantia"
                        : "atencion-particular"
                    }`}
                  >
                    {solicitudSeleccionada.tipoAtencion}
                  </span>
                </div>
              </div>

              <button className="btn-cerrar" onClick={cerrarDetalle}>
                ✕
              </button>
            </div>

            {/* BODY */}

            <div className="detalle-body">
              {/* CLIENTE */}

              <div className="detalle-card">
                <div className="detalle-card-title">Cliente</div>

                <div className="detalle-info-grid">
                  <div>
                    <span>Cliente</span>

                    <strong>{solicitudSeleccionada.cliente}</strong>
                  </div>

                  <div>
                    <span>Documento</span>

                    <strong>
                      {solicitudSeleccionada.tipoDocumento}{" "}
                      {solicitudSeleccionada.numeroDocumento}
                    </strong>
                  </div>

                  <div>
                    <span>Teléfono</span>

                    <strong>
                      {solicitudSeleccionada.formulario?.telefono ||
                        "No registrado"}
                    </strong>
                  </div>

                  <div>
                    <span>Contacto preferido</span>

                    <strong>{solicitudSeleccionada.contactoPreferido}</strong>
                  </div>
                </div>
              </div>

              {/* EQUIPO */}

              <div className="detalle-card">
                <div className="detalle-card-title">Equipo</div>

                <div className="detalle-info-grid">
                  <div>
                    <span>Equipo</span>

                    <strong>{solicitudSeleccionada.equipo}</strong>
                  </div>

                  <div>
                    <span>Marca</span>

                    <strong>{solicitudSeleccionada.marca || "-"}</strong>
                  </div>

                  <div>
                    <span>Modelo</span>

                    <strong>{solicitudSeleccionada.modelo || "-"}</strong>
                  </div>

                  <div>
                    <span>Número de serie</span>

                    <strong>{solicitudSeleccionada.numeroSerie || "-"}</strong>
                  </div>
                </div>
              </div>

              {/* SERVICIO */}

              <div className="detalle-card">
                <div className="detalle-card-title">Servicio</div>

                <div className="detalle-info-grid">
                  <div>
                    <span>Tipo de atención</span>

                    <strong>
                      {solicitudSeleccionada.tipoAtencion ||
                        "Servicio particular"}
                    </strong>
                  </div>

                  <div>
                    <span>Tipo de servicio</span>

                    <strong>{solicitudSeleccionada.tipoServicio}</strong>
                  </div>

                  <div>
                    <span>Técnico</span>

                    <strong>{solicitudSeleccionada.tecnicoAsignado}</strong>
                  </div>

                  <div>
                    <span>Fecha de ingreso</span>

                    <strong>
                      {solicitudSeleccionada.fechaIngreso}{" "}
                      {solicitudSeleccionada.horaIngreso}
                    </strong>
                  </div>

                  <div>
                    <span>Entrega estimada</span>

                    <strong>
                      {solicitudSeleccionada.fechaEntregaEstimada ||
                        "No definida"}
                    </strong>
                  </div>

                  <div>
                    <span>Presupuesto</span>

                    <strong>
                      {solicitudSeleccionada.requierePresupuesto ? "Sí" : "No"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* EVALUACIÓN DE GARANTÍA */}

              {solicitudSeleccionada.tipoAtencion === "Garantía" && (
                <div className="detalle-card">
                  <div className="detalle-card-title">
                    Evaluación de garantía
                  </div>

                  <div className="detalle-info-grid">
                    <div>
                      <span>Resultado</span>

                      <strong>
                        {solicitudSeleccionada.evaluacionGarantia?.resultado ||
                          "Pendiente"}
                      </strong>
                    </div>

                    <div>
                      <span>Comprobante</span>

                      <strong>
                        {solicitudSeleccionada.evaluacionGarantia
                          ?.comprobante || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Fecha de compra</span>

                      <strong>
                        {solicitudSeleccionada.evaluacionGarantia
                          ?.fechaCompra || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Vencimiento</span>

                      <strong>
                        {solicitudSeleccionada.evaluacionGarantia
                          ?.fechaVencimiento || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Serie coincide</span>

                      <strong>
                        {solicitudSeleccionada.evaluacionGarantia
                          ?.serieCoincide || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Daño físico</span>

                      <strong>
                        {solicitudSeleccionada.evaluacionGarantia?.danoFisico ||
                          "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Manipulación</span>

                      <strong>
                        {solicitudSeleccionada.evaluacionGarantia
                          ?.manipulacion || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Falla cubierta</span>

                      <strong>
                        {solicitudSeleccionada.evaluacionGarantia
                          ?.fallaCubierta || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Continuar como particular</span>

                      <strong>
                        {solicitudSeleccionada.evaluacionGarantia
                          ?.continuarComoParticular || "No aplica"}
                      </strong>
                    </div>
                  </div>

                  {solicitudSeleccionada.evaluacionGarantia?.observaciones && (
                    <p className="detalle-texto">
                      <strong>Observaciones:</strong>{" "}
                      {solicitudSeleccionada.evaluacionGarantia.observaciones}
                    </p>
                  )}
                </div>
              )}

              {/* PROBLEMA */}

              <div className="detalle-card">
                <div className="detalle-card-title">Problema reportado</div>

                <p className="detalle-texto">
                  {solicitudSeleccionada.problemaReportado}
                </p>
              </div>

              {/* RECEPCIÓN */}

              <div className="detalle-card">
                <div className="detalle-card-title">Recepción</div>

                <div className="detalle-info-grid">
                  <div>
                    <span>Condición</span>

                    <strong>
                      {solicitudSeleccionada.condicionRecepcion || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Accesorios</span>

                    <strong>
                      {solicitudSeleccionada.accesoriosRecibidos || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Encendido</span>

                    <strong>
                      {solicitudSeleccionada.estadoEncendido || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Pantalla</span>

                    <strong>
                      {solicitudSeleccionada.estadoPantalla || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Batería</span>

                    <strong>
                      {solicitudSeleccionada.estadoBateria || "-"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* CAMBIO DE ESTADO */}

              {/* CAMBIO DE ESTADO */}

              <div className="detalle-card">
                <div className="detalle-card-title">Actualizar estado</div>

                {(solicitudSeleccionada.estadosDisponibles || []).length ===
                0 ? (
                  <input
                    type="text"
                    value="Solicitud cerrada - sin estados siguientes"
                    disabled
                  />
                ) : (
                  <select
                    value={estadoSeleccionadoDetalle}
                    onChange={(e) =>
                      setEstadoSeleccionadoDetalle(e.target.value)
                    }
                  >
                    <option value="">Seleccionar estado</option>

                    {(solicitudSeleccionada.estadosDisponibles || []).map(
                      (estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ),
                    )}
                  </select>
                )}
              </div>

              {/* HISTORIAL */}

              <div className="detalle-card">
                <div className="detalle-card-title">Flujo del servicio</div>

                <div className="timeline">
                  {(solicitudSeleccionada.historialEstados || []).map(
                    (historial) => {
                      const esActual =
                        historial.estadoNuevo === solicitudSeleccionada.estado;

                      return (
                        <div
                          key={historial.id}
                          className={`timeline-item ${
                            esActual ? "actual" : "completado"
                          }`}
                        >
                          <div className="timeline-dot">✓</div>

                          <div className="timeline-content">
                            <strong>{historial.estadoNuevo}</strong>

                            {historial.estadoAnterior && (
                              <span>Desde: {historial.estadoAnterior}</span>
                            )}

                            <small>
                              {new Date(historial.fechaCambio).toLocaleString(
                                "es-PE",
                                {
                                  timeZone: "America/Lima",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </small>

                            {historial.observaciones && (
                              <p>{historial.observaciones}</p>
                            )}

                            {esActual && (
                              <span className="estado-actual-label">
                                Estado actual
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="detalle-footer">
              <button className="btn-cancelar" onClick={cerrarDetalle}>
                Cerrar
              </button>

              {(solicitudSeleccionada.estadosDisponibles || []).length > 0 && (
                <button
                  className="btn-guardar"
                  onClick={() =>
                    cambiarEstadoDesdeDetalle(estadoSeleccionadoDetalle)
                  }
                >
                  Actualizar estado
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Servicios;
