import { useEffect, useState } from "react";
import "./Presupuestos.css";

// ======================================================
// MAPEAR SOLICITUD DESDE BACKEND
// ======================================================

const mapearSolicitudBackend = (solicitud) => {
  const nombreCliente =
    solicitud.razon_social ||
    solicitud.nombre_comercial ||
    [solicitud.nombres, solicitud.apellido_paterno, solicitud.apellido_materno]
      .filter(Boolean)
      .join(" ") ||
    "Sin nombre";

  const estadoMap = {
    DIAGNOSTICO: "Diagnóstico",
    PRESUPUESTO: "Presupuesto",
    PRESUPUESTO_APROBADO: "Presupuesto aprobado",
    PRESUPUESTO_DESAPROBADO: "Presupuesto desaprobado",
    ESPERANDO_REPUESTOS: "Esperando repuestos",
    REPUESTOS_RECIBIDOS: "Repuestos recibidos",
    PENDIENTE_REPARACION: "Pendiente de reparación",
    MESA_REPARACIONES: "Mesa de reparación",
    SE_NECESITAN_MAS_REPUESTOS: "Se necesitan más repuestos",
    ACTUALIZANDO_PRESUPUESTO: "Actualizando presupuesto",
    NUEVO_PRESUPUESTO: "Nuevo presupuesto",
    REPARACION_SUSPENDIDA: "Reparación suspendida",
    CONTROL_CALIDAD: "Control de calidad",
    ALMACEN_REPARADOS: "Almacén de reparados",
    ALMACEN_NO_REPARADOS: "Almacén de no reparados",
    POR_FACTURAR: "Por facturar",
    FACTURADO: "Facturado",
    ENTREGADO: "Entregado",
    CERRADA: "Cerrada",
  };

  const estadoDB = String(solicitud.estado || "")
    .trim()
    .toUpperCase();

  return {
    id: solicitud.id,

    codigoSolicitud:
      solicitud.numero_solicitud || solicitud.codigoSolicitud || "",

    fechaIngreso:
      solicitud.fecha_ingreso ||
      solicitud.fecha_solicitud ||
      solicitud.created_at ||
      "",

    cliente: nombreCliente,

    tipoDocumento: solicitud.tipo_documento || "",

    numeroDocumento: solicitud.numero_documento || "",

    equipo: solicitud.tipo_equipo || "",

    marca: solicitud.marca || "",

    modelo: solicitud.modelo || "",

    numeroSerie: solicitud.numero_serie || "",

    problemaReportado: solicitud.problema_reportado || "",

    diagnostico: solicitud.diagnostico || "",

    estado: estadoMap[estadoDB] || estadoDB || "Sin estado",
  };
};

// ======================================================
// MAPEAR PRESUPUESTO DESDE BACKEND
// ======================================================

