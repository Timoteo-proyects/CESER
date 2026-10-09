import { useState } from "react";
import "./ordenesReparacion.css";

// ======================================================
// SOLICITUDES DISPONIBLES
// ======================================================

const SOLICITUDES_EJEMPLO = [
    {
        id: 1,
        codigoSolicitud: "ST-000001",
        codigoPresupuesto: "PRES-000001",
        fechaIngreso: "2026-09-20",
        cliente: "Juan Pérez",
        tipoDocumento: "DNI",
        numeroDocumento: "12345678",
        telefono: "999888777",
        correo: "juan.perez@email.com",
        equipo: "Laptop",
        marca: "Lenovo",
        modelo: "ThinkPad E14",
        numeroSerie: "PF3ABC123",
        codigoInterno: "EQ-000145",
        problemaReportado: "La laptop no enciende",
        accesorios: "Cargador original",
        estadoFisico: "Bueno",
        diagnostico:
            "Se detecta falla en la unidad de almacenamiento. El equipo presenta errores de lectura.",
        estado: "Presupuesto aprobado"
    },
    {
        id: 2,
        codigoSolicitud: "ST-000002",
        codigoPresupuesto: "PRES-000002",
        fechaIngreso: "2026-09-21",
        cliente: "Empresa ABC S.A.C.",
        tipoDocumento: "RUC",
        numeroDocumento: "20123456789",
        telefono: "014445555",
        correo: "contacto@empresaabc.com",
        equipo: "PC",
        marca: "HP",
        modelo: "ProDesk 400",
        numeroSerie: "HP778899",
        codigoInterno: "EQ-000146",
        problemaReportado: "No inicia el sistema operativo",
        accesorios: "Cable de poder",
        estadoFisico: "Regular",
        diagnostico:
            "Se detecta daño en el sistema operativo y sectores defectuosos en el disco.",
        estado: "Presupuesto aprobado"
    },
    {
        id: 3,
        codigoSolicitud: "ST-000003",
        codigoPresupuesto: "PRES-000003",
        fechaIngreso: "2026-09-22",
        cliente: "Carlos López",
        tipoDocumento: "DNI",
        numeroDocumento: "45678912",
        telefono: "988777666",
        correo: "carlos.lopez@email.com",
        equipo: "Laptop",
        marca: "HP",
        modelo: "250 G8",
        numeroSerie: "HP250123",
        codigoInterno: "EQ-000147",
        problemaReportado: "Se apaga después de unos minutos",
        accesorios: "Cargador",
        estadoFisico: "Bueno",
        diagnostico:
            "Se detecta sobrecalentamiento debido a acumulación de polvo y pasta térmica degradada.",
        estado: "Presupuesto aprobado"
    }
];

// ======================================================
// TÉCNICOS
// ======================================================

const TECNICOS_EJEMPLO = [
    {
        id: 1,
        nombre: "Carlos Mendoza",
        especialidad: "Hardware"
    },
    {
        id: 2,
        nombre: "Luis Ramírez",
        especialidad: "Software"
    },
    {
        id: 3,
        nombre: "Miguel Torres",
        especialidad: "Electrónica"
    }
];

// ======================================================
// COMPONENTE
// ======================================================

