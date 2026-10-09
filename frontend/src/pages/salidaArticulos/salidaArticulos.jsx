import { useState } from "react";
import "./salidaArticulos.css";

const SALIDAS_INICIALES = [
    {
        id: 1,
        codigo: "SAL-000001",
        fecha: "26/09/2026",
        almacen: "Almacén Principal",
        tipo: "Servicio técnico",
        referencia: "OR-000001",
        solicitud: "ST-000001",
        cliente: "Juan Pérez",
        responsable: "Carlos Mendoza",
        cantidadArticulos: 3,
        cantidadTotal: 4,
        estado: "EMITIDA",
        observaciones: "Repuestos entregados para reparación."
    },
    {
        id: 2,
        codigo: "SAL-000002",
        fecha: "25/09/2026",
        almacen: "Almacén de Repuestos",
        tipo: "Servicio técnico",
        referencia: "OR-000002",
        solicitud: "ST-000002",
        cliente: "Empresa ABC S.A.C.",
        responsable: "Luis Ramírez",
        cantidadArticulos: 2,
        cantidadTotal: 3,
        estado: "PENDIENTE",
        observaciones: ""
    },
    {
        id: 3,
        codigo: "SAL-000003",
        fecha: "23/09/2026",
        almacen: "Almacén Principal",
        tipo: "Consumo interno",
        referencia: "-",
        solicitud: "-",
        cliente: "-",
        responsable: "Miguel Torres",
        cantidadArticulos: 1,
        cantidadTotal: 2,
        estado: "BORRADOR",
        observaciones: "Material utilizado para mantenimiento interno."
    }
];

const ORDENES_EJEMPLO = [
    {
        id: 1,
        codigo: "OR-000001",
        solicitud: "ST-000001",
        cliente: "Juan Pérez",
        equipo: "Laptop Lenovo ThinkPad E14",
        tecnico: "Carlos Mendoza",
        prioridad: "Alta",
        estado: "En reparación"
    },
    {
        id: 2,
        codigo: "OR-000002",
        solicitud: "ST-000002",
        cliente: "Empresa ABC S.A.C.",
        equipo: "PC HP ProDesk 400",
        tecnico: "Luis Ramírez",
        prioridad: "Normal",
        estado: "En reparación"
    },
    {
        id: 3,
        codigo: "OR-000003",
        solicitud: "ST-000003",
        cliente: "Carlos López",
        equipo: "Laptop HP 250 G8",
        tecnico: "Miguel Torres",
        prioridad: "Normal",
        estado: "En reparación"
    }
];

const REPUESTOS_EJEMPLO = [
    {
        id: 1,
        codigo: "REP-001",
        nombre: "SSD 480 GB",
        stock: 8,
        solicitado: 1
    },
    {
        id: 2,
        codigo: "REP-015",
        nombre: "Memoria RAM 8 GB",
        stock: 12,
        solicitado: 2
    },
    {
        id: 3,
        codigo: "REP-021",
        nombre: "Pasta térmica",
        stock: 20,
        solicitado: 1
    },
    {
        id: 4,
        codigo: "REP-032",
        nombre: "Ventilador para laptop",
        stock: 5,
        solicitado: 1
    }
];