const mapearPresupuestoBackend = (presupuesto) => {
  const nombreCliente =
    presupuesto.razon_social ||
    presupuesto.nombre_comercial ||
    [
      presupuesto.nombres,
      presupuesto.apellido_paterno,
      presupuesto.apellido_materno,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Sin nombre";

  const estadoMap = {
    PENDIENTE: "Pendiente",
    APROBADO: "Aprobado",
    RECHAZADO: "Rechazado",
    DESAPROBADO: "Rechazado",
  };

  const conceptos = (presupuesto.detalles || []).map((detalle, index) => {
    const cantidad = Number(detalle.cantidad) || 1;

    const precioUnitario = Number(detalle.precio_unitario) || 0;

    const descuentoMonto = Number(detalle.descuento) || 0;

    const subtotal = cantidad * precioUnitario;

    const descuentoPorcentaje =
      subtotal > 0 ? (descuentoMonto / subtotal) * 100 : 0;

    const tipoMap = {
      REPUESTO: "Repuesto",
      MANO_OBRA: "Mano de obra",
      SERVICIO: "Servicio",
      OTRO: "Otro",
    };

    return {
      id: detalle.id || `${presupuesto.id}-${index}`,

      tipo: tipoMap[detalle.tipo_item] || "Otro",

      productoId: detalle.producto_id ? Number(detalle.producto_id) : null,

      codigo: detalle.producto_codigo || "",

      descripcion: detalle.descripcion || "",

      modelo: detalle.producto_modelo || "",

      almacenId: detalle.almacen_id ? Number(detalle.almacen_id) : null,

      almacenCodigo: detalle.almacen_codigo || "",

      almacenNombre: detalle.almacen_nombre || "",

      stockDisponible: 0,

      cantidad,

      unidad: detalle.unidad_medida || "UND",

      moneda: detalle.moneda || "SOL",

      precioUnitario,

      descuento: descuentoPorcentaje,
    };
  });

  return {
    id: presupuesto.id,

    codigoPresupuesto: presupuesto.numero_presupuesto,

    solicitudId: presupuesto.solicitud_id,

    codigoSolicitud: presupuesto.numero_solicitud,

    fecha: presupuesto.fecha_emision || presupuesto.created_at,

    cliente: nombreCliente,

    tipoDocumento: presupuesto.tipo_documento,

    numeroDocumento: presupuesto.numero_documento,

    equipo: presupuesto.tipo_equipo,

    marca: presupuesto.marca,

    modelo: presupuesto.modelo,

    numeroSerie: presupuesto.numero_serie,

    problemaReportado: presupuesto.problema_reportado,

    diagnostico: presupuesto.diagnostico || "",

    estado: estadoMap[presupuesto.estado] || presupuesto.estado,

    observaciones: presupuesto.observaciones || "",

    subtotal: Number(presupuesto.subtotal || 0),

    descuento: Number(presupuesto.descuento || 0),

    igv: Number(presupuesto.igv || 0),

    total: Number(presupuesto.total || 0),

    conceptos,
  };
};

// ======================================================
// COMPONENTE
// ======================================================
function Presupuestos() {
  // ==================================================
  // ESTADOS GENERALES
  // ==================================================

  const [solicitudes, setSolicitudes] = useState([]);

  const [presupuestos, setPresupuestos] = useState([]);

  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true);

  const [cargandoPresupuestos, setCargandoPresupuestos] = useState(true);
  const [vigencia, setVigencia] = useState(7);

  const [tiempoReparacion, setTiempoReparacion] = useState("");

  const [garantia, setGarantia] = useState("");

  const [formaPago, setFormaPago] = useState("Contado");

  const [condiciones, setCondiciones] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);

  const [presupuestoEditando, setPresupuestoEditando] = useState(null);

  // ==================================================
  // BÚSQUEDA DE SOLICITUD
  // ==================================================

  const [tipoBusqueda, setTipoBusqueda] = useState("orden");

  const [busquedaSolicitud, setBusquedaSolicitud] = useState("");

  const [fechaDesde, setFechaDesde] = useState("");

  const [fechaHasta, setFechaHasta] = useState("");

  const [mostrarResultados, setMostrarResultados] = useState(false);

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  // ==================================================
  // FORMULARIO DEL PRESUPUESTO
  // ==================================================
  const [mostrarModalRepuestos, setMostrarModalRepuestos] = useState(false);
  const [conceptoRepuestoSeleccionado, setConceptoRepuestoSeleccionado] =
    useState(null);

  const [busquedaRepuestoModal, setBusquedaRepuestoModal] = useState("");
  const [productosModal, setProductosModal] = useState([]);
  const [cargandoProductosModal, setCargandoProductosModal] = useState(false);
  const [diagnostico, setDiagnostico] = useState("");

  const [estadoPresupuesto, setEstadoPresupuesto] = useState("Pendiente");

  const [observaciones, setObservaciones] = useState("");
  //const [productosBusqueda, setProductosBusqueda] = useState({});
  //const [buscandoProductos, setBuscandoProductos] = useState({});

  const [conceptos, setConceptos] = useState([
    {
      id: 1,
      tipo: "Servicio",

      productoId: null,

      codigo: "",
      descripcion: "",
      modelo: "",

      almacenId: null,
      almacenCodigo: "",
      almacenNombre: "",
      stockDisponible: 0,

      cantidad: 1,

      unidad: "UND",

      precioUnitario: 0,

      descuento: 0,

      moneda: "SOL",
    },
  ]);

  // ==================================================
  // BÚSQUEDA DE PRESUPUESTOS
  // ==================================================

  const [busquedaPresupuesto, setBusquedaPresupuesto] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("Todos");
  // ==================================================
  // BÚSQUEDA DE PRODUCTOS / REPUESTOS
  // ==================================================

  //const [productosEncontrados, setProductosEncontrados] = useState([]);

  // const [cargandoProductos, setCargandoProductos] = useState(false);

  //const [conceptoBuscandoProducto, setConceptoBuscandoProducto] =
  //useState(null);

  // ==================================================
  // CARGAR SOLICITUDES
  // ==================================================

  const cargarSolicitudes = async () => {
    try {
      setCargandoSolicitudes(true);

      const response = await fetch("http://localhost:3000/api/servicios");

      const data = await response.json();

      console.log("DATOS SERVICIOS BACKEND:", data);

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al obtener las solicitudes");
      }

      const solicitudesBackend = Array.isArray(data.solicitudes)
        ? data.solicitudes
        : [];

      console.log("SOLICITUDES BACKEND:", solicitudesBackend);

      const solicitudesMapeadas = solicitudesBackend.map(
        mapearSolicitudBackend,
      );

      console.log("SOLICITUDES MAPEADAS:", solicitudesMapeadas);

      setSolicitudes(solicitudesMapeadas);
    } catch (error) {
      console.error("ERROR CARGANDO SOLICITUDES:", error);

      setSolicitudes([]);
    } finally {
      setCargandoSolicitudes(false);
    }
  };

  // ==================================================
  // CARGAR PRESUPUESTOS
  // ==================================================

  const cargarPresupuestos = async () => {
    try {
      setCargandoPresupuestos(true);

      const response = await fetch("http://localhost:3000/api/presupuestos");

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.mensaje || "No se pudieron cargar los presupuestos",
        );
      }

      const presupuestosMapeados = (data.presupuestos || []).map(
        mapearPresupuestoBackend,
      );

      setPresupuestos(presupuestosMapeados);
    } catch (error) {
      console.error("Error cargando presupuestos:", error);

      alert("No se pudieron cargar los presupuestos.");
    } finally {
      setCargandoPresupuestos(false);
    }
  };
  useEffect(() => {
    const cargarDatos = async () => {
      await Promise.all([cargarSolicitudes(), cargarPresupuestos()]);
    };

    cargarDatos();
  }, []);
  // useEffect(() => {
  // cargarSolicitudes();
  //cargarPresupuestos();
  //}, []);

  // ==================================================
  // FORMATEAR FECHA
  // ==================================================

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "";
    }

    const fechaSolo = fecha.split("T")[0];

    const [anio, mes, dia] = fechaSolo.split("-");

    return `${dia}/${mes}/${anio.slice(2)}`;
  };
  console.log("TODAS LAS SOLICITUDES:", solicitudes);

  const solicitudesParaPresupuesto = solicitudes.filter(
    (solicitud) =>
      String(solicitud.estado || "")
        .trim()
        .toLowerCase() === "presupuesto",
  );

  console.log("SOLICITUDES PARA PRESUPUESTO:", solicitudesParaPresupuesto);
  console.log("TODAS LAS SOLICITUDES:", solicitudes);
  console.log("SOLICITUDES PARA PRESUPUESTO:", solicitudesParaPresupuesto);
  // ==================================================
  // FILTRAR SOLICITUDES
  // ==================================================

  const solicitudesFiltradas = solicitudesParaPresupuesto.filter(
    (solicitud) => {
      // ------------------------------------------
      // ORDEN DE SERVICIO
      // ------------------------------------------

      if (tipoBusqueda === "orden") {
        const texto = busquedaSolicitud.toLowerCase().trim();

        if (!texto) {
          return true;
        }

        return (solicitud.codigoSolicitud || "").toLowerCase().includes(texto);
      }

      // ------------------------------------------
      // FECHA
      // ------------------------------------------

      if (tipoBusqueda === "fecha") {
        if (!fechaDesde && !fechaHasta) {
          return true;
        }

        const fechaSolicitud =
          solicitud.fechaIngreso?.split("T")[0] || solicitud.fechaIngreso || "";

        if (fechaDesde && fechaSolicitud < fechaDesde) {
          return false;
        }

        if (fechaHasta && fechaSolicitud > fechaHasta) {
          return false;
        }

        return true;
      }

      // ------------------------------------------
      // OTROS CRITERIOS
      // ------------------------------------------

      const texto = busquedaSolicitud.toLowerCase().trim();

      if (!texto) {
        return true;
      }

      switch (tipoBusqueda) {
        case "serie":
          return (solicitud.numeroSerie || "").toLowerCase().includes(texto);

        case "cliente":
          return (solicitud.cliente || "").toLowerCase().includes(texto);

        default:
          return true;
      }
    },
  );

  // ==================================================
  // FILTRAR PRESUPUESTOS
  // ==================================================

  const presupuestosFiltrados = presupuestos.filter((presupuesto) => {
    const texto = busquedaPresupuesto.toLowerCase().trim();

    const coincideTexto =
      !texto ||
      (presupuesto.codigoPresupuesto || "").toLowerCase().includes(texto) ||
      (presupuesto.codigoSolicitud || "").toLowerCase().includes(texto) ||
      (presupuesto.cliente || "").toLowerCase().includes(texto) ||
      (presupuesto.numeroSerie || "").toLowerCase().includes(texto);

    const coincideEstado =
      filtroEstado === "Todos" || presupuesto.estado === filtroEstado;

    return coincideTexto && coincideEstado;
  });

  // ==================================================
  // BUSCAR SOLICITUD
  // ==================================================

  const buscarSolicitudes = () => {
    setMostrarResultados(true);
  };
  // ======================================================
  // MODAL DE REPUESTOS
  // ======================================================
  const abrirModalRepuestos = (conceptoId) => {
    const concepto = conceptos.find((item) => item.id === conceptoId);

    const busquedaInicial = concepto?.codigo || concepto?.descripcion || "";

    setConceptoRepuestoSeleccionado(conceptoId);

    setBusquedaRepuestoModal(busquedaInicial);

    setProductosModal([]);

    setMostrarModalRepuestos(true);

    // Buscar automáticamente si ya existe
    // un código o descripción.
    if (busquedaInicial.trim().length >= 2) {
      buscarProductosModal(busquedaInicial);
    }
  };

  const cerrarModalRepuestos = () => {
    setMostrarModalRepuestos(false);
    setConceptoRepuestoSeleccionado(null);
    setBusquedaRepuestoModal("");
    setProductosModal([]);
  };

  // ======================================================
  // BUSCAR REPUESTOS DESDE EL MODAL
  // ======================================================

  const buscarProductosModal = async (texto) => {
    const busqueda = texto.trim();

    setBusquedaRepuestoModal(texto);

    if (busqueda.length < 2) {
      setProductosModal([]);
      return;
    }

    try {
      setCargandoProductosModal(true);

      const response = await fetch(
        `http://localhost:3000/api/productos/buscar?buscar=${encodeURIComponent(
          busqueda,
        )}`,
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.mensaje || "No se pudieron buscar los productos.");
      }

      console.log("PRODUCTOS ENCONTRADOS:", data.productos);

      setProductosModal(data.productos || []);
    } catch (error) {
      console.error("ERROR BUSCANDO REPUESTOS:", error);

      setProductosModal([]);
    } finally {
      setCargandoProductosModal(false);
    }
  };

  // ======================================================
  // SELECCIONAR PRODUCTO + ALMACÉN
  // ======================================================

  const seleccionarProductoDesdeModal = (producto, almacen) => {
    setConceptos((conceptosActuales) =>
      conceptosActuales.map((concepto) => {
        if (concepto.id !== conceptoRepuestoSeleccionado) {
          return concepto;
        }

        return {
          ...concepto,

          productoId: Number(producto.id),

          codigo: producto.codigo || "",

          descripcion: producto.descripcion || "",

          modelo: producto.modelo || "",

          unidad: producto.unidad_medida || "UND",

          moneda: producto.moneda || "SOL",

          precioUnitario: Number(producto.precio_sin_igv) || 0,

          almacenId: Number(almacen.almacen_id),

          almacenCodigo: almacen.codigo || "",

          almacenNombre: almacen.nombre || "",

          stockDisponible: Number(almacen.disponible) || 0,
        };
      }),
    );

    cerrarModalRepuestos();
  };
  // ==================================================
  // SELECCIONAR SOLICITUD
  // ==================================================

  const seleccionarSolicitud = (solicitud) => {
    const presupuestoExistente = presupuestos.find(
      (presupuesto) =>
        presupuesto.codigoSolicitud === solicitud.codigoSolicitud,
    );

    if (presupuestoExistente && !modoEdicion) {
      alert(
        `La orden ${solicitud.codigoSolicitud} ya tiene un presupuesto: ${presupuestoExistente.codigoPresupuesto}`,
      );

      return;
    }

    setSolicitudSeleccionada(solicitud);

    setBusquedaSolicitud(solicitud.codigoSolicitud);

    setMostrarResultados(false);
  };

  // ==================================================
  // ENTER EN ORDEN DE SERVICIO
  // ==================================================

  const manejarEnterOrden = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const codigo = busquedaSolicitud.trim().toLowerCase();

    if (!codigo) {
      setMostrarResultados(true);
      return;
    }

    const solicitud = solicitudes.find(
      (s) =>
        s.estado === "Presupuesto" &&
        s.codigoSolicitud.toLowerCase() === codigo,
    );

    if (solicitud) {
      seleccionarSolicitud(solicitud);
    } else {
      alert(
        "No se encontró una orden de servicio disponible para presupuesto.",
      );
    }
  };

  // ==================================================
  // CAMBIAR CRITERIO DE BÚSQUEDA
  // ==================================================

  const cambiarTipoBusqueda = (event) => {
    const nuevoTipo = event.target.value;

    setTipoBusqueda(nuevoTipo);

    setBusquedaSolicitud("");

    setFechaDesde("");

    setFechaHasta("");

    setMostrarResultados(nuevoTipo === "orden");

    setSolicitudSeleccionada(null);
  };

  // ==================================================
  // AGREGAR CONCEPTO
  // ==================================================

  const agregarConcepto = () => {
    setConceptos([
      ...conceptos,
      {
        id: Date.now(),
        tipo: "Servicio",

        productoId: null,

        codigo: "",
        descripcion: "",
        modelo: "",

        almacenId: null,
        almacenCodigo: "",
        almacenNombre: "",
        stockDisponible: 0,

        cantidad: 1,

        unidad: "UND",

        moneda: "SOL",

        precioUnitario: 0,

        descuento: 0,
      },
    ]);
  };

  // ==================================================
  // ACTUALIZAR CONCEPTO
  // ==================================================

  const actualizarConcepto = (id, campo, valor) => {
    setConceptos((conceptosActuales) =>
      conceptosActuales.map((concepto) => {
        if (concepto.id !== id) {
          return concepto;
        }

        const conceptoActualizado = {
          ...concepto,

          [campo]:
            campo === "cantidad" ||
            campo === "precioUnitario" ||
            campo === "descuento"
              ? Number(valor)
              : valor,
        };

        // Si cambia el tipo
        if (campo === "tipo" && valor !== "Repuesto") {
          conceptoActualizado.productoId = null;

          conceptoActualizado.almacenId = null;
          conceptoActualizado.almacenCodigo = "";
          conceptoActualizado.almacenNombre = "";
          conceptoActualizado.stockDisponible = 0;

          conceptoActualizado.moneda = "SOL";
        }

        // Si cambia a Repuesto
        if (campo === "tipo" && valor === "Repuesto") {
          conceptoActualizado.productoId = null;

          conceptoActualizado.codigo = "";
          conceptoActualizado.descripcion = "";
          conceptoActualizado.modelo = "";

          conceptoActualizado.almacenId = null;
          conceptoActualizado.almacenCodigo = "";
          conceptoActualizado.almacenNombre = "";
          conceptoActualizado.stockDisponible = 0;

          conceptoActualizado.unidad = "UND";

          conceptoActualizado.precioUnitario = 0;

          conceptoActualizado.moneda = "SOL";
        }

        return conceptoActualizado;
      }),
    );
  };

  // ==================================================
  // ELIMINAR CONCEPTO
  // ==================================================

  const eliminarConcepto = (id) => {
    if (conceptos.length === 1) {
      return;
    }

    setConceptos(conceptos.filter((concepto) => concepto.id !== id));
  };

  // ==================================================
  // CALCULAR SUBTOTAL
  // ==================================================

  const calcularSubtotal = () => {
    return conceptos.reduce((total, concepto) => {
      const cantidad = Number(concepto.cantidad) || 0;

      const precio = Number(concepto.precioUnitario) || 0;

      return total + cantidad * precio;
    }, 0);
  };

  // ==================================================
  // CALCULAR DESCUENTO
  // ==================================================

  const calcularDescuento = () => {
    return conceptos.reduce((total, concepto) => {
      const cantidad = Number(concepto.cantidad) || 0;

      const precio = Number(concepto.precioUnitario) || 0;

      const descuento = Number(concepto.descuento) || 0;

      const subtotal = cantidad * precio;

      return total + (subtotal * descuento) / 100;
    }, 0);
  };

  // ==================================================
  // CALCULAR IGV
  // ==================================================

  const calcularIGV = () => {
    const subtotal = calcularSubtotal();

    const descuento = calcularDescuento();

    const baseImponible = subtotal - descuento;

    return baseImponible * 0.18;
  };

  // ==================================================
  // CALCULAR TOTAL
  // ==================================================

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();

    const descuento = calcularDescuento();

    const igv = (subtotal - descuento) * 0.18;

    return subtotal - descuento + igv;
  };

  // ==================================================
  // LIMPIAR FORMULARIO
  // ==================================================

  const limpiarFormulario = () => {
    setSolicitudSeleccionada(null);

    setBusquedaSolicitud("");

    setDiagnostico("");

    setEstadoPresupuesto("Pendiente");

    setObservaciones("");

    setVigencia(7);

    setTiempoReparacion("");

    setGarantia("");

    setFormaPago("Contado");

    setCondiciones("");

    setConceptos([
      {
        id: 1,
        tipo: "Servicio",
        productoId: null,
        codigo: "",
        descripcion: "",
        modelo: "",
        cantidad: 1,
        unidad: "UND",
        precioUnitario: 0,
        descuento: 0,
        moneda: "SOL",
      },
    ]);

    setModoEdicion(false);

    setPresupuestoEditando(null);
  };

  // ==================================================
  // NUEVO PRESUPUESTO
  // ==================================================

  const nuevoPresupuesto = () => {
    limpiarFormulario();

    setMostrarFormulario(true);

    setMostrarResultados(true);
  };

  // ==================================================
  // CANCELAR
  // ==================================================

  const cancelarFormulario = () => {
    limpiarFormulario();

    setMostrarFormulario(false);

    setMostrarResultados(false);
  };

  // ==================================================
  // GUARDAR PRESUPUESTO
  // ==================================================
  const guardarPresupuesto = async (event) => {
    event.preventDefault();

    // ----------------------------------------------
    // VALIDAR SOLICITUD
    // ----------------------------------------------

    if (!solicitudSeleccionada) {
      alert("Debe seleccionar una orden de servicio.");
      return;
    }

    // ----------------------------------------------
    // VALIDAR CONCEPTOS
    // ----------------------------------------------

    const conceptosValidos = conceptos.filter(
      (concepto) => concepto.descripcion.trim() !== "",
    );

    if (conceptosValidos.length === 0) {
      alert("Debe agregar al menos un concepto.");
      return;
    }

    try {
      // ----------------------------------------------
      // EDITAR
      // ----------------------------------------------

      // ----------------------------------------------
      // EDITAR PRESUPUESTO
      // ----------------------------------------------

      if (modoEdicion && presupuestoEditando) {
        const tipoItemMap = {
          Repuesto: "REPUESTO",
          "Mano de obra": "MANO_OBRA",
          Servicio: "SERVICIO",
          Otro: "OTRO",
        };

        const detalles = conceptosValidos.map((concepto) => {
          const cantidad = Number(concepto.cantidad) || 1;

          const precioUnitario = Number(concepto.precioUnitario) || 0;

          const descuentoPorcentaje = Number(concepto.descuento) || 0;

          const descuentoMonto =
            (cantidad * precioUnitario * descuentoPorcentaje) / 100;

          const tipoItem = tipoItemMap[concepto.tipo] || "OTRO";

          if (tipoItem === "REPUESTO" && !concepto.productoId) {
            throw new Error(
              `El concepto "${concepto.descripcion}" es un repuesto, pero no tiene un producto asociado.`,
            );
          }

          return {
            tipo_item: tipoItem,

            descripcion: concepto.descripcion,

            producto_id: tipoItem === "REPUESTO" ? concepto.productoId : null,

            almacen_id: tipoItem === "REPUESTO" ? concepto.almacenId : null,

            cantidad,

            precio_unitario: precioUnitario,

            descuento: descuentoMonto,

            observaciones: null,
          };
        });

        console.log("ACTUALIZANDO PRESUPUESTO:", presupuestoEditando.id);

        console.log("DETALLES A GUARDAR:", detalles);

        const response = await fetch(
          `http://localhost:3000/api/presupuestos/${presupuestoEditando.id}/detalles`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              detalles,

              observaciones: observaciones || null,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(
            data.mensaje || "No se pudo actualizar el presupuesto.",
          );
        }

        console.log("PRESUPUESTO ACTUALIZADO:", data.presupuesto);

        // ----------------------------------------------
        // RECARGAR DESDE POSTGRESQL
        // ----------------------------------------------

        await cargarPresupuestos();

        alert(
          `Presupuesto ${presupuestoEditando.codigoPresupuesto} actualizado correctamente.`,
        );

        limpiarFormulario();

        setMostrarFormulario(false);

        setMostrarResultados(false);

        return;
      }

      // ----------------------------------------------
      // NUEVO PRESUPUESTO
      // ----------------------------------------------

      // El código PRE-xxxxx NO se genera aquí.
      // Lo genera PostgreSQL mediante erp.crear_presupuesto().

      const response = await fetch("http://localhost:3000/api/presupuestos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solicitud_id: solicitudSeleccionada.id,
          observaciones: observaciones || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.mensaje || "No se pudo crear el presupuesto.");
      }

      console.log("PRESUPUESTO CREADO:", data.presupuesto);

      const presupuestoCreado = data.presupuesto;

      // ----------------------------------------------
      // GUARDAR DETALLES
      // ----------------------------------------------

      for (const concepto of conceptosValidos) {
        const cantidad = Number(concepto.cantidad) || 1;

        const precioUnitario = Number(concepto.precioUnitario) || 0;

        const descuentoPorcentaje = Number(concepto.descuento) || 0;

        // La BD espera el descuento como MONTO,
        // mientras que el frontend lo maneja como PORCENTAJE.

        const descuentoMonto =
          (cantidad * precioUnitario * descuentoPorcentaje) / 100;

        // ----------------------------------------------
        // TIPO DE ITEM
        // ----------------------------------------------

        const tipoItemMap = {
          Repuesto: "REPUESTO",
          "Mano de obra": "MANO_OBRA",
          Servicio: "SERVICIO",
          Otro: "OTRO",
        };

        const tipoItem = tipoItemMap[concepto.tipo] || "OTRO";

        // ----------------------------------------------
        // REPUESTOS
        // ----------------------------------------------

        if (tipoItem === "REPUESTO" && !concepto.productoId) {
          throw new Error(
            `El concepto "${concepto.descripcion}" es un repuesto, pero no tiene un producto asociado.`,
          );
        }

        const responseDetalle = await fetch(
          `http://localhost:3000/api/presupuestos/${presupuestoCreado.id}/detalles`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tipo_item: tipoItem,
              descripcion: concepto.descripcion,
              producto_id: tipoItem === "REPUESTO" ? concepto.productoId : null,
              almacen_id: tipoItem === "REPUESTO" ? concepto.almacenId : null,
              cantidad,
              precio_unitario: precioUnitario,
              descuento: descuentoMonto,
              observaciones: null,
            }),
          },
        );

        const dataDetalle = await responseDetalle.json();

        if (!responseDetalle.ok || !dataDetalle.ok) {
          throw new Error(
            dataDetalle.mensaje ||
              `No se pudo guardar el concepto "${concepto.descripcion}".`,
          );
        }
      }

      // ----------------------------------------------
      // RECARGAR PRESUPUESTOS DESDE LA BD
      // ----------------------------------------------

      await cargarPresupuestos();

      // ----------------------------------------------
      // MENSAJE
      // ----------------------------------------------

      alert(
        `Presupuesto ${presupuestoCreado.numero_presupuesto} creado correctamente.`,
      );

      // ----------------------------------------------
      // CERRAR
      // ----------------------------------------------

      limpiarFormulario();

      setMostrarFormulario(false);

      setMostrarResultados(false);
    } catch (error) {
      console.error("ERROR GUARDANDO PRESUPUESTO:", error);

      alert(error.message || "Ocurrió un error al guardar el presupuesto.");
    }
  };

  // ==================================================
  // APROBAR PRESUPUESTO
  // ==================================================

  const aprobarPresupuesto = async (presupuesto) => {
    const confirmar = window.confirm(
      `¿Desea aprobar el presupuesto ${presupuesto.codigoPresupuesto}?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/presupuestos/${presupuesto.id}/aprobar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            observaciones: presupuesto.observaciones || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.mensaje || "No se pudo aprobar el presupuesto.");
      }

      console.log("PRESUPUESTO APROBADO:", data);

      // Recargar ambas fuentes desde PostgreSQL
      await Promise.all([cargarPresupuestos(), cargarSolicitudes()]);

      alert(
        `El presupuesto ${presupuesto.codigoPresupuesto} fue aprobado correctamente.`,
      );
    } catch (error) {
      console.error("ERROR APROBANDO PRESUPUESTO:", error);

      alert(error.message || "Ocurrió un error al aprobar el presupuesto.");
    }
  };

  // ==================================================
  // RECHAZAR PRESUPUESTO
  // ==================================================

  const desaprobarPresupuesto = async (presupuesto) => {
    const confirmar = window.confirm(
      `¿Desea rechazar el presupuesto ${presupuesto.codigoPresupuesto}?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/presupuestos/${presupuesto.id}/desaprobar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            observaciones: presupuesto.observaciones || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.mensaje || "No se pudo rechazar el presupuesto.");
      }

      console.log("PRESUPUESTO RECHAZADO:", data);

      // Recargar ambas fuentes desde PostgreSQL
      await Promise.all([cargarPresupuestos(), cargarSolicitudes()]);

      alert(
        `El presupuesto ${presupuesto.codigoPresupuesto} fue rechazado correctamente.`,
      );
    } catch (error) {
      console.error("ERROR RECHAZANDO PRESUPUESTO:", error);

      alert(error.message || "Ocurrió un error al rechazar el presupuesto.");
    }
  };

  // ==================================================
  // EDITAR PRESUPUESTO
  // ==================================================

  const editarPresupuesto = (presupuesto) => {
    console.log("====================================");
    console.log("EDITANDO PRESUPUESTO");
    console.log("PRESUPUESTO:", presupuesto);
    console.log("====================================");

    const solicitud = solicitudes.find((s) => s.id === presupuesto.solicitudId);

    if (!solicitud) {
      alert(
        `No se encontró la orden de servicio ${presupuesto.codigoSolicitud}.`,
      );

      return;
    }

    setSolicitudSeleccionada(solicitud);

    // ==========================================
    // DATOS GENERALES
    // ==========================================

    setDiagnostico(presupuesto.diagnostico || "");

    setEstadoPresupuesto(presupuesto.estado || "Pendiente");

    setObservaciones(presupuesto.observaciones || "");

    setVigencia(presupuesto.vigencia ?? 7);

    setTiempoReparacion(presupuesto.tiempoReparacion || "");

    setGarantia(presupuesto.garantia || "");

    setFormaPago(presupuesto.formaPago || "Contado");

    setCondiciones(presupuesto.condiciones || "");

    // ==========================================
    // CONCEPTOS
    // ==========================================

    const conceptosBackend = Array.isArray(presupuesto.conceptos)
      ? presupuesto.conceptos
      : [];

    const conceptosMapeados = conceptosBackend.map((concepto, index) => ({
      ...concepto,
      id: concepto.id || `${presupuesto.id}-${index}-${Date.now()}`,
    }));

    // ==========================================
    // SI NO HAY DETALLES
    // ==========================================

    if (conceptosMapeados.length > 0) {
      setConceptos(conceptosMapeados);
    } else {
      setConceptos([
        {
          id: Date.now(),

          tipo: "Servicio",

          productoId: null,

          codigo: "",
          descripcion: "",
          modelo: "",

          almacenId: null,
          almacenCodigo: "",
          almacenNombre: "",
          stockDisponible: 0,

          cantidad: 1,

          unidad: "UND",

          moneda: "SOL",

          precioUnitario: 0,

          descuento: 0,
        },
      ]);
    }

    // ==========================================
    // MODO EDICIÓN
    // ==========================================

    setPresupuestoEditando(presupuesto);

    setModoEdicion(true);

    setMostrarFormulario(true);

    setMostrarResultados(false);
  };

  // ==================================================
  // ELIMINAR PRESUPUESTO
  // ==================================================

  const eliminarPresupuesto = (presupuesto) => {
    const confirmar = window.confirm(
      `¿Desea eliminar el presupuesto ${presupuesto.codigoPresupuesto}?`,
    );

    if (!confirmar) {
      return;
    }

    setPresupuestos(presupuestos.filter((p) => p.id !== presupuesto.id));
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="presupuestos-container">
      {/* ==================================================
                HEADER
            ================================================== */}

      <div className="presupuestos-header">
        <div>
          <h1>Presupuestos</h1>

          <p>Gestión de presupuestos del servicio técnico</p>
        </div>

        {!mostrarFormulario && (
          <button className="btn-nuevo-presupuesto" onClick={nuevoPresupuesto}>
            + Nuevo presupuesto
          </button>
        )}
      </div>

      {/* ==================================================
                FORMULARIO
            ================================================== */}

      {mostrarFormulario ? (
        <form className="presupuesto-form" onSubmit={guardarPresupuesto}>
          {/* ==========================================
                        HEADER FORMULARIO
                    ========================================== */}

          <div className="form-header">
            <div>
              <h2>
                {modoEdicion ? "Editar presupuesto" : "Nuevo presupuesto"}
              </h2>

              <p>Seleccione una orden de servicio para continuar</p>
            </div>

            <button
              type="button"
              className="btn-cerrar"
              onClick={cancelarFormulario}
            >
              ×
            </button>
          </div>

          {/* ==========================================
                        BUSCAR SOLICITUD
                    ========================================== */}

          {!modoEdicion && (
            <div className="buscar-solicitud">
              <h3>Buscar orden de servicio</h3>

              <div className="busqueda-presupuesto">
                <select value={tipoBusqueda} onChange={cambiarTipoBusqueda}>
                  <option value="orden">Orden de servicio</option>

                  <option value="fecha">Fecha de ingreso</option>

                  <option value="serie">Número de serie</option>

                  <option value="cliente">Cliente</option>
                </select>

                {tipoBusqueda === "orden" && (
                  <input
                    type="text"
                    placeholder="Ej. ST-000001"
                    value={busquedaSolicitud}
                    onChange={(e) => setBusquedaSolicitud(e.target.value)}
                    onKeyDown={manejarEnterOrden}
                  />
                )}

                {tipoBusqueda === "fecha" && (
                  <div className="rango-fechas">
                    <div className="campo-fecha">
                      <label>Desde</label>

                      <input
                        type="date"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                      />
                    </div>

                    <span>hasta</span>

                    <div className="campo-fecha">
                      <label>Hasta</label>

                      <input
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {(tipoBusqueda === "serie" || tipoBusqueda === "cliente") && (
                  <input
                    type="text"
                    placeholder={
                      tipoBusqueda === "serie"
                        ? "Ej. PF3ABC123"
                        : "Nombre del cliente"
                    }
                    value={busquedaSolicitud}
                    onChange={(e) => setBusquedaSolicitud(e.target.value)}
                  />
                )}

                <button type="button" onClick={buscarSolicitudes}>
                  Buscar
                </button>
              </div>

              {/* ======================================
                                RESULTADOS
                            ====================================== */}

              {mostrarResultados && (
                <div className="resultados-solicitudes">
                  {tipoBusqueda === "orden" && (
                    <div
                      style={{
                        padding: "12px 14px",
                        background: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      Órdenes abiertas disponibles para presupuesto
                    </div>
                  )}

                  {solicitudesFiltradas.length === 0 ? (
                    <div className="sin-resultados">
                      No hay órdenes disponibles para presupuesto.
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Orden</th>

                          <th>Fecha</th>

                          <th>Cliente</th>

                          <th>Equipo</th>

                          <th>Serie</th>

                          <th>Estado</th>

                          <th>Acción</th>
                        </tr>
                      </thead>

                      <tbody>
                        {solicitudesFiltradas.map((solicitud) => (
                          <tr key={solicitud.id}>
                            <td>
                              <strong>{solicitud.codigoSolicitud}</strong>
                            </td>

                            <td>{formatearFecha(solicitud.fechaIngreso)}</td>

                            <td>{solicitud.cliente}</td>

                            <td>
                              {solicitud.equipo}
                              {" - "}
                              {solicitud.marca}
                            </td>

                            <td>{solicitud.numeroSerie}</td>

                            <td>{solicitud.estado}</td>

                            <td>
                              <button
                                type="button"
                                className="btn-seleccionar"
                                onClick={() => seleccionarSolicitud(solicitud)}
                              >
                                Seleccionar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==================================================
                        SOLICITUD SELECCIONADA
                    ================================================== */}

          {solicitudSeleccionada && (
            <div className="solicitud-seleccionada">
              <div className="solicitud-seleccionada-header">
                <div>
                  <span>Orden de servicio</span>

                  <strong>{solicitudSeleccionada.codigoSolicitud}</strong>
                </div>

                {!modoEdicion && (
                  <button
                    type="button"
                    onClick={() => {
                      setSolicitudSeleccionada(null);

                      setBusquedaSolicitud("");

                      setMostrarResultados(true);
                    }}
                  >
                    Cambiar orden
                  </button>
                )}
              </div>

              <div className="datos-solicitud">
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
                  <span>Fecha de ingreso</span>

                  <strong>
                    {formatearFecha(solicitudSeleccionada.fechaIngreso)}
                  </strong>
                </div>

                <div>
                  <span>Equipo</span>

                  <strong>{solicitudSeleccionada.equipo}</strong>
                </div>

                <div>
                  <span>Marca</span>

                  <strong>{solicitudSeleccionada.marca}</strong>
                </div>

                <div>
                  <span>Modelo</span>

                  <strong>{solicitudSeleccionada.modelo}</strong>
                </div>

                <div>
                  <span>Número de serie</span>

                  <strong>{solicitudSeleccionada.numeroSerie}</strong>
                </div>

                <div>
                  <span>Estado</span>

                  <strong>{solicitudSeleccionada.estado}</strong>
                </div>

                <div>
                  <span>Problema reportado</span>

                  <strong>{solicitudSeleccionada.problemaReportado}</strong>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
                        DATOS DEL PRESUPUESTO
                    ================================================== */}

          {solicitudSeleccionada && (
            <>
              {/* ==========================================
                                DIAGNÓSTICO
                            ========================================== */}

              <div className="form-section">
                <h3>Diagnóstico y estado</h3>

                <div className="form-grid">
                  <div className="campo">
                    <label>Diagnóstico</label>

                    <textarea
                      rows="4"
                      value={diagnostico}
                      onChange={(e) => setDiagnostico(e.target.value)}
                      placeholder="Ingrese el diagnóstico técnico..."
                    />
                  </div>

                  <div className="campo">
                    <label>Estado del presupuesto</label>

                    <select
                      value={estadoPresupuesto}
                      disabled
                      onChange={(e) => setEstadoPresupuesto(e.target.value)}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ==========================================
                                DETALLE ECONÓMICO
                            ========================================== */}

              <div className="form-section">
                <div className="detalle-header">
                  <h3>Detalle del presupuesto</h3>

                  <button
                    type="button"
                    className="btn-agregar-concepto"
                    onClick={agregarConcepto}
                  >
                    + Agregar concepto
                  </button>
                </div>

                <div className="conceptos-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Tipo</th>

                        <th>Código</th>

                        <th>Descripción</th>

                        <th>Cantidad</th>

                        <th>Unidad</th>

                        <th>Precio unitario</th>

                        <th>Descuento</th>

                        <th>Importe</th>

                        <th>Acción</th>
                      </tr>
                    </thead>

                    <tbody>
                      {conceptos.map((concepto) => {
                        const subtotal =
                          Number(concepto.cantidad || 0) *
                          Number(concepto.precioUnitario || 0);

                        const descuento =
                          (subtotal * Number(concepto.descuento || 0)) / 100;

                        const importe = subtotal - descuento;

                        return (
                          <tr key={concepto.id}>
                            <td>
                              <select
                                value={concepto.tipo}
                                onChange={(e) =>
                                  actualizarConcepto(
                                    concepto.id,
                                    "tipo",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="Servicio">Servicio</option>

                                <option value="Repuesto">Repuesto</option>

                                <option value="Mano de obra">
                                  Mano de obra
                                </option>

                                <option value="Otro">Otro</option>
                              </select>
                            </td>

                            <td>
                              {concepto.tipo === "Repuesto" ? (
                                <input
                                  type="text"
                                  value={concepto.codigo || ""}
                                  placeholder="Código del repuesto"
                                  readOnly
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      abrirModalRepuestos(concepto.id);
                                    }
                                  }}
                                  onClick={() =>
                                    abrirModalRepuestos(concepto.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "#f9fafb",
                                  }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={concepto.codigo}
                                  onChange={(e) =>
                                    actualizarConcepto(
                                      concepto.id,
                                      "codigo",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Código"
                                />
                              )}
                            </td>

                            <td>
                              {concepto.tipo === "Repuesto" ? (
                                <input
                                  type="text"
                                  value={concepto.descripcion || ""}
                                  placeholder="Descripción del repuesto"
                                  readOnly
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      abrirModalRepuestos(concepto.id);
                                    }
                                  }}
                                  onClick={() =>
                                    abrirModalRepuestos(concepto.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "#f9fafb",
                                  }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={concepto.descripcion}
                                  onChange={(e) =>
                                    actualizarConcepto(
                                      concepto.id,
                                      "descripcion",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Descripción del concepto"
                                />
                              )}
                            </td>

                            <td>
                              <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={concepto.cantidad}
                                onChange={(e) =>
                                  actualizarConcepto(
                                    concepto.id,
                                    "cantidad",
                                    e.target.value,
                                  )
                                }
                              />
                            </td>

                            <td>
                              {concepto.tipo === "Repuesto" ? (
                                <input
                                  type="text"
                                  value={concepto.unidad || ""}
                                  readOnly
                                />
                              ) : (
                                <select
                                  value={concepto.unidad}
                                  onChange={(e) =>
                                    actualizarConcepto(
                                      concepto.id,
                                      "unidad",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="UND">UND</option>
                                  <option value="HORA">HORA</option>
                                  <option value="SERVICIO">SERVICIO</option>
                                  <option value="PAR">PAR</option>
                                  <option value="KIT">KIT</option>
                                </select>
                              )}
                            </td>

                            <td>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={concepto.precioUnitario}
                                onChange={(e) =>
                                  actualizarConcepto(
                                    concepto.id,
                                    "precioUnitario",
                                    e.target.value,
                                  )
                                }
                              />
                            </td>

                            <td>
                              <div className="campo-descuento">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  value={concepto.descuento}
                                  onChange={(e) =>
                                    actualizarConcepto(
                                      concepto.id,
                                      "descuento",
                                      e.target.value,
                                    )
                                  }
                                />

                                <span>%</span>
                              </div>
                            </td>

                            <td>
                              <strong>
                                {concepto.moneda === "DOL" ? "$" : "S/"}{" "}
                                {importe.toFixed(2)}
                              </strong>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="btn-eliminar-concepto"
                                onClick={() => eliminarConcepto(concepto.id)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ======================================
                                    RESUMEN ECONÓMICO
                                ====================================== */}

                <div className="resumen-presupuesto">
                  <div className="resumen-linea">
                    <span>Subtotal</span>

                    <strong>S/ {calcularSubtotal().toFixed(2)}</strong>
                  </div>

                  <div className="resumen-linea">
                    <span>Descuento</span>

                    <strong>- S/ {calcularDescuento().toFixed(2)}</strong>
                  </div>

                  <div className="resumen-linea">
                    <span>IGV (18%)</span>

                    <strong>S/ {calcularIGV().toFixed(2)}</strong>
                  </div>

                  <div className="resumen-linea resumen-total">
                    <span>Total</span>

                    <strong>S/ {calcularTotal().toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* ==========================================
                                OBSERVACIONES
                            ========================================== */}

              <div className="form-section">
                <div className="campo">
                  <label>Observaciones</label>

                  <textarea
                    rows="4"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Ingrese observaciones adicionales..."
                  />
                </div>
              </div>
              {/* CONDICIONES COMERCIALES Y TÉCNICAS */}

              <div className="form-section">
                <div className="detalle-header">
                  <div>
                    <h3>Condiciones comerciales y técnicas</h3>

                    <p>
                      Defina las condiciones bajo las cuales se presenta el
                      presupuesto.
                    </p>
                  </div>
                </div>

                <div className="form-grid condiciones-grid">
                  {/* VIGENCIA */}

                  <div className="campo">
                    <label>Vigencia del presupuesto</label>

                    <div className="campo-con-sufijo">
                      <input
                        type="number"
                        min="1"
                        value={vigencia}
                        onChange={(e) => setVigencia(Number(e.target.value))}
                      />

                      <span>días</span>
                    </div>

                    <small>
                      Tiempo durante el cual se mantiene el precio ofrecido.
                    </small>
                  </div>

                  {/* TIEMPO DE REPARACIÓN */}

                  <div className="campo">
                    <label>Tiempo estimado de reparación</label>

                    <select
                      value={tiempoReparacion}
                      onChange={(e) => setTiempoReparacion(e.target.value)}
                    >
                      <option value="">Seleccionar</option>

                      <option value="1 día">1 día</option>

                      <option value="2 días">2 días</option>

                      <option value="3 días">3 días</option>

                      <option value="5 días">5 días</option>

                      <option value="7 días">7 días</option>

                      <option value="10 días">10 días</option>

                      <option value="15 días">15 días</option>

                      <option value="Por confirmar">Por confirmar</option>
                    </select>
                  </div>

                  {/* GARANTÍA */}

                  <div className="campo">
                    <label>Garantía del servicio</label>

                    <select
                      value={garantia}
                      onChange={(e) => setGarantia(e.target.value)}
                    >
                      <option value="">Seleccionar</option>

                      <option value="Sin garantía">Sin garantía</option>

                      <option value="7 días">7 días</option>

                      <option value="15 días">15 días</option>

                      <option value="30 días">30 días</option>

                      <option value="60 días">60 días</option>

                      <option value="90 días">90 días</option>

                      <option value="6 meses">6 meses</option>

                      <option value="1 año">1 año</option>
                    </select>
                  </div>

                  {/* FORMA DE PAGO */}

                  <div className="campo">
                    <label>Forma de pago</label>

                    <select
                      value={formaPago}
                      onChange={(e) => setFormaPago(e.target.value)}
                    >
                      <option value="Contado">Contado</option>

                      <option value="Adelanto 50%">Adelanto 50%</option>

                      <option value="Adelanto 100%">Adelanto 100%</option>

                      <option value="Contra entrega">Contra entrega</option>

                      <option value="Crédito 15 días">Crédito 15 días</option>

                      <option value="Crédito 30 días">Crédito 30 días</option>
                    </select>
                  </div>
                </div>

                {/* CONDICIONES */}

                <div className="campo">
                  <label>Condiciones adicionales</label>

                  <textarea
                    rows="4"
                    value={condiciones}
                    onChange={(e) => setCondiciones(e.target.value)}
                    placeholder="Ej. El diagnóstico definitivo podrá variar si durante la reparación se detectan fallas adicionales..."
                  />
                </div>
              </div>

              {/* ==========================================
                                ACCIONES
                            ========================================== */}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cancelarFormulario}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-guardar">
                  {modoEdicion
                    ? "Actualizar presupuesto"
                    : "Guardar presupuesto"}
                </button>
              </div>
            </>
          )}
        </form>
      ) : (
        /* ==================================================
                   LISTADO PRINCIPAL
                ================================================== */

        <>
          {/* ==========================================
                        FILTROS
                    ========================================== */}

          <div className="presupuestos-filtros">
            <input
              type="text"
              placeholder="Buscar presupuesto, orden, cliente o serie..."
              value={busquedaPresupuesto}
              onChange={(e) => setBusquedaPresupuesto(e.target.value)}
            />

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>

              <option value="Pendiente">Pendiente</option>

              <option value="Aprobado">Aprobado</option>

              <option value="Rechazado">Rechazado</option>
            </select>
          </div>

          {/* ==========================================
                        TABLA
                    ========================================== */}

          <div className="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>Presupuesto</th>

                  <th>Orden</th>

                  <th>Fecha</th>

                  <th>Cliente</th>

                  <th>Serie</th>

                  <th>Total</th>

                  <th>Estado</th>

                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargandoPresupuestos ? (
                  <tr>
                    <td colSpan="8" className="tabla-vacia">
                      Cargando presupuestos...
                    </td>
                  </tr>
                ) : presupuestosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="tabla-vacia">
                      No hay presupuestos registrados.
                    </td>
                  </tr>
                ) : (
                  presupuestosFiltrados.map((presupuesto) => (
                    <tr key={presupuesto.id}>
                      <td>
                        <strong className="codigo-presupuesto">
                          {presupuesto.codigoPresupuesto}
                        </strong>
                      </td>

                      <td>{presupuesto.codigoSolicitud}</td>

                      <td>{formatearFecha(presupuesto.fecha)}</td>

                      <td>{presupuesto.cliente}</td>

                      <td>{presupuesto.numeroSerie}</td>

                      <td>S/ {Number(presupuesto.total).toFixed(2)}</td>

                      <td>
                        <span
                          className={`estado-presupuesto estado-${presupuesto.estado.toLowerCase()}`}
                        >
                          {presupuesto.estado}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn-accion"
                          title="Editar"
                          onClick={() => editarPresupuesto(presupuesto)}
                        >
                          Editar
                        </button>

                        {presupuesto.estado === "Pendiente" && (
                          <>
                            <button
                              type="button"
                              className="btn-accion"
                              title="Aprobar"
                              onClick={() => aprobarPresupuesto(presupuesto)}
                            >
                              Aprobar
                            </button>

                            <button
                              type="button"
                              className="btn-accion"
                              title="Rechazar"
                              onClick={() => desaprobarPresupuesto(presupuesto)}
                            >
                              Rechazar
                            </button>
                          </>
                        )}

                        <button
                          className="btn-accion"
                          title="Eliminar"
                          onClick={() => eliminarPresupuesto(presupuesto)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* ==================================================
          MODAL SELECCIONAR REPUESTO
      ================================================== */}

      {mostrarModalRepuestos && (
        <div className="modal-overlay" onClick={cerrarModalRepuestos}>
          <div className="detalle-modal" onClick={(e) => e.stopPropagation()}>
            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="detalle-header">
              <div>
                <h2>Seleccionar repuesto</h2>

                <p>
                  Busque el repuesto por código o descripción y seleccione el
                  almacén de origen.
                </p>
              </div>

              <button
                type="button"
                className="btn-cerrar"
                onClick={cerrarModalRepuestos}
              >
                ✕
              </button>
            </div>

            {/* ==========================================
                BÚSQUEDA
            ========================================== */}

            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={busquedaRepuestoModal}
                  onChange={(e) => buscarProductosModal(e.target.value)}
                  placeholder="Código o descripción del repuesto..."
                  autoFocus
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                  }}
                />

                <button
                  type="button"
                  className="btn-seleccionar"
                  onClick={() => buscarProductosModal(busquedaRepuestoModal)}
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* ==========================================
                CUERPO
            ========================================== */}

            <div className="detalle-body">
              {cargandoProductosModal ? (
                <div className="sin-resultados">Buscando repuestos...</div>
              ) : busquedaRepuestoModal.trim().length < 2 ? (
                <div className="sin-resultados">
                  Ingrese al menos 2 caracteres para buscar.
                </div>
              ) : productosModal.length === 0 ? (
                <div className="sin-resultados">
                  No se encontraron repuestos.
                </div>
              ) : (
                productosModal.map((producto) => (
                  <div
                    key={producto.id}
                    className="detalle-card"
                    style={{
                      marginBottom: "16px",
                    }}
                  >
                    {/* ==================================
                        DATOS DEL PRODUCTO
                    ================================== */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "15px",
                      }}
                    >
                      <div>
                        <span>Código</span>

                        <strong>{producto.codigo}</strong>
                      </div>

                      <div>
                        <span>Descripción</span>

                        <strong>{producto.descripcion}</strong>
                      </div>

                      <div>
                        <span>Modelo</span>

                        <strong>{producto.modelo || "-"}</strong>
                      </div>

                      <div>
                        <span>Precio</span>

                        <strong>
                          {producto.moneda === "DOL" ? "$" : "S/"}{" "}
                          {Number(producto.precio_sin_igv || 0).toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* ==================================
                        ALMACENES
                    ================================== */}

                    <div>
                      <h4>Disponibilidad por almacén</h4>

                      {producto.almacenes && producto.almacenes.length > 0 ? (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "12px",
                            marginTop: "15px",
                          }}
                        >
                          {producto.almacenes.map((almacen) => (
                            <div
                              key={almacen.almacen_id}
                              style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                padding: "14px",
                                background: "#f9fafb",
                              }}
                            >
                              <strong>{almacen.nombre}</strong>

                              <div
                                style={{
                                  marginTop: "8px",
                                  fontSize: "13px",
                                  color: "#6b7280",
                                }}
                              >
                                Código: {almacen.codigo || "-"}
                              </div>

                              <div
                                style={{
                                  marginTop: "6px",
                                }}
                              >
                                Stock disponible:
                                <strong
                                  style={{
                                    marginLeft: "5px",
                                  }}
                                >
                                  {almacen.disponible}
                                </strong>
                              </div>

                              <button
                                type="button"
                                className="btn-seleccionar"
                                style={{
                                  width: "100%",
                                  marginTop: "12px",
                                }}
                                disabled={Number(almacen.disponible) <= 0}
                                onClick={() =>
                                  seleccionarProductoDesdeModal(
                                    producto,
                                    almacen,
                                  )
                                }
                              >
                                {Number(almacen.disponible) > 0
                                  ? "Seleccionar"
                                  : "Sin stock"}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="sin-resultados">
                          No hay información de almacenes para este producto.
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ==========================================
                FOOTER
            ========================================== */}

            <div className="detalle-footer">
              <button
                type="button"
                className="btn-cancelar"
                onClick={cerrarModalRepuestos}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Presupuestos;
