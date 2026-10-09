import { useState } from "react";
import "./pedidoRepuestos.css";


const ORDENES_EJEMPLO = [
    {
        id: 1,
        codigoOrden: "OR-000001",
        codigoSolicitud: "ST-000001",
        cliente: "Juan Pérez",
        equipo: "Laptop",
        marca: "Lenovo",
        modelo: "ThinkPad E14",
        numeroSerie: "PF3ABC123",
        tecnico: "Carlos Mendoza",
        prioridad: "Alta",
        estado: "En reparación"
    },
    {
        id: 2,
        codigoOrden: "OR-000002",
        codigoSolicitud: "ST-000002",
        cliente: "Empresa ABC S.A.C.",
        equipo: "PC",
        marca: "HP",
        modelo: "ProDesk 400",
        numeroSerie: "HP778899",
        tecnico: "Luis Ramírez",
        prioridad: "Normal",
        estado: "En reparación"
    },
    {
        id: 3,
        codigoOrden: "OR-000003",
        codigoSolicitud: "ST-000003",
        cliente: "Carlos López",
        equipo: "Laptop",
        marca: "HP",
        modelo: "250 G8",
        numeroSerie: "HP250123",
        tecnico: "Miguel Torres",
        prioridad: "Normal",
        estado: "En reparación"
    }
];


const REPUESTOS_EJEMPLO = [
    {
        id: 1,
        codigo: "REP-001",
        descripcion: "SSD 500GB SATA",
        unidad: "UND",
        stock: 8
    },
    {
        id: 2,
        codigo: "REP-002",
        descripcion: "Memoria RAM 8GB DDR4",
        unidad: "UND",
        stock: 5
    },
    {
        id: 3,
        codigo: "REP-003",
        descripcion: "Pasta térmica",
        unidad: "UND",
        stock: 15
    },
    {
        id: 4,
        codigo: "REP-004",
        descripcion: "Ventilador para laptop Lenovo",
        unidad: "UND",
        stock: 3
    },
    {
        id: 5,
        codigo: "REP-005",
        descripcion: "Batería Lenovo ThinkPad E14",
        unidad: "UND",
        stock: 0
    }
];


const TECNICOS_EJEMPLO = [
    {
        id: 1,
        nombre: "Carlos Mendoza"
    },
    {
        id: 2,
        nombre: "Luis Ramírez"
    },
    {
        id: 3,
        nombre: "Miguel Torres"
    }
];


const ALMACENES_EJEMPLO = [
    {
        id: 1,
        nombre: "Almacén principal"
    },
    {
        id: 2,
        nombre: "Almacén de repuestos"
    }
];