function OrdenesReparacion() {

    // ==================================================
    // ESTADOS GENERALES
    // ==================================================

    const [solicitudes] =
        useState(SOLICITUDES_EJEMPLO);

    const [tecnicos] =
        useState(TECNICOS_EJEMPLO);

    const [ordenes, setOrdenes] =
        useState([]);

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [modoEdicion, setModoEdicion] =
        useState(false);

    const [ordenEditando, setOrdenEditando] =
        useState(null);

    // ==================================================
    // BÚSQUEDA DE SOLICITUD
    // ==================================================

    const [tipoBusqueda, setTipoBusqueda] =
        useState("orden");

    const [busquedaSolicitud, setBusquedaSolicitud] =
        useState("");

    const [mostrarResultados, setMostrarResultados] =
        useState(false);

    const [solicitudSeleccionada, setSolicitudSeleccionada] =
        useState(null);

    // ==================================================
    // DATOS DE LA ORDEN
    // ==================================================

    const [prioridad, setPrioridad] =
        useState("Normal");

    const [estadoOrden, setEstadoOrden] =
        useState("Pendiente");

    const [fechaInicio, setFechaInicio] =
        useState("");

    const [fechaEntregaEstimada, setFechaEntregaEstimada] =
        useState("");

    // ==================================================
    // ASIGNACIÓN
    // ==================================================

    const [tecnicoResponsable, setTecnicoResponsable] =
        useState("");

    const [tecnicoAuxiliar, setTecnicoAuxiliar] =
        useState("");

    const [estacionTrabajo, setEstacionTrabajo] =
        useState("");

    // ==================================================
    // TRABAJO
    // ==================================================

    const [diagnosticoConfirmado, setDiagnosticoConfirmado] =
        useState("");

    const [causaFalla, setCausaFalla] =
        useState("");

    const [trabajoRealizar, setTrabajoRealizar] =
        useState("");

    // ==================================================
    // REPUESTOS
    // ==================================================

    const [repuestos, setRepuestos] =
        useState([
            {
                id: 1,
                codigo: "",
                descripcion: "",
                cantidad: 1,
                estado: "Pendiente"
            }
        ]);

    // ==================================================
    // ACTIVIDADES
    // ==================================================

    const [actividades, setActividades] =
        useState([]);

    const [nuevaActividad, setNuevaActividad] =
        useState("");

    // ==================================================
    // CONTROL DE CALIDAD
    // ==================================================

    const [checklist, setChecklist] =
        useState([
            {
                id: 1,
                descripcion: "Equipo enciende correctamente",
                completado: false
            },
            {
                id: 2,
                descripcion: "Pantalla funciona correctamente",
                completado: false
            },
            {
                id: 3,
                descripcion: "Teclado funciona correctamente",
                completado: false
            },
            {
                id: 4,
                descripcion: "Touchpad funciona correctamente",
                completado: false
            },
            {
                id: 5,
                descripcion: "Puertos USB funcionan",
                completado: false
            },
            {
                id: 6,
                descripcion: "Wi-Fi funciona correctamente",
                completado: false
            },
            {
                id: 7,
                descripcion: "Audio funciona correctamente",
                completado: false
            },
            {
                id: 8,
                descripcion: "Cargador funciona correctamente",
                completado: false
            }
        ]);

    const [resultadoCalidad, setResultadoCalidad] =
        useState("Pendiente");

    const [observacionesCalidad, setObservacionesCalidad] =
        useState("");

    // ==================================================
    // CIERRE
    // ==================================================

    const [resultadoReparacion, setResultadoReparacion] =
        useState("Pendiente");

    const [observacionesFinales, setObservacionesFinales] =
        useState("");

    // ==================================================
    // FILTROS DEL LISTADO
    // ==================================================

    const [busquedaOrden, setBusquedaOrden] =
        useState("");

    const [filtroEstado, setFiltroEstado] =
        useState("Todos");

    const [filtroPrioridad, setFiltroPrioridad] =
        useState("Todas");

    // ==================================================
    // FORMATEAR FECHA
    // ==================================================

    const formatearFecha = fecha => {

        if (!fecha) {
            return "";
        }

        const [anio, mes, dia] =
            fecha.split("-");

        return `${dia}/${mes}/${anio.slice(2)}`;
    };

    // ==================================================
    // GENERAR CÓDIGO
    // ==================================================

    const generarCodigoOrden = () => {

        if (ordenes.length === 0) {
            return "OR-000001";
        }

        const numeros =
            ordenes.map(orden => {

                const numero =
                    orden.codigoOrden
                        .replace("OR-", "");

                return parseInt(numero, 10) || 0;
            });

        const mayor =
            Math.max(...numeros);

        return `OR-${String(mayor + 1).padStart(6, "0")}`;
    };

    // ==================================================
    // FILTRAR SOLICITUDES
    // ==================================================

    const solicitudesFiltradas =
        solicitudes.filter(solicitud => {

            const yaTieneOrden =
                ordenes.some(
                    orden =>
                        orden.codigoSolicitud ===
                        solicitud.codigoSolicitud
                );

            if (yaTieneOrden && !modoEdicion) {
                return false;
            }

            const texto =
                busquedaSolicitud
                    .toLowerCase()
                    .trim();

            if (!texto) {
                return true;
            }

            switch (tipoBusqueda) {

                case "orden":

                    return solicitud.codigoSolicitud
                        .toLowerCase()
                        .includes(texto);

                case "serie":

                    return solicitud.numeroSerie
                        .toLowerCase()
                        .includes(texto);

                case "cliente":

                    return solicitud.cliente
                        .toLowerCase()
                        .includes(texto);

                default:

                    return true;
            }
        });

    // ==================================================
    // FILTRAR ORDENES
    // ==================================================

    const ordenesFiltradas =
        ordenes.filter(orden => {

            const texto =
                busquedaOrden
                    .toLowerCase()
                    .trim();

            const coincideTexto =
                !texto ||
                orden.codigoOrden
                    .toLowerCase()
                    .includes(texto) ||
                orden.codigoSolicitud
                    .toLowerCase()
                    .includes(texto) ||
                orden.cliente
                    .toLowerCase()
                    .includes(texto) ||
                orden.numeroSerie
                    .toLowerCase()
                    .includes(texto);

            const coincideEstado =
                filtroEstado === "Todos" ||
                orden.estado === filtroEstado;

            const coincidePrioridad =
                filtroPrioridad === "Todas" ||
                orden.prioridad === filtroPrioridad;

            return (
                coincideTexto &&
                coincideEstado &&
                coincidePrioridad
            );
        });

    // ==================================================
    // BUSCAR SOLICITUD
    // ==================================================

    const buscarSolicitudes = () => {

        setMostrarResultados(true);
    };

    // ==================================================
    // SELECCIONAR SOLICITUD
    // ==================================================

    const seleccionarSolicitud = solicitud => {

        setSolicitudSeleccionada(
            solicitud
        );

        setBusquedaSolicitud(
            solicitud.codigoSolicitud
        );

        setDiagnosticoConfirmado(
            solicitud.diagnostico
        );

        setMostrarResultados(false);
    };

    // ==================================================
    // CAMBIAR TIPO DE BÚSQUEDA
    // ==================================================

    const cambiarTipoBusqueda = event => {

        setTipoBusqueda(
            event.target.value
        );

        setBusquedaSolicitud("");

        setMostrarResultados(false);

        setSolicitudSeleccionada(null);
    };

    // ==================================================
    // AGREGAR REPUESTO
    // ==================================================

    const agregarRepuesto = () => {

        setRepuestos([
            ...repuestos,
            {
                id: Date.now(),
                codigo: "",
                descripcion: "",
                cantidad: 1,
                estado: "Pendiente"
            }
        ]);
    };

    // ==================================================
    // ACTUALIZAR REPUESTO
    // ==================================================

    const actualizarRepuesto =
        (id, campo, valor) => {

            setRepuestos(
                repuestos.map(repuesto => {

                    if (
                        repuesto.id !== id
                    ) {
                        return repuesto;
                    }

                    return {
                        ...repuesto,
                        [campo]:
                            campo === "cantidad"
                                ? Number(valor)
                                : valor
                    };
                })
            );
        };

    // ==================================================
    // ELIMINAR REPUESTO
    // ==================================================

    const eliminarRepuesto = id => {

        setRepuestos(
            repuestos.filter(
                repuesto =>
                    repuesto.id !== id
            )
        );
    };

    // ==================================================
    // AGREGAR ACTIVIDAD
    // ==================================================

    const agregarActividad = () => {

        const texto =
            nuevaActividad.trim();

        if (!texto) {
            return;
        }

        const actividad = {

            id:
                crypto.randomUUID(),

            fecha:
                new Date()
                    .toISOString()
                    .split("T")[0],

            hora:
                new Date()
                    .toLocaleTimeString(
                        "es-PE",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),

            tecnico:
                tecnicos.find(
                    tecnico =>
                        String(tecnico.id) ===
                        String(tecnicoResponsable)
                )?.nombre || "Sin asignar",

            descripcion:
                texto
        };

        setActividades([
            ...actividades,
            actividad
        ]);

        setNuevaActividad("");
    };

    // ==================================================
    // ELIMINAR ACTIVIDAD
    // ==================================================

    const eliminarActividad = id => {

        setActividades(
            actividades.filter(
                actividad =>
                    actividad.id !== id
            )
        );
    };

    // ==================================================
    // CHECKLIST
    // ==================================================

    const cambiarChecklist = id => {

        setChecklist(
            checklist.map(item => {

                if (item.id !== id) {
                    return item;
                }

                return {
                    ...item,
                    completado:
                        !item.completado
                };
            })
        );
    };

    // ==================================================
    // LIMPIAR FORMULARIO
    // ==================================================

    const limpiarFormulario = () => {

        setSolicitudSeleccionada(null);

        setBusquedaSolicitud("");

        setPrioridad("Normal");

        setEstadoOrden("Pendiente");

        setFechaInicio("");

        setFechaEntregaEstimada("");

        setTecnicoResponsable("");

        setTecnicoAuxiliar("");

        setEstacionTrabajo("");

        setDiagnosticoConfirmado("");

        setCausaFalla("");

        setTrabajoRealizar("");

        setRepuestos([
            {
                id: 1,
                codigo: "",
                descripcion: "",
                cantidad: 1,
                estado: "Pendiente"
            }
        ]);

        setActividades([]);

        setNuevaActividad("");

        setChecklist([
            {
                id: 1,
                descripcion: "Equipo enciende correctamente",
                completado: false
            },
            {
                id: 2,
                descripcion: "Pantalla funciona correctamente",
                completado: false
            },
            {
                id: 3,
                descripcion: "Teclado funciona correctamente",
                completado: false
            },
            {
                id: 4,
                descripcion: "Touchpad funciona correctamente",
                completado: false
            },
            {
                id: 5,
                descripcion: "Puertos USB funcionan",
                completado: false
            },
            {
                id: 6,
                descripcion: "Wi-Fi funciona correctamente",
                completado: false
            },
            {
                id: 7,
                descripcion: "Audio funciona correctamente",
                completado: false
            },
            {
                id: 8,
                descripcion: "Cargador funciona correctamente",
                completado: false
            }
        ]);

        setResultadoCalidad("Pendiente");

        setObservacionesCalidad("");

        setResultadoReparacion("Pendiente");

        setObservacionesFinales("");

        setModoEdicion(false);

        setOrdenEditando(null);
    };

    // ==================================================
    // NUEVA ORDEN
    // ==================================================

    const nuevaOrden = () => {

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
    // GUARDAR ORDEN
    // ==================================================

    const guardarOrden = event => {

        event.preventDefault();

        if (!solicitudSeleccionada) {

            alert(
                "Debe seleccionar una orden de servicio."
            );

            return;
        }

        if (!tecnicoResponsable) {

            alert(
                "Debe asignar un técnico responsable."
            );

            return;
        }

        if (!trabajoRealizar.trim()) {

            alert(
                "Debe indicar el trabajo a realizar."
            );

            return;
        }

        const nuevaOrdenData = {

            id:
                ordenEditando?.id ||
                crypto.randomUUID(),

            codigoOrden:
                ordenEditando?.codigoOrden ||
                generarCodigoOrden(),

            codigoSolicitud:
                solicitudSeleccionada
                    .codigoSolicitud,

            codigoPresupuesto:
                solicitudSeleccionada
                    .codigoPresupuesto,

            fechaCreacion:
                ordenEditando?.fechaCreacion ||
                new Date()
                    .toISOString()
                    .split("T")[0],

            fechaInicio,

            fechaEntregaEstimada,

            cliente:
                solicitudSeleccionada
                    .cliente,

            tipoDocumento:
                solicitudSeleccionada
                    .tipoDocumento,

            numeroDocumento:
                solicitudSeleccionada
                    .numeroDocumento,

            telefono:
                solicitudSeleccionada
                    .telefono,

            correo:
                solicitudSeleccionada
                    .correo,

            equipo:
                solicitudSeleccionada
                    .equipo,

            marca:
                solicitudSeleccionada
                    .marca,

            modelo:
                solicitudSeleccionada
                    .modelo,

            numeroSerie:
                solicitudSeleccionada
                    .numeroSerie,

            codigoInterno:
                solicitudSeleccionada
                    .codigoInterno,

            accesorios:
                solicitudSeleccionada
                    .accesorios,

            estadoFisico:
                solicitudSeleccionada
                    .estadoFisico,

            prioridad,

            estado:
                estadoOrden,

            diagnosticoConfirmado,

            causaFalla,

            trabajoRealizar,

            tecnicoResponsable,

            tecnicoAuxiliar,

            estacionTrabajo,

            repuestos,

            actividades,

            checklist,

            resultadoCalidad,

            observacionesCalidad,

            resultadoReparacion,

            observacionesFinales
        };

        if (modoEdicion) {

            setOrdenes(
                ordenes.map(orden =>
                    orden.id ===
                    ordenEditando.id
                        ? nuevaOrdenData
                        : orden
                )
            );

            alert(
                "Orden de reparación actualizada correctamente."
            );

        } else {

            setOrdenes([
                ...ordenes,
                nuevaOrdenData
            ]);

            alert(
                "Orden de reparación creada correctamente."
            );
        }

        limpiarFormulario();

        setMostrarFormulario(false);

        setMostrarResultados(false);
    };

    // ==================================================
    // EDITAR
    // ==================================================

    const editarOrden = orden => {

        const solicitud =
            solicitudes.find(
                solicitud =>
                    solicitud.codigoSolicitud ===
                    orden.codigoSolicitud
            );

        if (!solicitud) {
            return;
        }

        setSolicitudSeleccionada(
            solicitud
        );

        setPrioridad(
            orden.prioridad
        );

        setEstadoOrden(
            orden.estado
        );

        setFechaInicio(
            orden.fechaInicio || ""
        );

        setFechaEntregaEstimada(
            orden.fechaEntregaEstimada || ""
        );

        setTecnicoResponsable(
            orden.tecnicoResponsable || ""
        );

        setTecnicoAuxiliar(
            orden.tecnicoAuxiliar || ""
        );

        setEstacionTrabajo(
            orden.estacionTrabajo || ""
        );

        setDiagnosticoConfirmado(
            orden.diagnosticoConfirmado || ""
        );

        setCausaFalla(
            orden.causaFalla || ""
        );

        setTrabajoRealizar(
            orden.trabajoRealizar || ""
        );

        setRepuestos(
            orden.repuestos || []
        );

        setActividades(
            orden.actividades || []
        );

        setChecklist(
            orden.checklist || []
        );

        setResultadoCalidad(
            orden.resultadoCalidad || "Pendiente"
        );

        setObservacionesCalidad(
            orden.observacionesCalidad || ""
        );

        setResultadoReparacion(
            orden.resultadoReparacion || "Pendiente"
        );

        setObservacionesFinales(
            orden.observacionesFinales || ""
        );

        setOrdenEditando(
            orden
        );

        setModoEdicion(true);

        setMostrarFormulario(true);

        setMostrarResultados(false);
    };

    // ==================================================
    // ELIMINAR
    // ==================================================

    const eliminarOrden = orden => {

        const confirmar =
            window.confirm(
                `¿Desea eliminar la orden ${orden.codigoOrden}?`
            );

        if (!confirmar) {
            return;
        }

        setOrdenes(
            ordenes.filter(
                item =>
                    item.id !== orden.id
            )
        );
    };

    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="ordenes-reparacion-container">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="ordenes-header">

                <div>

                    <h1>
                        Órdenes de reparación
                    </h1>

                    <p>
                        Gestión y seguimiento de trabajos de reparación
                    </p>

                </div>

                {!mostrarFormulario && (

                    <button
                        className="btn-nueva-orden"
                        onClick={nuevaOrden}
                    >
                        + Nueva orden de reparación
                    </button>

                )}

            </div>

            {/* ==================================================
                FORMULARIO
            ================================================== */}

            {mostrarFormulario ? (

                <form
                    className="orden-reparacion-form"
                    onSubmit={guardarOrden}
                >

                    {/* ==================================================
                        HEADER FORMULARIO
                    ================================================== */}

                    <div className="orden-form-header">

                        <div>

                            <h2>
                                {modoEdicion
                                    ? "Editar orden de reparación"
                                    : "Nueva orden de reparación"}
                            </h2>

                            <p>
                                Registre y controle el trabajo técnico
                            </p>

                        </div>

                        <button
                            type="button"
                            className="btn-cerrar-orden"
                            onClick={
                                cancelarFormulario
                            }
                        >
                            ×
                        </button>

                    </div>

                    {/* ==================================================
                        BUSCAR SOLICITUD
                    ================================================== */}

                    {!modoEdicion && (

                        <div className="orden-buscar-solicitud">

                            <h3>
                                Vincular orden de servicio
                            </h3>

                            <div className="orden-busqueda">

                                <select
                                    value={
                                        tipoBusqueda
                                    }
                                    onChange={
                                        cambiarTipoBusqueda
                                    }
                                >

                                    <option value="orden">
                                        Orden de servicio
                                    </option>

                                    <option value="serie">
                                        Número de serie
                                    </option>

                                    <option value="cliente">
                                        Cliente
                                    </option>

                                </select>

                                <input
                                    type="text"
                                    placeholder={
                                        tipoBusqueda === "orden"
                                            ? "Ej. ST-000001"
                                            : tipoBusqueda === "serie"
                                                ? "Ej. PF3ABC123"
                                                : "Nombre del cliente"
                                    }
                                    value={
                                        busquedaSolicitud
                                    }
                                    onChange={
                                        e =>
                                            setBusquedaSolicitud(
                                                e.target.value
                                            )
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={
                                        buscarSolicitudes
                                    }
                                >
                                    Buscar
                                </button>

                            </div>

                            {mostrarResultados && (

                                <div className="orden-resultados">

                                    {solicitudesFiltradas.length === 0 ? (

                                        <div className="orden-sin-resultados">

                                            No hay órdenes de servicio disponibles.

                                        </div>

                                    ) : (

                                        <table>

                                            <thead>

                                                <tr>

                                                    <th>
                                                        Orden
                                                    </th>

                                                    <th>
                                                        Presupuesto
                                                    </th>

                                                    <th>
                                                        Cliente
                                                    </th>

                                                    <th>
                                                        Equipo
                                                    </th>

                                                    <th>
                                                        Serie
                                                    </th>

                                                    <th>
                                                        Acción
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {solicitudesFiltradas.map(
                                                    solicitud => (

                                                        <tr
                                                            key={
                                                                solicitud.id
                                                            }
                                                        >

                                                            <td>
                                                                <strong>
                                                                    {
                                                                        solicitud.codigoSolicitud
                                                                    }
                                                                </strong>
                                                            </td>

                                                            <td>
                                                                {
                                                                    solicitud.codigoPresupuesto
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    solicitud.cliente
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    solicitud.equipo
                                                                }
                                                                {" - "}
                                                                {
                                                                    solicitud.marca
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    solicitud.numeroSerie
                                                                }
                                                            </td>

                                                            <td>

                                                                <button
                                                                    type="button"
                                                                    className="btn-seleccionar-orden"
                                                                    onClick={() =>
                                                                        seleccionarSolicitud(
                                                                            solicitud
                                                                        )
                                                                    }
                                                                >
                                                                    Seleccionar
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    )}

                                </div>

                            )}

                        </div>

                    )}

                    {/* ==================================================
                        DATOS DE LA ORDEN
                    ================================================== */}

                    {solicitudSeleccionada && (

                        <>

                            <div className="orden-datos-generales">

                                <div className="orden-seccion-header">

                                    <div>

                                        <h3>
                                            Información de la orden
                                        </h3>

                                        <p>
                                            Datos generales y programación del trabajo
                                        </p>

                                    </div>

                                </div>

                                <div className="orden-grid">

                                    <div className="campo-orden">

                                        <label>
                                            Prioridad
                                        </label>

                                        <select
                                            value={
                                                prioridad
                                            }
                                            onChange={
                                                e =>
                                                    setPrioridad(
                                                        e.target.value
                                                    )
                                            }
                                        >

                                            <option value="Baja">
                                                Baja
                                            </option>

                                            <option value="Normal">
                                                Normal
                                            </option>

                                            <option value="Alta">
                                                Alta
                                            </option>

                                            <option value="Urgente">
                                                Urgente
                                            </option>

                                        </select>

                                    </div>

                                    <div className="campo-orden">

                                        <label>
                                            Estado
                                        </label>

                                        <select
                                            value={
                                                estadoOrden
                                            }
                                            onChange={
                                                e =>
                                                    setEstadoOrden(
                                                        e.target.value
                                                    )
                                            }
                                        >

                                            <option value="Pendiente">
                                                Pendiente
                                            </option>

                                            <option value="Asignada">
                                                Asignada
                                            </option>

                                            <option value="En reparación">
                                                En reparación
                                            </option>

                                            <option value="En espera de repuesto">
                                                En espera de repuesto
                                            </option>

                                            <option value="Reparación suspendida">
                                                Reparación suspendida
                                            </option>

                                            <option value="Reparada">
                                                Reparada
                                            </option>

                                            <option value="Control de calidad">
                                                Control de calidad
                                            </option>

                                            <option value="Lista para entrega">
                                                Lista para entrega
                                            </option>

                                            <option value="Cancelada">
                                                Cancelada
                                            </option>

                                        </select>

                                    </div>

                                    <div className="campo-orden">

                                        <label>
                                            Fecha de inicio
                                        </label>

                                        <input
                                            type="date"
                                            value={
                                                fechaInicio
                                            }
                                            onChange={
                                                e =>
                                                    setFechaInicio(
                                                        e.target.value
                                                    )
                                            }
                                        />

                                    </div>

                                    <div className="campo-orden">

                                        <label>
                                            Fecha estimada de entrega
                                        </label>

                                        <input
                                            type="date"
                                            value={
                                                fechaEntregaEstimada
                                            }
                                            onChange={
                                                e =>
                                                    setFechaEntregaEstimada(
                                                        e.target.value
                                                    )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* ==================================================
                                CLIENTE
                            ================================================== */}

                            <div className="orden-seccion">

                                <div className="orden-seccion-header">

                                    <div>

                                        <h3>
                                            Datos del cliente
                                        </h3>

                                    </div>

                                </div>

                                <div className="orden-info-grid">

                                    <div>
                                        <span>
                                            Cliente
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .cliente
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Documento
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .tipoDocumento
                                            }
                                            {" "}
                                            {
                                                solicitudSeleccionada
                                                    .numeroDocumento
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Teléfono
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .telefono
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Correo
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .correo
                                            }
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            {/* ==================================================
                                EQUIPO
                            ================================================== */}

                            <div className="orden-seccion">

                                <div className="orden-seccion-header">

                                    <div>

                                        <h3>
                                            Datos del equipo
                                        </h3>

                                    </div>

                                </div>

                                <div className="orden-info-grid">

                                    <div>
                                        <span>
                                            Equipo
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .equipo
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Marca
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .marca
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Modelo
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .modelo
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Número de serie
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .numeroSerie
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Código interno
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .codigoInterno
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Accesorios recibidos
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .accesorios
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Estado físico
                                        </span>

                                        <strong>
                                            {
                                                solicitudSeleccionada
                                                    .estadoFisico
                                            }
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            {/* ==================================================
                                TRABAJO
                            ================================================== */}

                            <div className="orden-seccion">

                                <div className="orden-seccion-header">

                                    <div>

                                        <h3>
                                            Trabajo a realizar
                                        </h3>

                                        <p>
                                            Defina el diagnóstico confirmado y el trabajo autorizado.
                                        </p>

                                    </div>

                                </div>

                                <div className="orden-grid">

                                    <div className="campo-orden campo-ancho-completo">

                                        <label>
                                            Diagnóstico confirmado
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                diagnosticoConfirmado
                                            }
                                            onChange={
                                                e =>
                                                    setDiagnosticoConfirmado(
                                                        e.target.value
                                                    )
                                            }
                                            placeholder="Ingrese el diagnóstico técnico confirmado..."
                                        />

                                    </div>

                                    <div className="campo-orden">

                                        <label>
                                            Causa de la falla
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                causaFalla
                                            }
                                            onChange={
                                                e =>
                                                    setCausaFalla(
                                                        e.target.value
                                                    )
                                            }
                                            placeholder="Indique la causa identificada..."
                                        />

                                    </div>

                                    <div className="campo-orden">

                                        <label>
                                            Trabajo a realizar
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                trabajoRealizar
                                            }
                                            onChange={
                                                e =>
                                                    setTrabajoRealizar(
                                                        e.target.value
                                                    )
                                            }
                                            placeholder="Describa las tareas que realizará el técnico..."
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* ==================================================
                                ASIGNACIÓN
                            ================================================== */}

                            <div className="orden-seccion">

                                <div className="orden-seccion-header">

                                    <div>

                                        <h3>
                                            Asignación técnica
                                        </h3>

                                    </div>

                                </div>

                                <div className="orden-grid">

                                    <div className="campo-orden">

                                        <label>
                                            Técnico responsable
                                        </label>

                                        <select
                                            value={
                                                tecnicoResponsable
                                            }
                                            onChange={
                                                e =>
                                                    setTecnicoResponsable(
                                                        e.target.value
                                                    )
                                            }
                                        >

                                            <option value="">
                                                Seleccionar técnico
                                            </option>

                                            {tecnicos.map(
                                                tecnico => (

                                                    <option
                                                        key={
                                                            tecnico.id
                                                        }
                                                        value={
                                                            tecnico.id
                                                        }
                                                    >
                                                        {
                                                            tecnico.nombre
                                                        }
                                                        {" - "}
                                                        {
                                                            tecnico.especialidad
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                    <div className="campo-orden">

                                        <label>
                                            Técnico auxiliar
                                        </label>

                                        <select
                                            value={
                                                tecnicoAuxiliar
                                            }
                                            onChange={
                                                e =>
                                                    setTecnicoAuxiliar(
                                                        e.target.value
                                                    )
                                            }
                                        >

                                            <option value="">
                                                Ninguno
                                            </option>

                                            {tecnicos.map(
                                                tecnico => (

                                                    <option
                                                        key={
                                                            tecnico.id
                                                        }
                                                        value={
                                                            tecnico.id
                                                        }
                                                    >
                                                        {
                                                            tecnico.nombre
                                                        }
                                                        {" - "}
                                                        {
                                                            tecnico.especialidad
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                    <div className="campo-orden">

                                        <label>
                                            Estación de trabajo
                                        </label>

                                        <select
                                            value={
                                                estacionTrabajo
                                            }
                                            onChange={
                                                e =>
                                                    setEstacionTrabajo(
                                                        e.target.value
                                                    )
                                            }
                                        >

                                            <option value="">
                                                Seleccionar estación
                                            </option>

                                            <option value="Mesa 01">
                                                Mesa 01
                                            </option>

                                            <option value="Mesa 02">
                                                Mesa 02
                                            </option>

                                            <option value="Mesa 03">
                                                Mesa 03
                                            </option>

                                            <option value="Mesa 04">
                                                Mesa 04
                                            </option>

                                            <option value="Laboratorio">
                                                Laboratorio
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>

                            {/* ==================================================
                                REPUESTOS
                            ================================================== */}

                            <div className="orden-seccion">

                                <div className="orden-seccion-header">

                                    <div>

                                        <h3>
                                            Repuestos utilizados
                                        </h3>

                                        <p>
                                            Registre los repuestos que serán utilizados durante la reparación.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className="btn-agregar-repuesto"
                                        onClick={
                                            agregarRepuesto
                                        }
                                    >
                                        + Agregar repuesto
                                    </button>

                                </div>

                                <div className="repuestos-container">

                                    <table>

                                        <thead>

                                            <tr>

                                                <th>
                                                    Código
                                                </th>

                                                <th>
                                                    Repuesto
                                                </th>

                                                <th>
                                                    Cantidad
                                                </th>

                                                <th>
                                                    Estado
                                                </th>

                                                <th>
                                                    Acción
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {repuestos.map(
                                                repuesto => (

                                                    <tr
                                                        key={
                                                            repuesto.id
                                                        }
                                                    >

                                                        <td>

                                                            <input
                                                                type="text"
                                                                value={
                                                                    repuesto.codigo
                                                                }
                                                                onChange={
                                                                    e =>
                                                                        actualizarRepuesto(
                                                                            repuesto.id,
                                                                            "codigo",
                                                                            e.target.value
                                                                        )
                                                                }
                                                                placeholder="Código"
                                                            />

                                                        </td>

                                                        <td>

                                                            <input
                                                                type="text"
                                                                value={
                                                                    repuesto.descripcion
                                                                }
                                                                onChange={
                                                                    e =>
                                                                        actualizarRepuesto(
                                                                            repuesto.id,
                                                                            "descripcion",
                                                                            e.target.value
                                                                        )
                                                                }
                                                                placeholder="Descripción del repuesto"
                                                            />

                                                        </td>

                                                        <td>

                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    repuesto.cantidad
                                                                }
                                                                onChange={
                                                                    e =>
                                                                        actualizarRepuesto(
                                                                            repuesto.id,
                                                                            "cantidad",
                                                                            e.target.value
                                                                        )
                                                                }
                                                            />

                                                        </td>

                                                        <td>

                                                            <select
                                                                value={
                                                                    repuesto.estado
                                                                }
                                                                onChange={
                                                                    e =>
                                                                        actualizarRepuesto(
                                                                            repuesto.id,
                                                                            "estado",
                                                                            e.target.value
                                                                        )
                                                                }
                                                            >

                                                                <option value="Pendiente">
                                                                    Pendiente
                                                                </option>

                                                                <option value="Solicitado">
                                                                    Solicitado
                                                                </option>

                                                                <option value="Disponible">
                                                                    Disponible
                                                                </option>

                                                                <option value="Utilizado">
                                                                    Utilizado
                                                                </option>

                                                                <option value="No utilizado">
                                                                    No utilizado
                                                                </option>

                                                            </select>

                                                        </td>

                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="btn-eliminar-repuesto"
                                                                onClick={() =>
                                                                    eliminarRepuesto(
                                                                        repuesto.id
                                                                    )
                                                                }
                                                            >
                                                                Eliminar
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                            {/* ==================================================
                                BITÁCORA
                            ================================================== */}

                            <div className="orden-seccion">

                                <div className="orden-seccion-header">

                                    <div>

                                        <h3>
                                            Bitácora de actividades
                                        </h3>

                                        <p>
                                            Registre las actividades realizadas durante la reparación.
                                        </p>

                                    </div>

                                </div>

                                <div className="actividad-nueva">

                                    <textarea
                                        rows="3"
                                        value={
                                            nuevaActividad
                                        }
                                        onChange={
                                            e =>
                                                setNuevaActividad(
                                                    e.target.value
                                                )
                                        }
                                        placeholder="Describa la actividad realizada..."
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            agregarActividad
                                        }
                                    >
                                        Agregar actividad
                                    </button>

                                </div>

                                {actividades.length > 0 && (

                                    <div className="actividades-lista">

                                        {actividades.map(
                                            actividad => (

                                                <div
                                                    className="actividad-item"
                                                    key={
                                                        actividad.id
                                                    }
                                                >

                                                    <div className="actividad-fecha">

                                                        <strong>
                                                            {
                                                                actividad.fecha
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                actividad.hora
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="actividad-contenido">

                                                        <strong>
                                                            {
                                                                actividad.tecnico
                                                            }
                                                        </strong>

                                                        <p>
                                                            {
                                                                actividad.descripcion
                                                            }
                                                        </p>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            eliminarActividad(
                                                                actividad.id
                                                            )
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                            {/* ==================================================
                                CONTROL DE CALIDAD
                            ================================================== */}

                            <div className="orden-seccion">

                                <div className="orden-seccion-header">

                                    <div>

                                        <h3>
                                            Control de calidad
                                        </h3>

                                        <p>
                                            Verifique el funcionamiento del equipo antes de finalizar la orden.
                                        </p>

                                    </div>

                                </div>

                                <div className="checklist">

                                    {checklist.map(
                                        item => (

                                            <label
                                                key={
                                                    item.id
                                                }
                                                className={
                                                    item.completado
                                                        ? "checklist-item completado"
                                                        : "checklist-item"
                                                }
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        item.completado
                                                    }
                                                    onChange={() =>
                                                        cambiarChecklist(
                                                            item.id
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {
                                                        item.descripcion
                                                    }
                                                </span>

                                            </label>

                                        )
                                    )}

                                </div>

                                <div className="orden-grid control-calidad-grid">

                                    <div className="campo-orden">

                                        <label>
                                            Resultado del control
                                        </label>

                                        <select
                                            value={
                                                resultadoCalidad
                                            }
                                            onChange={
                                                e =>
                                                    setResultadoCalidad(
                                                        e.target.value
                                                    )
                                            }
                                        >

                                            <option value="Pendiente">
                                                Pendiente
                                            </option>

                                            <option value="Aprobado">
                                                Aprobado
                                            </option>

                                            <option value="Observado">
                                                Observado
                                            </option>

                                        </select>

                                    </div>

                                    <div className="campo-orden">

                                        <label>
                                            Observaciones
                                        </label>

                                        <textarea
                                            rows="3"
                                            value={
                                                observacionesCalidad
                                            }
                                            onChange={
                                                e =>
                                                    setObservacionesCalidad(
                                                        e.target.value
                                                    )
                                            }
                                            placeholder="Indique las observaciones encontradas..."
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* ==================================================
                                CIERRE
                            ================================================== */}

                            <div className="orden-seccion">

                                <div className="orden-seccion-header">

                                    <div>

                                        <h3>
                                            Cierre de la reparación
                                        </h3>

                                        <p>
                                            Registre el resultado final del trabajo realizado.
                                        </p>

                                    </div>

                                </div>

                                <div className="orden-grid">

                                    <div className="campo-orden">

                                        <label>
                                            Resultado de reparación
                                        </label>

                                        <select
                                            value={
                                                resultadoReparacion
                                            }
                                            onChange={
                                                e =>
                                                    setResultadoReparacion(
                                                        e.target.value
                                                    )
                                            }
                                        >

                                            <option value="Pendiente">
                                                Pendiente
                                            </option>

                                            <option value="Reparado">
                                                Reparado
                                            </option>

                                            <option value="Reparado parcialmente">
                                                Reparado parcialmente
                                            </option>

                                            <option value="No reparado">
                                                No reparado
                                            </option>

                                            <option value="Sin solución técnica">
                                                Sin solución técnica
                                            </option>

                                        </select>

                                    </div>

                                    <div className="campo-orden">

                                        <label>
                                            Observaciones finales
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                observacionesFinales
                                            }
                                            onChange={
                                                e =>
                                                    setObservacionesFinales(
                                                        e.target.value
                                                    )
                                            }
                                            placeholder="Ingrese las observaciones finales..."
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* ==================================================
                                ACCIONES
                            ================================================== */}

                            <div className="orden-form-actions">

                                <button
                                    type="button"
                                    className="btn-cancelar-orden"
                                    onClick={
                                        cancelarFormulario
                                    }
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn-guardar-orden"
                                >
                                    {modoEdicion
                                        ? "Actualizar orden"
                                        : "Guardar orden"}
                                </button>

                            </div>

                        </>

                    )}

                </form>

            ) : (

                /* ==================================================
                   LISTADO
                ================================================== */

                <>

                    <div className="ordenes-filtros">

                        <input
                            type="text"
                            placeholder="Buscar orden, servicio, cliente o serie..."
                            value={
                                busquedaOrden
                            }
                            onChange={
                                e =>
                                    setBusquedaOrden(
                                        e.target.value
                                    )
                            }
                        />

                        <select
                            value={
                                filtroEstado
                            }
                            onChange={
                                e =>
                                    setFiltroEstado(
                                        e.target.value
                                    )
                            }
                        >

                            <option value="Todos">
                                Todos los estados
                            </option>

                            <option value="Pendiente">
                                Pendiente
                            </option>

                            <option value="Asignada">
                                Asignada
                            </option>

                            <option value="En reparación">
                                En reparación
                            </option>

                            <option value="En espera de repuesto">
                                En espera de repuesto
                            </option>

                            <option value="Reparación suspendida">
                                Reparación suspendida
                            </option>

                            <option value="Reparada">
                                Reparada
                            </option>

                            <option value="Control de calidad">
                                Control de calidad
                            </option>

                            <option value="Lista para entrega">
                                Lista para entrega
                            </option>

                            <option value="Cancelada">
                                Cancelada
                            </option>

                        </select>

                        <select
                            value={
                                filtroPrioridad
                            }
                            onChange={
                                e =>
                                    setFiltroPrioridad(
                                        e.target.value
                                    )
                            }
                        >

                            <option value="Todas">
                                Todas las prioridades
                            </option>

                            <option value="Baja">
                                Baja
                            </option>

                            <option value="Normal">
                                Normal
                            </option>

                            <option value="Alta">
                                Alta
                            </option>

                            <option value="Urgente">
                                Urgente
                            </option>

                        </select>

                    </div>

                    <div className="ordenes-tabla-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Orden
                                    </th>

                                    <th>
                                        Servicio
                                    </th>

                                    <th>
                                        Fecha
                                    </th>

                                    <th>
                                        Cliente
                                    </th>

                                    <th>
                                        Equipo
                                    </th>

                                    <th>
                                        Técnico
                                    </th>

                                    <th>
                                        Prioridad
                                    </th>

                                    <th>
                                        Estado
                                    </th>

                                    <th>
                                        Acciones
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {ordenesFiltradas.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            className="ordenes-tabla-vacia"
                                        >
                                            No hay órdenes de reparación registradas.
                                        </td>

                                    </tr>

                                ) : (

                                    ordenesFiltradas.map(
                                        orden => (

                                            <tr
                                                key={
                                                    orden.id
                                                }
                                            >

                                                <td>

                                                    <strong className="codigo-orden">
                                                        {
                                                            orden.codigoOrden
                                                        }
                                                    </strong>

                                                </td>

                                                <td>
                                                    {
                                                        orden.codigoSolicitud
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        formatearFecha(
                                                            orden.fechaCreacion
                                                        )
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        orden.cliente
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        orden.equipo
                                                    }
                                                    {" - "}
                                                    {
                                                        orden.marca
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        tecnicos.find(
                                                            tecnico =>
                                                                String(tecnico.id) ===
                                                                String(orden.tecnicoResponsable)
                                                        )?.nombre ||
                                                        "Sin asignar"
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={`prioridad-orden prioridad-${orden.prioridad.toLowerCase()}`}
                                                    >
                                                        {
                                                            orden.prioridad
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <span
                                                        className={`estado-orden estado-${orden.estado.toLowerCase().replaceAll(" ", "-")}`}
                                                    >
                                                        {
                                                            orden.estado
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <button
                                                        className="btn-accion-orden"
                                                        onClick={() =>
                                                            editarOrden(
                                                                orden
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        className="btn-accion-orden btn-eliminar-orden"
                                                        onClick={() =>
                                                            eliminarOrden(
                                                                orden
                                                            )
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </>

            )}

        </div>
    );
}

export default OrdenesReparacion;