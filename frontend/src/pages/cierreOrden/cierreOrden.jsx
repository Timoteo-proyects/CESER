
import { useState } from "react";
import "./cierreOrden.css";

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
        estado: "Control de calidad",
        diagnostico: "Falla en unidad de almacenamiento",
        trabajoRealizado:
            "Reemplazo de SSD y reinstalación del sistema operativo"
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
        estado: "Control de calidad",
        diagnostico: "Equipo no enciende correctamente",
        trabajoRealizado:
            "Revisión de fuente de poder y mantenimiento interno"
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
        estado: "Control de calidad",
        diagnostico: "Sobrecalentamiento del equipo",
        trabajoRealizado:
            "Limpieza interna y cambio de pasta térmica"
    }
];

const REPUESTOS_EJEMPLO = [
    {
        codigoOrden: "OR-000001",
        codigo: "REP-001",
        descripcion: "SSD 500GB SATA",
        entregado: 1,
        utilizado: 1,
        devuelto: 0
    },
    {
        codigoOrden: "OR-000001",
        codigo: "REP-003",
        descripcion: "Pasta térmica",
        entregado: 2,
        utilizado: 1,
        devuelto: 1
    },
    {
        codigoOrden: "OR-000002",
        codigo: "REP-002",
        descripcion: "Memoria RAM 8GB DDR4",
        entregado: 1,
        utilizado: 1,
        devuelto: 0
    },
    {
        codigoOrden: "OR-000003",
        codigo: "REP-003",
        descripcion: "Pasta térmica",
        entregado: 1,
        utilizado: 1,
        devuelto: 0
    }
];