function SalidaArticulos() {
    const [salidas, setSalidas] = useState(SALIDAS_INICIALES);

    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroTipo, setFiltroTipo] = useState("Todos");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarOrdenes, setMostrarOrdenes] = useState(false);

    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

    const [tipoSalida, setTipoSalida] = useState("Servicio técnico");
    const [almacen, setAlmacen] = useState("");
    const [responsable, setResponsable] = useState("");
    const [observaciones, setObservaciones] = useState("");

    const [articulos, setArticulos] = useState([]);

    const salidasFiltradas = salidas.filter((salida) => {
        const texto = busqueda.toLowerCase();

        const coincideBusqueda =
            salida.codigo.toLowerCase().includes(texto) ||
            salida.referencia.toLowerCase().includes(texto) ||
            salida.solicitud.toLowerCase().includes(texto) ||
            salida.cliente.toLowerCase().includes(texto) ||
            salida.responsable.toLowerCase().includes(texto);

        const coincideEstado =
            filtroEstado === "Todos" ||
            salida.estado === filtroEstado;

        const coincideTipo =
            filtroTipo === "Todos" ||
            salida.tipo === filtroTipo;

        return coincideBusqueda && coincideEstado && coincideTipo;
    });

    const seleccionarOrden = (orden) => {
        setOrdenSeleccionada(orden);
        setMostrarOrdenes(false);

        setResponsable(orden.tecnico);

        const articulosIniciales = REPUESTOS_EJEMPLO
            .slice(0, 3)
            .map((repuesto) => ({
                ...repuesto,
                entregar: repuesto.solicitado
            }));

        setArticulos(articulosIniciales);
    };

    const cambiarCantidad = (id, cantidad) => {
        const valor = Number(cantidad);

        setArticulos(
            articulos.map((articulo) => {
                if (articulo.id !== id) {
                    return articulo;
                }

                return {
                    ...articulo,
                    entregar: Math.max(
                        0,
                        Math.min(valor, articulo.solicitado, articulo.stock)
                    )
                };
            })
        );
    };

    const crearSalida = (e) => {
        e.preventDefault();

        if (!almacen) {
            alert("Selecciona el almacén.");
            return;
        }

        if (!responsable) {
            alert("Selecciona el responsable.");
            return;
        }

        if (
            tipoSalida === "Servicio técnico" &&
            !ordenSeleccionada
        ) {
            alert("Selecciona una orden de reparación.");
            return;
        }

        if (articulos.length === 0) {
            alert("Agrega al menos un artículo.");
            return;
        }

        const hayCantidad = articulos.some(
            (articulo) => articulo.entregar > 0
        );

        if (!hayCantidad) {
            alert("La salida debe tener al menos una cantidad.");
            return;
        }

        const siguienteNumero = salidas.length + 1;

        const nuevaSalida = {
            //id: Date.now(),
            id: salidas.length + 1,
            codigo: `SAL-${String(siguienteNumero).padStart(6, "0")}`,
            fecha: new Date().toLocaleDateString("es-PE"),
            almacen,
            tipo: tipoSalida,
            referencia: ordenSeleccionada
                ? ordenSeleccionada.codigo
                : "-",
            solicitud: ordenSeleccionada
                ? ordenSeleccionada.solicitud
                : "-",
            cliente: ordenSeleccionada
                ? ordenSeleccionada.cliente
                : "-",
            responsable,
            cantidadArticulos: articulos.filter(
                (articulo) => articulo.entregar > 0
            ).length,
            cantidadTotal: articulos.reduce(
                (total, articulo) =>
                    total + articulo.entregar,
                0
            ),
            estado: "BORRADOR",
            observaciones
        };

        setSalidas([nuevaSalida, ...salidas]);

        limpiarFormulario();

        alert(
            `Salida ${nuevaSalida.codigo} creada correctamente.`
        );
    };

    const emitirSalida = (salida) => {
        const confirmar = window.confirm(
            `¿Deseas emitir la salida ${salida.codigo}?`
        );

        if (!confirmar) return;

        setSalidas(
            salidas.map((item) =>
                item.id === salida.id
                    ? {
                          ...item,
                          estado: "EMITIDA"
                      }
                    : item
            )
        );

        alert(
            `${salida.codigo} emitida correctamente. El movimiento afectará el inventario.`
        );
    };

    const anularSalida = (salida) => {
        if (salida.estado === "ANULADA") {
            return;
        }

        const confirmar = window.confirm(
            `¿Deseas anular la salida ${salida.codigo}?`
        );

        if (!confirmar) return;

        setSalidas(
            salidas.map((item) =>
                item.id === salida.id
                    ? {
                          ...item,
                          estado: "ANULADA"
                      }
                    : item
            )
        );
    };

    const eliminarSalida = (salida) => {
        if (salida.estado !== "BORRADOR") {
            alert(
                "Solo se pueden eliminar salidas que estén en BORRADOR."
            );
            return;
        }

        const confirmar = window.confirm(
            `¿Deseas eliminar ${salida.codigo}?`
        );

        if (!confirmar) return;

        setSalidas(
            salidas.filter((item) => item.id !== salida.id)
        );
    };

    const limpiarFormulario = () => {
        setMostrarFormulario(false);
        setMostrarOrdenes(false);
        setOrdenSeleccionada(null);
        setTipoSalida("Servicio técnico");
        setAlmacen("");
        setResponsable("");
        setObservaciones("");
        setArticulos([]);
    };

    return (
        <div className="salida-articulos-container">

            <div className="salida-articulos-header">

                <div>
                    <h1>Salida de artículos</h1>

                    <p>
                        Registro y control de artículos que salen del almacén.
                    </p>
                </div>

                <button
                    className="btn-nueva-salida"
                    onClick={() => setMostrarFormulario(true)}
                >
                    + Nueva salida
                </button>

            </div>


            <div className="salida-filtros">

                <input
                    type="text"
                    placeholder="Buscar por código, orden, cliente o responsable..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <select
                    value={filtroTipo}
                    onChange={(e) =>
                        setFiltroTipo(e.target.value)
                    }
                >
                    <option value="Todos">
                        Todos los tipos
                    </option>

                    <option value="Servicio técnico">
                        Servicio técnico
                    </option>

                    <option value="Consumo interno">
                        Consumo interno
                    </option>

                    <option value="Traslado">
                        Traslado
                    </option>

                    <option value="Otros">
                        Otros
                    </option>
                </select>

                <select
                    value={filtroEstado}
                    onChange={(e) =>
                        setFiltroEstado(e.target.value)
                    }
                >
                    <option value="Todos">
                        Todos los estados
                    </option>

                    <option value="BORRADOR">
                        Borrador
                    </option>

                    <option value="PENDIENTE">
                        Pendiente
                    </option>

                    <option value="EMITIDA">
                        Emitida
                    </option>

                    <option value="ANULADA">
                        Anulada
                    </option>
                </select>

            </div>


            <div className="salidas-lista">

                {salidasFiltradas.length === 0 ? (

                    <div className="salida-vacia">
                        No se encontraron salidas de artículos.
                    </div>

                ) : (

                    salidasFiltradas.map((salida) => (

                        <div
                            className="salida-card"
                            key={salida.id}
                        >

                            <div className="salida-card-header">

                                <div className="salida-card-titulo">

                                    <strong>
                                        {salida.codigo}
                                    </strong>

                                    <span
                                        className={`salida-estado estado-${salida.estado.toLowerCase()}`}
                                    >
                                        {salida.estado}
                                    </span>

                                </div>

                                <span className="salida-fecha">
                                    {salida.fecha}
                                </span>

                            </div>


                            <div className="salida-card-info">

                                <div>
                                    <span>Almacén</span>
                                    <strong>
                                        {salida.almacen}
                                    </strong>
                                </div>

                                <div>
                                    <span>Tipo</span>
                                    <strong>
                                        {salida.tipo}
                                    </strong>
                                </div>

                                <div>
                                    <span>Referencia</span>
                                    <strong>
                                        {salida.referencia}
                                    </strong>
                                </div>

                                <div>
                                    <span>Cliente</span>
                                    <strong>
                                        {salida.cliente}
                                    </strong>
                                </div>

                                <div>
                                    <span>Artículos</span>
                                    <strong>
                                        {salida.cantidadArticulos}
                                    </strong>
                                </div>

                                <div>
                                    <span>Cantidad total</span>
                                    <strong>
                                        {salida.cantidadTotal}
                                    </strong>
                                </div>

                                <div>
                                    <span>Responsable</span>
                                    <strong>
                                        {salida.responsable}
                                    </strong>
                                </div>

                            </div>


                            <div className="salida-card-acciones">

                                <button className="btn-salida-ver">
                                    Ver
                                </button>

                                <button className="btn-salida-imprimir">
                                    Imprimir
                                </button>

                                {salida.estado === "BORRADOR" && (
                                    <>
                                        <button
                                            className="btn-salida-emitir"
                                            onClick={() =>
                                                emitirSalida(salida)
                                            }
                                        >
                                            Emitir
                                        </button>

                                        <button
                                            className="btn-salida-eliminar"
                                            onClick={() =>
                                                eliminarSalida(salida)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}

                                {salida.estado === "EMITIDA" && (
                                    <button
                                        className="btn-salida-anular"
                                        onClick={() =>
                                            anularSalida(salida)
                                        }
                                    >
                                        Anular
                                    </button>
                                )}

                            </div>

                        </div>

                    ))

                )}

            </div>


            {mostrarFormulario && (

                <div className="modal-salida">

                    <div className="modal-salida-contenido">

                        <div className="modal-salida-header">

                            <div>
                                <h2>
                                    Nueva salida de artículos
                                </h2>

                                <p>
                                    Registra los artículos que saldrán del almacén.
                                </p>
                            </div>

                            <button
                                className="btn-cerrar-salida"
                                onClick={limpiarFormulario}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={crearSalida}>

                            <div className="salida-form-grid">

                                <div className="salida-form-group">

                                    <label>
                                        Tipo de salida *
                                    </label>

                                    <select
                                        value={tipoSalida}
                                        onChange={(e) =>
                                            setTipoSalida(e.target.value)
                                        }
                                    >
                                        <option>
                                            Servicio técnico
                                        </option>

                                        <option>
                                            Consumo interno
                                        </option>

                                        <option>
                                            Traslado
                                        </option>

                                        <option>
                                            Otros
                                        </option>
                                    </select>

                                </div>


                                <div className="salida-form-group">

                                    <label>
                                        Almacén *
                                    </label>

                                    <select
                                        value={almacen}
                                        onChange={(e) =>
                                            setAlmacen(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Seleccionar almacén
                                        </option>

                                        <option>
                                            Almacén Principal
                                        </option>

                                        <option>
                                            Almacén de Repuestos
                                        </option>
                                    </select>

                                </div>

                            </div>


                            {tipoSalida === "Servicio técnico" && (

                                <div className="salida-seccion">

                                    <div className="salida-seccion-header">

                                        <div>
                                            <h3>
                                                Orden de reparación
                                            </h3>

                                            <p>
                                                Selecciona la orden a la que corresponden los artículos.
                                            </p>
                                        </div>

                                        {!ordenSeleccionada && (
                                            <button
                                                type="button"
                                                className="btn-seleccionar-orden-salida"
                                                onClick={() =>
                                                    setMostrarOrdenes(
                                                        !mostrarOrdenes
                                                    )
                                                }
                                            >
                                                Seleccionar orden
                                            </button>
                                        )}

                                    </div>


                                    {ordenSeleccionada && (

                                        <div className="orden-seleccionada-salida">

                                            <div>
                                                <strong>
                                                    {ordenSeleccionada.codigo}
                                                </strong>

                                                <span>
                                                    {ordenSeleccionada.cliente}
                                                </span>

                                                <small>
                                                    {ordenSeleccionada.equipo}
                                                </small>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOrdenSeleccionada(null);
                                                    setArticulos([]);
                                                }}
                                            >
                                                Cambiar
                                            </button>

                                        </div>

                                    )}


                                    {mostrarOrdenes && (

                                        <div className="ordenes-salida-lista">

                                            {ORDENES_EJEMPLO.map(
                                                (orden) => (

                                                    <div
                                                        className="orden-salida-card"
                                                        key={orden.id}
                                                    >

                                                        <div>

                                                            <strong>
                                                                {orden.codigo}
                                                            </strong>

                                                            <span>
                                                                {orden.cliente}
                                                            </span>

                                                            <small>
                                                                {orden.equipo}
                                                            </small>

                                                            <small>
                                                                Técnico:{" "}
                                                                {orden.tecnico}
                                                            </small>

                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                seleccionarOrden(
                                                                    orden
                                                                )
                                                            }
                                                        >
                                                            Seleccionar
                                                        </button>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            )}


                            <div className="salida-seccion">

                                <div className="salida-seccion-header">

                                    <div>
                                        <h3>
                                            Artículos
                                        </h3>

                                        <p>
                                            Cantidades que serán entregadas.
                                        </p>
                                    </div>

                                </div>


                                {articulos.length === 0 ? (

                                    <div className="articulos-vacio">
                                        Selecciona una orden para cargar los artículos autorizados.
                                    </div>

                                ) : (

                                    <div className="tabla-articulos-salida">

                                        <div className="tabla-salida-header">
                                            <span>Código</span>
                                            <span>Artículo</span>
                                            <span>Stock</span>
                                            <span>Solicitado</span>
                                            <span>Entregar</span>
                                        </div>

                                        {articulos.map(
                                            (articulo) => (

                                                <div
                                                    className="tabla-salida-row"
                                                    key={articulo.id}
                                                >

                                                    <span>
                                                        {articulo.codigo}
                                                    </span>

                                                    <span>
                                                        {articulo.nombre}
                                                    </span>

                                                    <span>
                                                        {articulo.stock}
                                                    </span>

                                                    <span>
                                                        {articulo.solicitado}
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={Math.min(
                                                            articulo.solicitado,
                                                            articulo.stock
                                                        )}
                                                        value={
                                                            articulo.entregar
                                                        }
                                                        onChange={(e) =>
                                                            cambiarCantidad(
                                                                articulo.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>


                            <div className="salida-form-group">

                                <label>
                                    Responsable *
                                </label>

                                <input
                                    type="text"
                                    placeholder="Responsable de la salida"
                                    value={responsable}
                                    onChange={(e) =>
                                        setResponsable(e.target.value)
                                    }
                                />

                            </div>


                            <div className="salida-form-group">

                                <label>
                                    Observaciones
                                </label>

                                <textarea
                                    rows="3"
                                    placeholder="Observaciones..."
                                    value={observaciones}
                                    onChange={(e) =>
                                        setObservaciones(e.target.value)
                                    }
                                />

                            </div>


                            <div className="modal-salida-acciones">

                                <button
                                    type="button"
                                    className="btn-cancelar-salida"
                                    onClick={limpiarFormulario}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn-guardar-salida"
                                >
                                    Crear salida
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default SalidaArticulos;