function PedidoRepuestos() {

    const [ordenes] = useState(ORDENES_EJEMPLO);
    const [repuestosDisponibles] = useState(REPUESTOS_EJEMPLO);
    const [tecnicos] = useState(TECNICOS_EJEMPLO);
    const [almacenes] = useState(ALMACENES_EJEMPLO);


    /* =====================================================
       PEDIDOS
    ===================================================== */

    const [pedidos, setPedidos] = useState([]);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [modoEdicion, setModoEdicion] = useState(false);

    const [pedidoEditando, setPedidoEditando] = useState(null);

    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

    const [tecnicoSolicitante, setTecnicoSolicitante] = useState("");

    const [prioridad, setPrioridad] = useState("Normal");

    const [almacenDestino, setAlmacenDestino] = useState("");

    const [motivoPedido, setMotivoPedido] = useState("");

    const [observacionesPedido, setObservacionesPedido] = useState("");


    const [detalles, setDetalles] = useState([
        {
            id: 1,
            codigo: "",
            descripcion: "",
            cantidadSolicitada: 1,
            stockDisponible: 0,
            cantidadAprobada: 0,
            cantidadEntregada: 0,
            cantidadUtilizada: 0,
            cantidadDevuelta: 0,
            estado: "Pendiente"
        }
    ]);


    /* =====================================================
       BÚSQUEDA DE ÓRDENES
    ===================================================== */

    const [busquedaOrden, setBusquedaOrden] = useState("");

    const [mostrarOrdenes, setMostrarOrdenes] = useState(false);


    /* =====================================================
       TABS
    ===================================================== */

    const [pestanaActiva, setPestanaActiva] = useState("pedidos");


    /* =====================================================
       DEVOLUCIONES
    ===================================================== */

    const [devoluciones, setDevoluciones] = useState([]);

    const [devolucionEditando, setDevolucionEditando] = useState(null);

    const [mostrarFormularioDevolucion, setMostrarFormularioDevolucion] =
        useState(false);

    const [pedidoDevolucion, setPedidoDevolucion] = useState(null);

    const [motivoDevolucion, setMotivoDevolucion] = useState("");

    const [observacionesDevolucion, setObservacionesDevolucion] =
        useState("");

    const [detallesDevolucion, setDetallesDevolucion] = useState([]);


    /* =====================================================
       FILTROS
    ===================================================== */

    const [busquedaPedido, setBusquedaPedido] = useState("");

    const [filtroEstadoPedido, setFiltroEstadoPedido] =
        useState("Todos");

    const [busquedaDevolucion, setBusquedaDevolucion] =
        useState("");

    const [filtroEstadoDevolucion, setFiltroEstadoDevolucion] =
        useState("Todos");


    /* =====================================================
       FUNCIONES GENERALES
    ===================================================== */

    const formatearFecha = fecha => {

        if (!fecha) return "";

        const [anio, mes, dia] = fecha.split("-");

        return `${dia}/${mes}/${anio.slice(2)}`;
    };


    const obtenerFechaActual = () => {

        return new Date()
            .toISOString()
            .split("T")[0];
    };


    const generarCodigoPedido = () => {

        if (pedidos.length === 0) {
            return "PR-000001";
        }

        const numeros = pedidos.map(pedido => {

            const numero = pedido.codigoPedido
                .replace("PR-", "");

            return parseInt(numero, 10) || 0;
        });

        const mayor = Math.max(...numeros);

        return `PR-${String(mayor + 1).padStart(6, "0")}`;
    };


    const generarCodigoDevolucion = () => {

        if (devoluciones.length === 0) {
            return "DEV-000001";
        }

        const numeros = devoluciones.map(devolucion => {

            const numero = devolucion.codigoDevolucion
                .replace("DEV-", "");

            return parseInt(numero, 10) || 0;
        });

        const mayor = Math.max(...numeros);

        return `DEV-${String(mayor + 1).padStart(6, "0")}`;
    };


    /* =====================================================
       ORDENES FILTRADAS
    ===================================================== */

    
        const ordenesFiltradas = ORDENES_EJEMPLO.filter((orden) => {
            const texto = busquedaOrden.toLowerCase().trim();

            if (!texto) return true;

            return (
                orden.codigoOrden.toLowerCase().includes(texto) ||
                orden.codigoSolicitud.toLowerCase().includes(texto) ||
                orden.cliente.toLowerCase().includes(texto) ||
                orden.equipo.toLowerCase().includes(texto) ||
                orden.marca.toLowerCase().includes(texto) ||
                orden.modelo.toLowerCase().includes(texto) ||
                orden.numeroSerie.toLowerCase().includes(texto) ||
                orden.tecnico.toLowerCase().includes(texto)
            );
        });




    /* =====================================================
       PEDIDOS FILTRADOS
    ===================================================== */

    const pedidosFiltrados = pedidos.filter(pedido => {

        const texto = busquedaPedido
            .toLowerCase()
            .trim();

        const coincideTexto =
            !texto ||

            pedido.codigoPedido
                .toLowerCase()
                .includes(texto) ||

            pedido.codigoOrden
                .toLowerCase()
                .includes(texto) ||

            pedido.cliente
                .toLowerCase()
                .includes(texto);


        const coincideEstado =
            filtroEstadoPedido === "Todos" ||
            pedido.estado === filtroEstadoPedido;


        return coincideTexto && coincideEstado;
    });


    /* =====================================================
       DEVOLUCIONES FILTRADAS
    ===================================================== */

    const devolucionesFiltradas =
        devoluciones.filter(devolucion => {

            const texto = busquedaDevolucion
                .toLowerCase()
                .trim();

            const coincideTexto =
                !texto ||

                devolucion.codigoDevolucion
                    .toLowerCase()
                    .includes(texto) ||

                devolucion.codigoPedido
                    .toLowerCase()
                    .includes(texto) ||

                devolucion.codigoOrden
                    .toLowerCase()
                    .includes(texto);


            const coincideEstado =
                filtroEstadoDevolucion === "Todos" ||
                devolucion.estado === filtroEstadoDevolucion;


            return coincideTexto && coincideEstado;
        });


    /* =====================================================
       SELECCIONAR ORDEN
    ===================================================== */

    const seleccionarOrden = orden => {

        setOrdenSeleccionada(orden);

        setTecnicoSolicitante(
            tecnicos.find(
                tecnico =>
                    tecnico.nombre === orden.tecnico
            )?.id || ""
        );

        setPrioridad(orden.prioridad);

        setBusquedaOrden(orden.codigoOrden);

        setMostrarOrdenes(false);
    };


    /* =====================================================
       AGREGAR REPUESTO
    ===================================================== */

    const agregarRepuesto = () => {

        setDetalles([
            ...detalles,
            {
                id: Date.now(),
                codigo: "",
                descripcion: "",
                cantidadSolicitada: 1,
                stockDisponible: 0,
                cantidadAprobada: 0,
                cantidadEntregada: 0,
                cantidadUtilizada: 0,
                cantidadDevuelta: 0,
                estado: "Pendiente"
            }
        ]);
    };


    /* =====================================================
       SELECCIONAR REPUESTO
    ===================================================== */

    const seleccionarRepuesto = (id, codigo) => {

        const repuesto =
            repuestosDisponibles.find(
                item => item.codigo === codigo
            );

        if (!repuesto) return;


        setDetalles(
            detalles.map(detalle => {

                if (detalle.id !== id) {
                    return detalle;
                }

                return {
                    ...detalle,
                    codigo: repuesto.codigo,
                    descripcion: repuesto.descripcion,
                    stockDisponible: repuesto.stock
                };
            })
        );
    };


    /* =====================================================
       ACTUALIZAR DETALLE
    ===================================================== */

    const actualizarDetalle = (
        id,
        campo,
        valor
    ) => {

        setDetalles(
            detalles.map(detalle => {

                if (detalle.id !== id) {
                    return detalle;
                }

                return {
                    ...detalle,
                    [campo]:
                        campo.includes("cantidad") ||
                        campo === "stockDisponible"
                            ? Number(valor)
                            : valor
                };
            })
        );
    };


    /* =====================================================
       ELIMINAR DETALLE
    ===================================================== */

    const eliminarDetalle = id => {

        setDetalles(
            detalles.filter(
                detalle => detalle.id !== id
            )
        );
    };


    /* =====================================================
       DETERMINAR ESTADO DEL PEDIDO
    ===================================================== */

    const calcularEstadoPedido = detallesPedido => {

        if (!detallesPedido.length) {
            return "Pendiente";
        }

        const totalSolicitado =
            detallesPedido.reduce(
                (total, item) =>
                    total + item.cantidadSolicitada,
                0
            );

        const totalEntregado =
            detallesPedido.reduce(
                (total, item) =>
                    total + item.cantidadEntregada,
                0
            );


        if (totalEntregado === 0) {
            return "Pendiente";
        }

        if (totalEntregado < totalSolicitado) {
            return "Atendido parcialmente";
        }

        return "Atendido";
    };


    /* =====================================================
       LIMPIAR FORMULARIO
    ===================================================== */

    const limpiarFormulario = () => {

        setOrdenSeleccionada(null);

        setBusquedaOrden("");

        setTecnicoSolicitante("");

        setPrioridad("Normal");

        setAlmacenDestino("");

        setMotivoPedido("");

        setObservacionesPedido("");

        setDetalles([
            {
                id: 1,
                codigo: "",
                descripcion: "",
                cantidadSolicitada: 1,
                stockDisponible: 0,
                cantidadAprobada: 0,
                cantidadEntregada: 0,
                cantidadUtilizada: 0,
                cantidadDevuelta: 0,
                estado: "Pendiente"
            }
        ]);

        setModoEdicion(false);

        setPedidoEditando(null);

        setMostrarOrdenes(false);
    };


    /* =====================================================
       NUEVO PEDIDO
    ===================================================== */

    const nuevoPedido = () => {

        limpiarFormulario();

        setMostrarFormulario(true);

        setPestanaActiva("pedidos");
    };


    /* =====================================================
       CANCELAR
    ===================================================== */

    const cancelarFormulario = () => {

        limpiarFormulario();

        setMostrarFormulario(false);
    };


    /* =====================================================
       GUARDAR PEDIDO
    ===================================================== */

    const guardarPedido = event => {

        event.preventDefault();


        if (!ordenSeleccionada) {

            alert(
                "Debe seleccionar una orden de reparación."
            );

            return;
        }


        if (!tecnicoSolicitante) {

            alert(
                "Debe seleccionar el técnico solicitante."
            );

            return;
        }


        if (!almacenDestino) {

            alert(
                "Debe seleccionar el almacén."
            );

            return;
        }


        if (!detalles.length) {

            alert(
                "Debe agregar al menos un repuesto."
            );

            return;
        }


        const detallesValidos =
            detalles.every(
                detalle =>
                    detalle.codigo &&
                    detalle.cantidadSolicitada > 0
            );


        if (!detallesValidos) {

            alert(
                "Complete correctamente los repuestos solicitados."
            );

            return;
        }


        const pedido = {

            id:
                pedidoEditando?.id ||
                crypto.randomUUID(),

            codigoPedido:
                pedidoEditando?.codigoPedido ||
                generarCodigoPedido(),

            codigoOrden:
                ordenSeleccionada.codigoOrden,

            codigoSolicitud:
                ordenSeleccionada.codigoSolicitud,

            cliente:
                ordenSeleccionada.cliente,

            equipo:
                `${ordenSeleccionada.equipo} - ${ordenSeleccionada.marca}`,

            numeroSerie:
                ordenSeleccionada.numeroSerie,

            tecnicoSolicitante,

            prioridad,

            almacenDestino,

            fecha:
                pedidoEditando?.fecha ||
                obtenerFechaActual(),

            motivoPedido,

            observacionesPedido,

            detalles,

            estado:
                calcularEstadoPedido(detalles)
        };


        if (modoEdicion) {

            setPedidos(
                pedidos.map(item =>
                    item.id === pedidoEditando.id
                        ? pedido
                        : item
                )
            );

            alert(
                "Pedido de repuestos actualizado correctamente."
            );

        } else {

            setPedidos([
                ...pedidos,
                pedido
            ]);

            alert(
                "Pedido de repuestos creado correctamente."
            );
        }


        limpiarFormulario();

        setMostrarFormulario(false);
    };


    /* =====================================================
       EDITAR PEDIDO
    ===================================================== */

    const editarPedido = pedido => {

        const orden =
            ordenes.find(
                item =>
                    item.codigoOrden ===
                    pedido.codigoOrden
            );

        if (!orden) return;


        setOrdenSeleccionada(orden);

        setBusquedaOrden(
            orden.codigoOrden
        );

        setTecnicoSolicitante(
            pedido.tecnicoSolicitante
        );

        setPrioridad(
            pedido.prioridad
        );

        setAlmacenDestino(
            pedido.almacenDestino
        );

        setMotivoPedido(
            pedido.motivoPedido || ""
        );

        setObservacionesPedido(
            pedido.observacionesPedido || ""
        );

        setDetalles(
            pedido.detalles || []
        );

        setPedidoEditando(pedido);

        setModoEdicion(true);

        setMostrarFormulario(true);

        setPestanaActiva("pedidos");
    };


    /* =====================================================
       ELIMINAR PEDIDO
    ===================================================== */

    const eliminarPedido = pedido => {

        const confirmar =
            window.confirm(
                `¿Desea eliminar el pedido ${pedido.codigoPedido}?`
            );

        if (!confirmar) return;


        setPedidos(
            pedidos.filter(
                item =>
                    item.id !== pedido.id
            )
        );
    };


    /* =====================================================
       ABRIR DEVOLUCIÓN
    ===================================================== */

    const abrirDevolucion = pedido => {

        const detallesDisponibles =
            pedido.detalles
                .filter(
                    detalle =>
                        detalle.cantidadEntregada >
                        detalle.cantidadUtilizada +
                        detalle.cantidadDevuelta
                )
                .map(detalle => ({
                    id: Date.now() + Math.random(),
                    codigo: detalle.codigo,
                    descripcion: detalle.descripcion,
                    cantidadEntregada:
                        detalle.cantidadEntregada,
                    cantidadUtilizada:
                        detalle.cantidadUtilizada,
                    cantidadYaDevuelta:
                        detalle.cantidadDevuelta,
                    cantidadDevolver: 0,
                    estadoRepuesto: "Sin abrir"
                }));


        if (!detallesDisponibles.length) {

            alert(
                "No existen repuestos disponibles para devolver."
            );

            return;
        }


        setPedidoDevolucion(pedido);

        setDetallesDevolucion(
            detallesDisponibles
        );

        setMotivoDevolucion("");

        setObservacionesDevolucion("");

        setDevolucionEditando(null);

        setMostrarFormularioDevolucion(true);

        setPestanaActiva("devoluciones");
    };


    /* =====================================================
       ACTUALIZAR DEVOLUCIÓN
    ===================================================== */

    const actualizarDetalleDevolucion = (
        id,
        campo,
        valor
    ) => {

        setDetallesDevolucion(
            detallesDevolucion.map(detalle => {

                if (detalle.id !== id) {
                    return detalle;
                }

                return {
                    ...detalle,
                    [campo]:
                        campo === "cantidadDevolver"
                            ? Number(valor)
                            : valor
                };
            })
        );
    };


    /* =====================================================
       GUARDAR DEVOLUCIÓN
    ===================================================== */

    const guardarDevolucion = event => {

        event.preventDefault();


        if (!pedidoDevolucion) {
            return;
        }


        if (!motivoDevolucion.trim()) {

            alert(
                "Debe indicar el motivo de la devolución."
            );

            return;
        }


        const detallesValidos =
            detallesDevolucion.filter(
                detalle =>
                    detalle.cantidadDevolver > 0
            );


        if (!detallesValidos.length) {

            alert(
                "Debe indicar al menos un repuesto a devolver."
            );

            return;
        }


        for (const detalle of detallesValidos) {

            const maximo =
                detalle.cantidadEntregada -
                detalle.cantidadUtilizada -
                detalle.cantidadYaDevuelta;


            if (
                detalle.cantidadDevolver >
                maximo
            ) {

                alert(
                    `La cantidad a devolver de ${detalle.descripcion} no puede superar ${maximo}.`
                );

                return;
            }
        }


        const devolucion = {

            id:
                devolucionEditando?.id ||
                crypto.randomUUID(),

            codigoDevolucion:
                devolucionEditando?.codigoDevolucion ||
                generarCodigoDevolucion(),

            codigoPedido:
                pedidoDevolucion.codigoPedido,

            codigoOrden:
                pedidoDevolucion.codigoOrden,

            codigoSolicitud:
                pedidoDevolucion.codigoSolicitud,

            cliente:
                pedidoDevolucion.cliente,

            equipo:
                pedidoDevolucion.equipo,

            tecnico:
                tecnicos.find(
                    tecnico =>
                        String(tecnico.id) ===
                        String(
                            pedidoDevolucion.tecnicoSolicitante
                        )
                )?.nombre || "Sin asignar",

            fecha:
                devolucionEditando?.fecha ||
                obtenerFechaActual(),

            almacen:
                pedidoDevolucion.almacenDestino,

            motivo:
                motivoDevolucion,

            observaciones:
                observacionesDevolucion,

            detalles:
                detallesValidos,

            estado: "Pendiente"
        };


        setDevoluciones([
            ...devoluciones,
            devolucion
        ]);


        /* Actualizamos cantidades devueltas
           en el pedido */

        setPedidos(
            pedidos.map(pedido => {

                if (
                    pedido.id !==
                    pedidoDevolucion.id
                ) {
                    return pedido;
                }


                const nuevosDetalles =
                    pedido.detalles.map(
                        detalle => {

                            const devolucionDetalle =
                                detallesValidos.find(
                                    item =>
                                        item.codigo ===
                                        detalle.codigo
                                );


                            if (
                                !devolucionDetalle
                            ) {
                                return detalle;
                            }


                            return {
                                ...detalle,

                                cantidadDevuelta:
                                    detalle.cantidadDevuelta +
                                    devolucionDetalle.cantidadDevolver
                            };
                        }
                    );


                return {
                    ...pedido,
                    detalles:
                        nuevosDetalles
                };
            })
        );


        alert(
            "Documento de devolución generado correctamente."
        );


        setMostrarFormularioDevolucion(false);

        setPedidoDevolucion(null);

        setDetallesDevolucion([]);
    };


    /* =====================================================
       VER / IMPRIMIR DEVOLUCIÓN
    ===================================================== */

    const imprimirDevolucion = devolucion => {

        alert(
            `Documento ${devolucion.codigoDevolucion} listo para impresión.`
        );
    };


    return (

        <div className="pedido-repuestos-container">


            {/* =================================================
               HEADER
            ================================================= */}

            <div className="pedido-repuestos-header">

                <div>

                    <h1>
                        Pedido de repuestos
                    </h1>

                    <p>
                        Gestión de solicitudes, entregas y devoluciones de repuestos
                    </p>

                </div>


                {!mostrarFormulario &&
                    !mostrarFormularioDevolucion && (

                        <button
                            className="btn-nuevo-pedido"
                            onClick={nuevoPedido}
                        >
                            + Nuevo pedido
                        </button>

                    )}

            </div>


            {/* =================================================
               PESTAÑAS
            ================================================= */}

            {!mostrarFormulario &&
                !mostrarFormularioDevolucion && (

                    <div className="pedido-tabs">

                        <button
                            className={
                                pestanaActiva === "pedidos"
                                    ? "tab-activa"
                                    : ""
                            }
                            onClick={() =>
                                setPestanaActiva(
                                    "pedidos"
                                )
                            }
                        >
                            Pedidos
                        </button>


                        <button
                            className={
                                pestanaActiva === "entregas"
                                    ? "tab-activa"
                                    : ""
                            }
                            onClick={() =>
                                setPestanaActiva(
                                    "entregas"
                                )
                            }
                        >
                            Entregas
                        </button>


                        <button
                            className={
                                pestanaActiva === "devoluciones"
                                    ? "tab-activa"
                                    : ""
                            }
                            onClick={() =>
                                setPestanaActiva(
                                    "devoluciones"
                                )
                            }
                        >
                            Devoluciones
                        </button>

                    </div>

                )}


            {/* =================================================
               FORMULARIO PEDIDO
            ================================================= */}

            {mostrarFormulario && (

                <form
                    className="pedido-formulario"
                    onSubmit={guardarPedido}
                >

                    <div className="pedido-form-header">

                        <div>

                            <h2>
                                {modoEdicion
                                    ? "Editar pedido de repuestos"
                                    : "Nuevo pedido de repuestos"}
                            </h2>

                            <p>
                                Solicite los repuestos necesarios para una orden de reparación
                            </p>

                        </div>


                        <button
                            type="button"
                            className="btn-cerrar-pedido"
                            onClick={
                                cancelarFormulario
                            }
                        >
                            ×
                        </button>

                    </div>


                    {/* =================================================
                       VINCULAR ORDEN
                    ================================================= */}

                    <div className="pedido-seccion">

                        <div className="pedido-seccion-header">

                            <div>

                                <h3>
                                    Vincular orden de reparación
                                </h3>

                                <p>
                                    Seleccione la orden que necesita los repuestos.
                                </p>

                            </div>

                        </div>

                        <div className="pedido-seccion">
                            <div className="pedido-seccion-header">
                                <div>
                                    <h3>Órdenes disponibles</h3>
                                    <p>
                                        Seleccione una orden de reparación para solicitar repuestos
                                    </p>
                                </div>
                            </div>

                            <div className="pedido-busqueda-orden">
                                <input
                                    type="text"
                                    placeholder="Buscar por código, cliente, equipo, marca o modelo..."
                                    value={busquedaOrden}
                                    onChange={(e) => setBusquedaOrden(e.target.value)}
                                />
                            </div>

                            <div className="pedido-resultados-orden">
                                {ordenesFiltradas.length > 0 ? (
                                    ordenesFiltradas.map((orden) => (
                                        <div
                                            key={orden.id}
                                            className="pedido-orden-card"
                                        >
                                            <div className="pedido-orden-card-info">

                                                <div className="pedido-orden-principal">
                                                    <span className="pedido-orden-codigo">
                                                        {orden.codigoOrden}
                                                    </span>

                                                    <span
                                                        className={`prioridad-pedido prioridad-${orden.prioridad.toLowerCase()}`}
                                                    >
                                                        {orden.prioridad}
                                                    </span>
                                                </div>

                                                <div className="pedido-orden-datos">
                                                    <strong>{orden.cliente}</strong>

                                                    <span>
                                                        {orden.equipo} {orden.marca} {orden.modelo}
                                                    </span>

                                                    <span>
                                                        S/N: {orden.numeroSerie}
                                                    </span>
                                                </div>

                                                <div className="pedido-orden-meta">
                                                    <span>
                                                        Solicitud: {orden.codigoSolicitud}
                                                    </span>

                                                    <span>
                                                        Técnico: {orden.tecnico}
                                                    </span>

                                                    <span className="estado-pedido estado-atendido-parcialmente">
                                                        {orden.estado}
                                                    </span>
                                                </div>

                                            </div>

                                            <button
                                                type="button"
                                                className="btn-seleccionar-pedido"
                                                onClick={() => seleccionarOrden(orden)}
                                            >
                                                Seleccionar
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="pedido-sin-resultados">
                                        <p>
                                            No se encontraron órdenes disponibles.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>






                        {mostrarOrdenes && (

                            <div className="pedido-resultados-orden">

                                {ordenesFiltradas.length === 0 ? (

                                    <div className="pedido-sin-resultados">
                                        No se encontraron órdenes.
                                    </div>

                                ) : (

                                    <table>

                                        <thead>

                                            <tr>
                                                <th>Orden</th>
                                                <th>Solicitud</th>
                                                <th>Cliente</th>
                                                <th>Equipo</th>
                                                <th>Técnico</th>
                                                <th>Acción</th>
                                            </tr>

                                        </thead>


                                        <tbody>

                                            {ordenesFiltradas.map(
                                                orden => (

                                                    <tr
                                                        key={
                                                            orden.id
                                                        }
                                                    >

                                                        <td>
                                                            <strong>
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
                                                                orden.cliente
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                orden.equipo
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                orden.marca
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                orden.tecnico
                                                            }
                                                        </td>

                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="btn-seleccionar-pedido"
                                                                onClick={() =>
                                                                    seleccionarOrden(
                                                                        orden
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


                    {ordenSeleccionada && (

                        <>


                            {/* =================================================
                               DATOS GENERALES
                            ================================================= */}

                            <div className="pedido-seccion">

                                <div className="pedido-seccion-header">

                                    <div>

                                        <h3>
                                            Datos del pedido
                                        </h3>

                                    </div>

                                </div>


                                <div className="pedido-info-grid">

                                    <div>
                                        <span>
                                            Orden de reparación
                                        </span>

                                        <strong>
                                            {
                                                ordenSeleccionada.codigoOrden
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Solicitud
                                        </span>

                                        <strong>
                                            {
                                                ordenSeleccionada.codigoSolicitud
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Cliente
                                        </span>

                                        <strong>
                                            {
                                                ordenSeleccionada.cliente
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Equipo
                                        </span>

                                        <strong>
                                            {
                                                ordenSeleccionada.equipo
                                            }{" "}
                                            -{" "}
                                            {
                                                ordenSeleccionada.marca
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Número de serie
                                        </span>

                                        <strong>
                                            {
                                                ordenSeleccionada.numeroSerie
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Técnico
                                        </span>

                                        <strong>
                                            {
                                                ordenSeleccionada.tecnico
                                            }
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                               CONFIGURACIÓN
                            ================================================= */}

                            <div className="pedido-seccion">

                                <div className="pedido-grid">

                                    <div className="campo-pedido">

                                        <label>
                                            Técnico solicitante
                                        </label>

                                        <select
                                            value={
                                                tecnicoSolicitante
                                            }
                                            onChange={e =>
                                                setTecnicoSolicitante(
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
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div className="campo-pedido">

                                        <label>
                                            Prioridad
                                        </label>

                                        <select
                                            value={
                                                prioridad
                                            }
                                            onChange={e =>
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


                                    <div className="campo-pedido">

                                        <label>
                                            Almacén
                                        </label>

                                        <select
                                            value={
                                                almacenDestino
                                            }
                                            onChange={e =>
                                                setAlmacenDestino(
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="">
                                                Seleccionar almacén
                                            </option>

                                            {almacenes.map(
                                                almacen => (

                                                    <option
                                                        key={
                                                            almacen.id
                                                        }
                                                        value={
                                                            almacen.id
                                                        }
                                                    >
                                                        {
                                                            almacen.nombre
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                               REPUESTOS
                            ================================================= */}

                            <div className="pedido-seccion">

                                <div className="pedido-seccion-header">

                                    <div>

                                        <h3>
                                            Repuestos solicitados
                                        </h3>

                                        <p>
                                            Controle cantidades solicitadas, aprobadas, entregadas y utilizadas.
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className="btn-agregar-repuesto-pedido"
                                        onClick={
                                            agregarRepuesto
                                        }
                                    >
                                        + Agregar repuesto
                                    </button>

                                </div>


                                <div className="pedido-repuestos-tabla">

                                    <table>

                                        <thead>

                                            <tr>
                                                <th>Código</th>
                                                <th>Repuesto</th>
                                                <th>Solicitado</th>
                                                <th>Stock</th>
                                                <th>Aprobado</th>
                                                <th>Entregado</th>
                                                <th>Utilizado</th>
                                                <th>Devuelto</th>
                                                <th>Estado</th>
                                                <th>Acción</th>
                                            </tr>

                                        </thead>


                                        <tbody>

                                            {detalles.map(
                                                detalle => (

                                                    <tr
                                                        key={
                                                            detalle.id
                                                        }
                                                    >

                                                        <td>

                                                            <select
                                                                value={
                                                                    detalle.codigo
                                                                }
                                                                onChange={e =>
                                                                    seleccionarRepuesto(
                                                                        detalle.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            >

                                                                <option value="">
                                                                    Seleccionar
                                                                </option>

                                                                {repuestosDisponibles.map(
                                                                    repuesto => (

                                                                        <option
                                                                            key={
                                                                                repuesto.id
                                                                            }
                                                                            value={
                                                                                repuesto.codigo
                                                                            }
                                                                        >
                                                                            {
                                                                                repuesto.codigo
                                                                            }
                                                                        </option>

                                                                    )
                                                                )}

                                                            </select>

                                                        </td>


                                                        <td>

                                                            <input
                                                                type="text"
                                                                value={
                                                                    detalle.descripcion
                                                                }
                                                                readOnly
                                                                placeholder="Repuesto"
                                                            />

                                                        </td>


                                                        <td>

                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    detalle.cantidadSolicitada
                                                                }
                                                                onChange={e =>
                                                                    actualizarDetalle(
                                                                        detalle.id,
                                                                        "cantidadSolicitada",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />

                                                        </td>


                                                        <td>

                                                            <span className="stock-pedido">
                                                                {
                                                                    detalle.stockDisponible
                                                                }
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={
                                                                    detalle.cantidadAprobada
                                                                }
                                                                onChange={e =>
                                                                    actualizarDetalle(
                                                                        detalle.id,
                                                                        "cantidadAprobada",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />

                                                        </td>


                                                        <td>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={
                                                                    detalle.cantidadEntregada
                                                                }
                                                                onChange={e =>
                                                                    actualizarDetalle(
                                                                        detalle.id,
                                                                        "cantidadEntregada",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />

                                                        </td>


                                                        <td>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={
                                                                    detalle.cantidadUtilizada
                                                                }
                                                                onChange={e =>
                                                                    actualizarDetalle(
                                                                        detalle.id,
                                                                        "cantidadUtilizada",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />

                                                        </td>


                                                        <td>

                                                            <span className="cantidad-devuelta">
                                                                {
                                                                    detalle.cantidadDevuelta
                                                                }
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <select
                                                                value={
                                                                    detalle.estado
                                                                }
                                                                onChange={e =>
                                                                    actualizarDetalle(
                                                                        detalle.id,
                                                                        "estado",
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

                                                                <option value="Sin stock">
                                                                    Sin stock
                                                                </option>

                                                                <option value="Entregado">
                                                                    Entregado
                                                                </option>

                                                                <option value="Utilizado">
                                                                    Utilizado
                                                                </option>

                                                            </select>

                                                        </td>


                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="btn-eliminar-detalle-pedido"
                                                                onClick={() =>
                                                                    eliminarDetalle(
                                                                        detalle.id
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


                            {/* =================================================
                               MOTIVO
                            ================================================= */}

                            <div className="pedido-seccion">

                                <div className="pedido-grid">

                                    <div className="campo-pedido campo-completo">

                                        <label>
                                            Motivo / justificación
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                motivoPedido
                                            }
                                            onChange={e =>
                                                setMotivoPedido(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Indique por qué se requieren estos repuestos..."
                                        />

                                    </div>


                                    <div className="campo-pedido campo-completo">

                                        <label>
                                            Observaciones
                                        </label>

                                        <textarea
                                            rows="3"
                                            value={
                                                observacionesPedido
                                            }
                                            onChange={e =>
                                                setObservacionesPedido(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Observaciones adicionales..."
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                               ACCIONES
                            ================================================= */}

                            <div className="pedido-form-actions">

                                <button
                                    type="button"
                                    className="btn-cancelar-pedido"
                                    onClick={
                                        cancelarFormulario
                                    }
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="btn-guardar-pedido"
                                >
                                    {modoEdicion
                                        ? "Actualizar pedido"
                                        : "Guardar pedido"}
                                </button>

                            </div>

                        </>

                    )}

                </form>

            )}


            {/* =================================================
               FORMULARIO DEVOLUCIÓN
            ================================================= */}

            {mostrarFormularioDevolucion && (

                <form
                    className="pedido-formulario"
                    onSubmit={
                        guardarDevolucion
                    }
                >

                    <div className="pedido-form-header">

                        <div>

                            <h2>
                                Nueva devolución de repuestos
                            </h2>

                            <p>
                                Documento de retorno de repuestos no utilizados
                            </p>

                        </div>


                        <button
                            type="button"
                            className="btn-cerrar-pedido"
                            onClick={() => {

                                setMostrarFormularioDevolucion(
                                    false
                                );

                                setPedidoDevolucion(
                                    null
                                );

                            }}
                        >
                            ×
                        </button>

                    </div>


                    {pedidoDevolucion && (

                        <>

                            <div className="pedido-seccion">

                                <div className="pedido-info-grid">

                                    <div>
                                        <span>
                                            Pedido
                                        </span>

                                        <strong>
                                            {
                                                pedidoDevolucion.codigoPedido
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Orden
                                        </span>

                                        <strong>
                                            {
                                                pedidoDevolucion.codigoOrden
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Cliente
                                        </span>

                                        <strong>
                                            {
                                                pedidoDevolucion.cliente
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Equipo
                                        </span>

                                        <strong>
                                            {
                                                pedidoDevolucion.equipo
                                            }
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            <div className="pedido-seccion">

                                <div className="pedido-seccion-header">

                                    <div>

                                        <h3>
                                            Repuestos a devolver
                                        </h3>

                                        <p>
                                            Registre únicamente los repuestos que retornarán al almacén.
                                        </p>

                                    </div>

                                </div>


                                <div className="pedido-repuestos-tabla">

                                    <table>

                                        <thead>

                                            <tr>
                                                <th>Código</th>
                                                <th>Repuesto</th>
                                                <th>Entregado</th>
                                                <th>Utilizado</th>
                                                <th>Ya devuelto</th>
                                                <th>A devolver</th>
                                                <th>Estado</th>
                                            </tr>

                                        </thead>


                                        <tbody>

                                            {detallesDevolucion.map(
                                                detalle => (

                                                    <tr
                                                        key={
                                                            detalle.id
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                detalle.codigo
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                detalle.descripcion
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                detalle.cantidadEntregada
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                detalle.cantidadUtilizada
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                detalle.cantidadYaDevuelta
                                                            }
                                                        </td>

                                                        <td>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={
                                                                    detalle.cantidadDevolver
                                                                }
                                                                onChange={e =>
                                                                    actualizarDetalleDevolucion(
                                                                        detalle.id,
                                                                        "cantidadDevolver",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />

                                                        </td>

                                                        <td>

                                                            <select
                                                                value={
                                                                    detalle.estadoRepuesto
                                                                }
                                                                onChange={e =>
                                                                    actualizarDetalleDevolucion(
                                                                        detalle.id,
                                                                        "estadoRepuesto",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            >

                                                                <option value="Nuevo">
                                                                    Nuevo
                                                                </option>

                                                                <option value="Sin abrir">
                                                                    Sin abrir
                                                                </option>

                                                                <option value="Abierto">
                                                                    Abierto
                                                                </option>

                                                                <option value="Usado parcialmente">
                                                                    Usado parcialmente
                                                                </option>

                                                                <option value="Dañado">
                                                                    Dañado
                                                                </option>

                                                                <option value="Defectuoso">
                                                                    Defectuoso
                                                                </option>

                                                            </select>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>


                            <div className="pedido-seccion">

                                <div className="pedido-grid">

                                    <div className="campo-pedido campo-completo">

                                        <label>
                                            Motivo de devolución
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                motivoDevolucion
                                            }
                                            onChange={e =>
                                                setMotivoDevolucion(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ej. Repuesto no utilizado durante la reparación..."
                                        />

                                    </div>


                                    <div className="campo-pedido campo-completo">

                                        <label>
                                            Observaciones
                                        </label>

                                        <textarea
                                            rows="3"
                                            value={
                                                observacionesDevolucion
                                            }
                                            onChange={e =>
                                                setObservacionesDevolucion(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Indique cualquier observación sobre el repuesto devuelto..."
                                        />

                                    </div>

                                </div>

                            </div>


                            <div className="pedido-form-actions">

                                <button
                                    type="button"
                                    className="btn-cancelar-pedido"
                                    onClick={() => {

                                        setMostrarFormularioDevolucion(
                                            false
                                        );

                                        setPedidoDevolucion(
                                            null
                                        );

                                    }}
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="btn-guardar-pedido"
                                >
                                    Generar devolución
                                </button>

                            </div>

                        </>

                    )}

                </form>

            )}


            {/* =================================================
               LISTADOS
            ================================================= */}

            {!mostrarFormulario &&
                !mostrarFormularioDevolucion && (


                    <>


                        {/* =================================================
                           PEDIDOS
                        ================================================= */}

                        {pestanaActiva === "pedidos" && (

                            <>

                                <div className="pedido-filtros">

                                    <input
                                        type="text"
                                        placeholder="Buscar pedido, orden o cliente..."
                                        value={
                                            busquedaPedido
                                        }
                                        onChange={e =>
                                            setBusquedaPedido(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <select
                                        value={
                                            filtroEstadoPedido
                                        }
                                        onChange={e =>
                                            setFiltroEstadoPedido(
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

                                        <option value="Atendido parcialmente">
                                            Atendido parcialmente
                                        </option>

                                        <option value="Atendido">
                                            Atendido
                                        </option>

                                    </select>

                                </div>


                                <div className="pedido-tabla-container">

                                    <table>

                                        <thead>

                                            <tr>
                                                <th>Pedido</th>
                                                <th>Orden</th>
                                                <th>Fecha</th>
                                                <th>Cliente</th>
                                                <th>Técnico</th>
                                                <th>Repuestos</th>
                                                <th>Prioridad</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>

                                        </thead>


                                        <tbody>

                                            {pedidosFiltrados.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="9"
                                                        className="pedido-tabla-vacia"
                                                    >
                                                        No hay pedidos de repuestos registrados.
                                                    </td>

                                                </tr>

                                            ) : (

                                                pedidosFiltrados.map(
                                                    pedido => (

                                                        <tr
                                                            key={
                                                                pedido.id
                                                            }
                                                        >

                                                            <td>
                                                                <strong className="codigo-pedido">
                                                                    {
                                                                        pedido.codigoPedido
                                                                    }
                                                                </strong>
                                                            </td>

                                                            <td>
                                                                {
                                                                    pedido.codigoOrden
                                                                }
                                                            </td>

                                                            <td>
                                                                {formatearFecha(
                                                                    pedido.fecha
                                                                )}
                                                            </td>

                                                            <td>
                                                                {
                                                                    pedido.cliente
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    tecnicos.find(
                                                                        tecnico =>
                                                                            String(
                                                                                tecnico.id
                                                                            ) ===
                                                                            String(
                                                                                pedido.tecnicoSolicitante
                                                                            )
                                                                    )?.nombre ||
                                                                    "Sin asignar"
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    pedido.detalles.length
                                                                }
                                                            </td>

                                                            <td>

                                                                <span
                                                                    className={`prioridad-pedido prioridad-${pedido.prioridad.toLowerCase()}`}
                                                                >
                                                                    {
                                                                        pedido.prioridad
                                                                    }
                                                                </span>

                                                            </td>

                                                            <td>

                                                                <span
                                                                    className={`estado-pedido estado-${pedido.estado
                                                                        .toLowerCase()
                                                                        .replaceAll(
                                                                            " ",
                                                                            "-"
                                                                        )}`}
                                                                >
                                                                    {
                                                                        pedido.estado
                                                                    }
                                                                </span>

                                                            </td>

                                                            <td>

                                                                <button
                                                                    className="btn-accion-pedido"
                                                                    onClick={() =>
                                                                        editarPedido(
                                                                            pedido
                                                                        )
                                                                    }
                                                                >
                                                                    Editar
                                                                </button>


                                                                <button
                                                                    className="btn-accion-pedido btn-eliminar-pedido"
                                                                    onClick={() =>
                                                                        eliminarPedido(
                                                                            pedido
                                                                        )
                                                                    }
                                                                >
                                                                    Eliminar
                                                                </button>


                                                                <button
                                                                    className="btn-accion-pedido btn-devolucion-pedido"
                                                                    onClick={() =>
                                                                        abrirDevolucion(
                                                                            pedido
                                                                        )
                                                                    }
                                                                >
                                                                    Devolver
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


                        {/* =================================================
                           ENTREGAS
                        ================================================= */}

                        {pestanaActiva === "entregas" && (

                            <div className="pedido-tabla-container">

                                <table>

                                    <thead>

                                        <tr>
                                            <th>Pedido</th>
                                            <th>Orden</th>
                                            <th>Cliente</th>
                                            <th>Repuesto</th>
                                            <th>Solicitado</th>
                                            <th>Aprobado</th>
                                            <th>Entregado</th>
                                            <th>Pendiente</th>
                                            <th>Estado</th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {pedidos.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="9"
                                                    className="pedido-tabla-vacia"
                                                >
                                                    No existen entregas registradas.
                                                </td>

                                            </tr>

                                        ) : (

                                            pedidos.flatMap(
                                                pedido =>

                                                    pedido.detalles.map(
                                                        detalle => {

                                                            const pendiente =
                                                                Math.max(
                                                                    detalle.cantidadAprobada -
                                                                    detalle.cantidadEntregada,
                                                                    0
                                                                );

                                                            return (

                                                                <tr
                                                                    key={`${pedido.id}-${detalle.id}`}
                                                                >

                                                                    <td>
                                                                        {
                                                                            pedido.codigoPedido
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            pedido.codigoOrden
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            pedido.cliente
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            detalle.descripcion
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            detalle.cantidadSolicitada
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            detalle.cantidadAprobada
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            detalle.cantidadEntregada
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            pendiente
                                                                        }
                                                                    </td>

                                                                    <td>

                                                                        <span className="estado-entrega-pedido">

                                                                            {
                                                                                pendiente >
                                                                                0
                                                                                    ? "Pendiente"
                                                                                    : "Entregado"
                                                                            }

                                                                        </span>

                                                                    </td>

                                                                </tr>

                                                            );
                                                        }
                                                    )
                                            )

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}


                        {/* =================================================
                           DEVOLUCIONES
                        ================================================= */}

                        {pestanaActiva === "devoluciones" && (

                            <>

                                <div className="pedido-filtros">

                                    <input
                                        type="text"
                                        placeholder="Buscar devolución, pedido u orden..."
                                        value={
                                            busquedaDevolucion
                                        }
                                        onChange={e =>
                                            setBusquedaDevolucion(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <select
                                        value={
                                            filtroEstadoDevolucion
                                        }
                                        onChange={e =>
                                            setFiltroEstadoDevolucion(
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

                                        <option value="Recibida">
                                            Recibida
                                        </option>

                                        <option value="Observada">
                                            Observada
                                        </option>

                                        <option value="Cancelada">
                                            Cancelada
                                        </option>

                                    </select>

                                </div>


                                <div className="pedido-tabla-container">

                                    <table>

                                        <thead>

                                            <tr>
                                                <th>Devolución</th>
                                                <th>Pedido</th>
                                                <th>Orden</th>
                                                <th>Fecha</th>
                                                <th>Cliente</th>
                                                <th>Repuestos</th>
                                                <th>Almacén</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>

                                        </thead>


                                        <tbody>

                                            {devolucionesFiltradas.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="9"
                                                        className="pedido-tabla-vacia"
                                                    >
                                                        No hay devoluciones registradas.
                                                    </td>

                                                </tr>

                                            ) : (

                                                devolucionesFiltradas.map(
                                                    devolucion => (

                                                        <tr
                                                            key={
                                                                devolucion.id
                                                            }
                                                        >

                                                            <td>

                                                                <strong className="codigo-devolucion">
                                                                    {
                                                                        devolucion.codigoDevolucion
                                                                    }
                                                                </strong>

                                                            </td>

                                                            <td>
                                                                {
                                                                    devolucion.codigoPedido
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    devolucion.codigoOrden
                                                                }
                                                            </td>

                                                            <td>
                                                                {formatearFecha(
                                                                    devolucion.fecha
                                                                )}
                                                            </td>

                                                            <td>
                                                                {
                                                                    devolucion.cliente
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    devolucion.detalles.length
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    almacenes.find(
                                                                        almacen =>
                                                                            String(
                                                                                almacen.id
                                                                            ) ===
                                                                            String(
                                                                                devolucion.almacen
                                                                            )
                                                                    )?.nombre ||
                                                                    "-"
                                                                }
                                                            </td>

                                                            <td>

                                                                <span className="estado-devolucion-pedido">
                                                                    {
                                                                        devolucion.estado
                                                                    }
                                                                </span>

                                                            </td>

                                                            <td>

                                                                <button
                                                                    className="btn-accion-pedido"
                                                                    onClick={() =>
                                                                        imprimirDevolucion(
                                                                            devolucion
                                                                        )
                                                                    }
                                                                >
                                                                    Imprimir
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

                    </>

                )}

        </div>
    );
}


export default PedidoRepuestos;