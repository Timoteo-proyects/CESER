
import { useState } from "react";
import "./facturacion.css";


const ORDENES_CERRADAS_EJEMPLO = [
    {
        id: 1,
        codigoOrden: "OR-000001",
        codigoSolicitud: "ST-000001",
        fechaCierre: "2026-09-26",
        cliente: {
            tipoDocumento: "RUC",
            numeroDocumento: "20601234567",
            nombre: "Empresa ABC S.A.C."
        },
        equipo: "Laptop",
        marca: "Lenovo",
        modelo: "ThinkPad E14",
        numeroSerie: "PF3ABC123",
        servicio: {
            descripcion: "Mantenimiento y reparación de laptop",
            precio: 180
        },
        repuestos: [
            {
                codigo: "REP-001",
                descripcion: "SSD 500GB SATA",
                cantidad: 1,
                precio: 250
            },
            {
                codigo: "REP-003",
                descripcion: "Pasta térmica",
                cantidad: 1,
                precio: 25
            }
        ],
        estado: "Cerrada"
    },

    {
        id: 2,
        codigoOrden: "OR-000002",
        codigoSolicitud: "ST-000002",
        fechaCierre: "2026-09-25",
        cliente: {
            tipoDocumento: "DNI",
            numeroDocumento: "74859632",
            nombre: "Carlos López"
        },
        equipo: "PC",
        marca: "HP",
        modelo: "ProDesk 400",
        numeroSerie: "HP778899",
        servicio: {
            descripcion: "Diagnóstico y reparación de PC",
            precio: 120
        },
        repuestos: [
            {
                codigo: "REP-002",
                descripcion: "Memoria RAM 8GB DDR4",
                cantidad: 1,
                precio: 140
            }
        ],
        estado: "Cerrada"
    },

    {
        id: 3,
        codigoOrden: "OR-000003",
        codigoSolicitud: "ST-000003",
        fechaCierre: "2026-09-24",
        cliente: {
            tipoDocumento: "RUC",
            numeroDocumento: "20507894561",
            nombre: "Servicios Tecnológicos Perú S.A.C."
        },
        equipo: "Laptop",
        marca: "HP",
        modelo: "250 G8",
        numeroSerie: "HP250123",
        servicio: {
            descripcion: "Mantenimiento preventivo",
            precio: 150
        },
        repuestos: [],
        estado: "Cerrada"
    }
];