function CierreOrden() {
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [busquedaOrden, setBusquedaOrden] = useState("");

    const [resultadoCalidad, setResultadoCalidad] = useState("");
    const [observacionesCalidad, setObservacionesCalidad] = useState("");
    const [observacionesCierre, setObservacionesCierre] = useState("");

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

    const repuestosOrden = ordenSeleccionada
        ? REPUESTOS_EJEMPLO.filter(
              (repuesto) =>
                  repuesto.codigoOrden === ordenSeleccionada.codigoOrden
          )
        : [];

    const seleccionarOrden = (orden) => {
        setOrdenSeleccionada(orden);
        setResultadoCalidad("");
        setObservacionesCalidad("");
        setObservacionesCierre("");
    };

    const volverOrdenes = () => {
        setOrdenSeleccionada(null);
        setResultadoCalidad("");
        setObservacionesCalidad("");
        setObservacionesCierre("");
    };

    const cerrarOrden = () => {
        if (!resultadoCalidad) {
            alert("Debe seleccionar el resultado del control de calidad.");
            return;
        }

        if (resultadoCalidad === "Rechazado") {
            if (!observacionesCalidad.trim()) {
                alert(
                    "Debe registrar las observaciones cuando el control de calidad es rechazado."
                );
                return;
            }

            alert(
                "El control de calidad fue rechazado. La orden regresará a reparación."
            );

            setOrdenSeleccionada({
                ...ordenSeleccionada,
                estado: "En reparación"
            });

            return;
        }

        if (!observacionesCierre.trim()) {
            alert("Debe registrar una observación de cierre.");
            return;
        }

        const confirmar = window.confirm(
            `¿Está seguro de cerrar la orden ${ordenSeleccionada.codigoOrden}?`
        );

        if (!confirmar) return;

        alert(
            `Orden ${ordenSeleccionada.codigoOrden} cerrada correctamente.`
        );

        setOrdenSeleccionada(null);
        setResultadoCalidad("");
        setObservacionesCalidad("");
        setObservacionesCierre("");
    };

    return (
        <div className="cierre-orden-container">

            {!ordenSeleccionada ? (
                <>
                    <div className="cierre-orden-header">
                        <div>
                            <h1>Cierre de Orden</h1>
                            <p>
                                Seleccione una orden de reparación para realizar
                                el control de calidad y cierre.
                            </p>
                        </div>
                    </div>

                    <div className="cierre-seccion">
                        <div className="cierre-seccion-header">
                            <div>
                                <h3>Órdenes disponibles</h3>
                                <p>
                                    Solo se muestran órdenes listas para
                                    control de calidad.
                                </p>
                            </div>
                        </div>

                        <div className="cierre-busqueda">
                            <input
                                type="text"
                                placeholder="Buscar por código, cliente, equipo, serie o técnico..."
                                value={busquedaOrden}
                                onChange={(e) =>
                                    setBusquedaOrden(e.target.value)
                                }
                            />
                        </div>

                        <div className="cierre-resultados">
                            {ordenesFiltradas.length > 0 ? (
                                ordenesFiltradas.map((orden) => (
                                    <div
                                        key={orden.id}
                                        className="cierre-orden-card"
                                    >
                                        <div className="cierre-orden-info">

                                            <div className="cierre-orden-principal">
                                                <span className="cierre-orden-codigo">
                                                    {orden.codigoOrden}
                                                </span>

                                                <span
                                                    className={`cierre-prioridad cierre-prioridad-${orden.prioridad.toLowerCase()}`}
                                                >
                                                    {orden.prioridad}
                                                </span>
                                            </div>

                                            <div className="cierre-orden-datos">
                                                <strong>
                                                    {orden.cliente}
                                                </strong>

                                                <span>
                                                    {orden.equipo}{" "}
                                                    {orden.marca}{" "}
                                                    {orden.modelo}
                                                </span>

                                                <span>
                                                    S/N: {orden.numeroSerie}
                                                </span>
                                            </div>

                                            <div className="cierre-orden-meta">
                                                <span>
                                                    Solicitud:{" "}
                                                    {orden.codigoSolicitud}
                                                </span>

                                                <span>
                                                    Técnico: {orden.tecnico}
                                                </span>

                                                <span className="cierre-estado">
                                                    {orden.estado}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className="btn-seleccionar-cierre"
                                            onClick={() =>
                                                seleccionarOrden(orden)
                                            }
                                        >
                                            Seleccionar
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="cierre-sin-resultados">
                                    No se encontraron órdenes disponibles.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="cierre-orden-header">
                        <div>
                            <h1>Cierre de Orden</h1>
                            <p>
                                Finalización de la orden{" "}
                                <strong>
                                    {ordenSeleccionada.codigoOrden}
                                </strong>
                            </p>
                        </div>

                        <button
                            className="btn-volver-cierre"
                            onClick={volverOrdenes}
                        >
                            ← Volver a órdenes
                        </button>
                    </div>

                    <div className="cierre-seccion">

                        <div className="cierre-seccion-header">
                            <div>
                                <h3>Información de la orden</h3>
                            </div>
                        </div>

                        <div className="cierre-info-grid">

                            <div className="cierre-info-item">
                                <span>Orden</span>
                                <strong>
                                    {ordenSeleccionada.codigoOrden}
                                </strong>
                            </div>

                            <div className="cierre-info-item">
                                <span>Solicitud</span>
                                <strong>
                                    {ordenSeleccionada.codigoSolicitud}
                                </strong>
                            </div>

                            <div className="cierre-info-item">
                                <span>Cliente</span>
                                <strong>
                                    {ordenSeleccionada.cliente}
                                </strong>
                            </div>

                            <div className="cierre-info-item">
                                <span>Equipo</span>
                                <strong>
                                    {ordenSeleccionada.equipo}{" "}
                                    {ordenSeleccionada.marca}{" "}
                                    {ordenSeleccionada.modelo}
                                </strong>
                            </div>

                            <div className="cierre-info-item">
                                <span>Número de serie</span>
                                <strong>
                                    {ordenSeleccionada.numeroSerie}
                                </strong>
                            </div>

                            <div className="cierre-info-item">
                                <span>Técnico</span>
                                <strong>
                                    {ordenSeleccionada.tecnico}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="cierre-seccion">

                        <div className="cierre-seccion-header">
                            <div>
                                <h3>Resumen de reparación</h3>
                            </div>
                        </div>

                        <div className="cierre-resumen">

                            <div>
                                <span>Diagnóstico</span>
                                <p>
                                    {ordenSeleccionada.diagnostico}
                                </p>
                            </div>

                            <div>
                                <span>Trabajo realizado</span>
                                <p>
                                    {ordenSeleccionada.trabajoRealizado}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="cierre-seccion">

                        <div className="cierre-seccion-header">
                            <div>
                                <h3>Repuestos utilizados</h3>
                                <p>
                                    Resumen de los movimientos realizados
                                    durante la reparación.
                                </p>
                            </div>
                        </div>

                        {repuestosOrden.length > 0 ? (
                            <div className="cierre-tabla-container">
                                <table className="cierre-tabla">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Repuesto</th>
                                            <th>Entregado</th>
                                            <th>Utilizado</th>
                                            <th>Devuelto</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {repuestosOrden.map((repuesto) => (
                                            <tr key={repuesto.codigo}>
                                                <td>
                                                    {repuesto.codigo}
                                                </td>

                                                <td>
                                                    {repuesto.descripcion}
                                                </td>

                                                <td>
                                                    {repuesto.entregado}
                                                </td>

                                                <td>
                                                    {repuesto.utilizado}
                                                </td>

                                                <td>
                                                    {repuesto.devuelto}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="cierre-tabla-vacia">
                                No hay repuestos registrados para esta orden.
                            </div>
                        )}
                    </div>

                    <div className="cierre-seccion">

                        <div className="cierre-seccion-header">
                            <div>
                                <h3>Control de calidad</h3>
                                <p>
                                    Verifique que la reparación haya sido
                                    realizada correctamente.
                                </p>
                            </div>
                        </div>

                        <div className="cierre-calidad">

                            <label className="cierre-radio">
                                <input
                                    type="radio"
                                    name="resultadoCalidad"
                                    value="Aprobado"
                                    checked={
                                        resultadoCalidad === "Aprobado"
                                    }
                                    onChange={(e) =>
                                        setResultadoCalidad(
                                            e.target.value
                                        )
                                    }
                                />

                                <span>
                                    <strong>Aprobado</strong>
                                    <small>
                                        La reparación cumple con los
                                        criterios de calidad.
                                    </small>
                                </span>
                            </label>

                            <label className="cierre-radio">
                                <input
                                    type="radio"
                                    name="resultadoCalidad"
                                    value="Rechazado"
                                    checked={
                                        resultadoCalidad === "Rechazado"
                                    }
                                    onChange={(e) =>
                                        setResultadoCalidad(
                                            e.target.value
                                        )
                                    }
                                />

                                <span>
                                    <strong>Rechazado</strong>
                                    <small>
                                        La reparación requiere correcciones.
                                    </small>
                                </span>
                            </label>
                        </div>

                        <div className="cierre-campo">
                            <label>Observaciones de control de calidad</label>

                            <textarea
                                value={observacionesCalidad}
                                onChange={(e) =>
                                    setObservacionesCalidad(
                                        e.target.value
                                    )
                                }
                                placeholder="Ingrese las observaciones del control de calidad..."
                                rows="4"
                            />
                        </div>
                    </div>

                    {resultadoCalidad === "Aprobado" && (
                        <div className="cierre-seccion">

                            <div className="cierre-seccion-header">
                                <div>
                                    <h3>Observaciones de cierre</h3>
                                    <p>
                                        Registre cualquier información
                                        relevante antes de cerrar la orden.
                                    </p>
                                </div>
                            </div>

                            <div className="cierre-campo">
                                <label>
                                    Observaciones <span>*</span>
                                </label>

                                <textarea
                                    value={observacionesCierre}
                                    onChange={(e) =>
                                        setObservacionesCierre(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ingrese las observaciones finales..."
                                    rows="4"
                                />
                            </div>
                        </div>
                    )}

                    <div className="cierre-acciones">

                        <button
                            className="btn-cancelar-cierre"
                            onClick={volverOrdenes}
                        >
                            Cancelar
                        </button>

                        <button
                            className="btn-cerrar-orden"
                            onClick={cerrarOrden}
                        >
                            {resultadoCalidad === "Rechazado"
                                ? "Enviar a reparación"
                                : "Cerrar orden"}
                        </button>

                    </div>
                </>
            )}
        </div>
    );
}

export default CierreOrden;