function Facturacion() {

    const [ordenes] = useState(
        ORDENES_CERRADAS_EJEMPLO
    );

    const [ordenSeleccionada, setOrdenSeleccionada] =
        useState(null);

    const [mostrarOrdenes, setMostrarOrdenes] =
        useState(false);

    const [busquedaOrden, setBusquedaOrden] =
        useState("");

    const [tipoComprobante, setTipoComprobante] =
        useState("Boleta");

    const [formaPago, setFormaPago] =
        useState("Contado");

    const [observaciones, setObservaciones] =
        useState("");

    const [documentos, setDocumentos] =
        useState([]);


    /* =====================================================
       FILTRAR ORDENES
    ===================================================== */

    const ordenesFiltradas = ordenes.filter(orden => {

        const texto = busquedaOrden
            .toLowerCase()
            .trim();

        if (!texto) {
            return true;
        }

        return (
            orden.codigoOrden
                .toLowerCase()
                .includes(texto) ||

            orden.codigoSolicitud
                .toLowerCase()
                .includes(texto) ||

            orden.cliente.nombre
                .toLowerCase()
                .includes(texto) ||

            orden.cliente.numeroDocumento
                .includes(texto) ||

            orden.numeroSerie
                .toLowerCase()
                .includes(texto)
        );
    });


    /* =====================================================
       CALCULOS
    ===================================================== */

    const calcularSubtotalServicio = () => {

        if (!ordenSeleccionada) {
            return 0;
        }

        return ordenSeleccionada.servicio.precio;
    };


    const calcularSubtotalRepuestos = () => {

        if (!ordenSeleccionada) {
            return 0;
        }

        return ordenSeleccionada.repuestos.reduce(
            (total, repuesto) =>
                total +
                (repuesto.cantidad * repuesto.precio),
            0
        );
    };


    const subtotal =
        calcularSubtotalServicio() +
        calcularSubtotalRepuestos();


    const igv = subtotal * 0.18;

    const total = subtotal + igv;


    /* =====================================================
       SELECCIONAR ORDEN
    ===================================================== */

    const seleccionarOrden = orden => {

        setOrdenSeleccionada(orden);

        setBusquedaOrden(
            orden.codigoOrden
        );

        setMostrarOrdenes(false);
    };


    /* =====================================================
       GENERAR COMPROBANTE
    ===================================================== */

    const generarComprobante = event => {

        event.preventDefault();

        if (!ordenSeleccionada) {

            alert(
                "Debe seleccionar una orden cerrada."
            );

            return;
        }


        const documento = {

            id: crypto.randomUUID(),

            numero:
                `${tipoComprobante === "Factura"
                    ? "F001"
                    : "B001"}-${String(
                        documentos.length + 1
                    ).padStart(6, "0")}`,

            tipo: tipoComprobante,

            orden:
                ordenSeleccionada.codigoOrden,

            cliente:
                ordenSeleccionada.cliente.nombre,

            documentoCliente:
                ordenSeleccionada.cliente.numeroDocumento,

            fecha:
                new Date()
                    .toISOString()
                    .split("T")[0],

            subtotal,

            igv,

            total,

            formaPago,

            estado: "Emitido"
        };


        setDocumentos([
            ...documentos,
            documento
        ]);


        alert(
            `${tipoComprobante} generado correctamente.`
        );
    };


    return (

        <div className="facturacion-container">

            {/* =================================================
               HEADER
            ================================================= */}

            <div className="facturacion-header">

                <div>

                    <h1>
                        Facturación
                    </h1>

                    <p>
                        Gestión de comprobantes asociados a órdenes de servicio
                    </p>

                </div>

            </div>


            {/* =================================================
               FORMULARIO
            ================================================= */}

            <form
                className="facturacion-formulario"
                onSubmit={generarComprobante}
            >

                {/* =================================================
                   ORDEN
                ================================================= */}

                <div className="facturacion-seccion">

                    <div className="facturacion-seccion-header">

                        <div>

                            <h3>
                                Seleccionar orden cerrada
                            </h3>

                            <p>
                                Seleccione una orden para cargar automáticamente sus datos.
                            </p>

                        </div>

                    </div>


                    <div className="facturacion-busqueda">

                        <input
                            type="text"
                            placeholder="Buscar por orden, cliente, RUC/DNI o serie..."
                            value={busquedaOrden}
                            onChange={e => {

                                setBusquedaOrden(
                                    e.target.value
                                );

                                setMostrarOrdenes(true);

                            }}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setMostrarOrdenes(true)
                            }
                        >
                            Buscar
                        </button>

                    </div>


                    {mostrarOrdenes && (

                        <div className="facturacion-resultados">

                            {ordenesFiltradas.length === 0 ? (

                                <div className="facturacion-sin-resultados">
                                    No se encontraron órdenes cerradas.
                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>
                                            <th>Orden</th>
                                            <th>Solicitud</th>
                                            <th>Cliente</th>
                                            <th>Equipo</th>
                                            <th>Fecha cierre</th>
                                            <th>Acción</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {ordenesFiltradas.map(
                                            orden => (

                                                <tr key={orden.id}>

                                                    <td>
                                                        <strong>
                                                            {orden.codigoOrden}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {orden.codigoSolicitud}
                                                    </td>

                                                    <td>
                                                        {orden.cliente.nombre}
                                                    </td>

                                                    <td>
                                                        {orden.equipo} -{" "}
                                                        {orden.marca}
                                                    </td>

                                                    <td>
                                                        {orden.fechaCierre}
                                                    </td>

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="btn-seleccionar-facturacion"
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


                {/* =================================================
                   DATOS CLIENTE
                ================================================= */}

                {ordenSeleccionada && (

                    <>

                        <div className="facturacion-seccion">

                            <div className="facturacion-seccion-header">

                                <h3>
                                    Datos del cliente
                                </h3>

                            </div>


                            <div className="facturacion-info-grid">

                                <div>
                                    <span>
                                        Tipo de documento
                                    </span>

                                    <strong>
                                        {
                                            ordenSeleccionada
                                                .cliente
                                                .tipoDocumento
                                        }
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Número
                                    </span>

                                    <strong>
                                        {
                                            ordenSeleccionada
                                                .cliente
                                                .numeroDocumento
                                        }
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Cliente
                                    </span>

                                    <strong>
                                        {
                                            ordenSeleccionada
                                                .cliente
                                                .nombre
                                        }
                                    </strong>
                                </div>

                            </div>

                        </div>


                        {/* =================================================
                           COMPROBANTE
                        ================================================= */}

                        <div className="facturacion-seccion">

                            <div className="facturacion-grid">

                                <div className="campo-facturacion">

                                    <label>
                                        Tipo de comprobante
                                    </label>

                                    <select
                                        value={tipoComprobante}
                                        onChange={e =>
                                            setTipoComprobante(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Boleta">
                                            Boleta
                                        </option>

                                        <option value="Factura">
                                            Factura
                                        </option>

                                    </select>

                                </div>


                                <div className="campo-facturacion">

                                    <label>
                                        Forma de pago
                                    </label>

                                    <select
                                        value={formaPago}
                                        onChange={e =>
                                            setFormaPago(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Contado">
                                            Contado
                                        </option>

                                        <option value="Tarjeta">
                                            Tarjeta
                                        </option>

                                        <option value="Transferencia">
                                            Transferencia
                                        </option>

                                        <option value="Yape / Plin">
                                            Yape / Plin
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                           DETALLE
                        ================================================= */}

                        <div className="facturacion-seccion">

                            <div className="facturacion-seccion-header">

                                <div>

                                    <h3>
                                        Detalle de facturación
                                    </h3>

                                </div>

                            </div>


                            <div className="facturacion-tabla">

                                <table>

                                    <thead>

                                        <tr>
                                            <th>Tipo</th>
                                            <th>Código</th>
                                            <th>Descripción</th>
                                            <th>Cantidad</th>
                                            <th>Precio</th>
                                            <th>Total</th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        <tr>

                                            <td>
                                                Servicio
                                            </td>

                                            <td>
                                                SERV
                                            </td>

                                            <td>
                                                {
                                                    ordenSeleccionada
                                                        .servicio
                                                        .descripcion
                                                }
                                            </td>

                                            <td>
                                                1
                                            </td>

                                            <td>
                                                S/{" "}
                                                {
                                                    ordenSeleccionada
                                                        .servicio
                                                        .precio
                                                        .toFixed(2)
                                                }
                                            </td>

                                            <td>
                                                S/{" "}
                                                {
                                                    ordenSeleccionada
                                                        .servicio
                                                        .precio
                                                        .toFixed(2)
                                                }
                                            </td>

                                        </tr>


                                        {ordenSeleccionada.repuestos.map(
                                            repuesto => (

                                                <tr key={repuesto.codigo}>

                                                    <td>
                                                        Repuesto
                                                    </td>

                                                    <td>
                                                        {
                                                            repuesto.codigo
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            repuesto.descripcion
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            repuesto.cantidad
                                                        }
                                                    </td>

                                                    <td>
                                                        S/{" "}
                                                        {
                                                            repuesto.precio
                                                                .toFixed(2)
                                                        }
                                                    </td>

                                                    <td>
                                                        S/{" "}
                                                        {
                                                            (
                                                                repuesto.cantidad *
                                                                repuesto.precio
                                                            ).toFixed(2)
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>


                            {/* =================================================
                               TOTALES
                            ================================================= */}

                            <div className="facturacion-totales">

                                <div>
                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        S/ {subtotal.toFixed(2)}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        IGV (18%)
                                    </span>

                                    <strong>
                                        S/ {igv.toFixed(2)}
                                    </strong>
                                </div>


                                <div className="facturacion-total">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        S/ {total.toFixed(2)}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                           OBSERVACIONES
                        ================================================= */}

                        <div className="facturacion-seccion">

                            <div className="campo-facturacion campo-completo">

                                <label>
                                    Observaciones
                                </label>

                                <textarea
                                    rows="3"
                                    value={observaciones}
                                    onChange={e =>
                                        setObservaciones(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Observaciones del comprobante..."
                                />

                            </div>

                        </div>


                        {/* =================================================
                           ACCIONES
                        ================================================= */}

                        <div className="facturacion-acciones">

                            <button
                                type="button"
                                className="btn-cancelar-facturacion"
                                onClick={() =>
                                    setOrdenSeleccionada(null)
                                }
                            >
                                Cancelar
                            </button>


                            <button
                                type="submit"
                                className="btn-generar-factura"
                            >
                                Generar comprobante
                            </button>

                        </div>

                    </>

                )}

            </form>


            {/* =================================================
               HISTORIAL
            ================================================= */}

            <div className="facturacion-seccion facturacion-historial">

                <div className="facturacion-seccion-header">

                    <div>

                        <h3>
                            Comprobantes emitidos
                        </h3>

                        <p>
                            Historial de comprobantes generados desde las órdenes cerradas.
                        </p>

                    </div>

                </div>


                <div className="facturacion-tabla">

                    <table>

                        <thead>

                            <tr>
                                <th>Comprobante</th>
                                <th>Tipo</th>
                                <th>Orden</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>

                        </thead>


                        <tbody>

                            {documentos.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="facturacion-tabla-vacia"
                                    >
                                        No hay comprobantes emitidos.
                                    </td>

                                </tr>

                            ) : (

                                documentos.map(
                                    documento => (

                                        <tr key={documento.id}>

                                            <td>
                                                <strong>
                                                    {
                                                        documento.numero
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    documento.tipo
                                                }
                                            </td>

                                            <td>
                                                {
                                                    documento.orden
                                                }
                                            </td>

                                            <td>
                                                {
                                                    documento.cliente
                                                }
                                            </td>

                                            <td>
                                                {
                                                    documento.fecha
                                                }
                                            </td>

                                            <td>
                                                S/{" "}
                                                {
                                                    documento.total
                                                        .toFixed(2)
                                                }
                                            </td>

                                            <td>

                                                <span className="estado-facturacion">
                                                    {
                                                        documento.estado
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}


export default Facturacion;
