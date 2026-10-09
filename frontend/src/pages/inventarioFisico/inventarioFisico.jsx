import { useState } from "react";
import "./inventarioFisico.css";

const INVENTARIOS_INICIALES = [
    {
        id: 1,
        codigo: "INVF-000001",
        fecha: "26/09/2026",
        almacen: "Almacén Principal",
        tipo: "General",
        productos: 120,
        responsable: "Carlos Mendoza",
        estado: "CON DIFERENCIAS"
    },
    {
        id: 2,
        codigo: "INVF-000002",
        fecha: "20/09/2026",
        almacen: "Almacén de Repuestos",
        tipo: "Parcial",
        productos: 48,
        responsable: "Luis Ramírez",
        estado: "CONCILIADO"
    },
    {
        id: 3,
        codigo: "INVF-000003",
        fecha: "15/09/2026",
        almacen: "Almacén Principal",
        tipo: "General",
        productos: 135,
        responsable: "Miguel Torres",
        estado: "BORRADOR"
    }
];

function InventarioFisico() {
    const [inventarios, setInventarios] = useState(INVENTARIOS_INICIALES);

    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroAlmacen, setFiltroAlmacen] = useState("Todos");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [nuevoInventario, setNuevoInventario] = useState({
        almacen: "",
        tipo: "General",
        categoria: "Todas",
        incluirStockCero: false,
        responsable: "",
        observaciones: ""
    });

    const inventariosFiltrados = inventarios.filter((inventario) => {
        const coincideBusqueda =
            inventario.codigo
                .toLowerCase()
                .includes(busqueda.toLowerCase()) ||
            inventario.almacen
                .toLowerCase()
                .includes(busqueda.toLowerCase()) ||
            inventario.responsable
                .toLowerCase()
                .includes(busqueda.toLowerCase());

        const coincideEstado =
            filtroEstado === "Todos" ||
            inventario.estado === filtroEstado;

        const coincideAlmacen =
            filtroAlmacen === "Todos" ||
            inventario.almacen === filtroAlmacen;

        return coincideBusqueda && coincideEstado && coincideAlmacen;
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setNuevoInventario({
            ...nuevoInventario,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const crearInventario = (e) => {
        e.preventDefault();

        if (!nuevoInventario.almacen || !nuevoInventario.responsable) {
            alert("Completa los campos obligatorios.");
            return;
        }

        const siguienteNumero = inventarios.length + 1;

        const nuevo = {
            id: Date.now(),
            codigo: `INVF-${String(siguienteNumero).padStart(6, "0")}`,
            fecha: new Date().toLocaleDateString("es-PE"),
            almacen: nuevoInventario.almacen,
            tipo: nuevoInventario.tipo,
            productos: 0,
            responsable: nuevoInventario.responsable,
            estado: "BORRADOR"
        };

        setInventarios([...inventarios, nuevo]);

        setNuevoInventario({
            almacen: "",
            tipo: "General",
            categoria: "Todas",
            incluirStockCero: false,
            responsable: "",
            observaciones: ""
        });

        setMostrarFormulario(false);

        alert(`Archivo ${nuevo.codigo} creado correctamente.`);
    };

    const eliminarInventario = (id) => {
        const inventario = inventarios.find((item) => item.id === id);

        if (!inventario) return;

        if (inventario.estado !== "BORRADOR") {
            alert(
                "Solo se pueden eliminar archivos que estén en estado BORRADOR."
            );
            return;
        }

        const confirmar = window.confirm(
            `¿Deseas eliminar el archivo ${inventario.codigo}?`
        );

        if (!confirmar) return;

        setInventarios(
            inventarios.filter((item) => item.id !== id)
        );
    };

    const verReporte = (inventario) => {
        alert(`Generando reporte de conteo para ${inventario.codigo}`);
    };

    const registrarResultados = (inventario) => {
        alert(`Abriendo registro de resultados para ${inventario.codigo}`);
    };

    const verDiferencias = (inventario) => {
        alert(`Abriendo diferencias de ${inventario.codigo}`);
    };

    return (
        <div className="inventario-fisico-container">

            <div className="inventario-fisico-header">
                <div>
                    <h1>Inventario físico</h1>
                    <p>
                        Control y conciliación del inventario mediante conteo físico.
                    </p>
                </div>

                <button
                    className="btn-nuevo-inventario"
                    onClick={() => setMostrarFormulario(true)}
                >
                    + Nuevo archivo
                </button>
            </div>

            <div className="inventario-fisico-filtros">

                <select
                    value={filtroAlmacen}
                    onChange={(e) => setFiltroAlmacen(e.target.value)}
                >
                    <option value="Todos">Todos los almacenes</option>
                    <option value="Almacén Principal">
                        Almacén Principal
                    </option>
                    <option value="Almacén de Repuestos">
                        Almacén de Repuestos
                    </option>
                </select>

                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="Todos">Todos los estados</option>
                    <option value="BORRADOR">Borrador</option>
                    <option value="CON DIFERENCIAS">
                        Con diferencias
                    </option>
                    <option value="CONCILIADO">Conciliado</option>
                </select>

                <input
                    type="text"
                    placeholder="Buscar por código, almacén o responsable..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

            </div>

            <div className="inventario-fisico-lista">

                {inventariosFiltrados.length === 0 ? (

                    <div className="inventario-vacio">
                        No se encontraron archivos de inventario.
                    </div>

                ) : (

                    inventariosFiltrados.map((inventario) => (

                        <div
                            className="inventario-fisico-card"
                            key={inventario.id}
                        >

                            <div className="inventario-card-header">

                                <div>
                                    <span className="inventario-codigo">
                                        {inventario.codigo}
                                    </span>

                                    <span
                                        className={`inventario-estado estado-${inventario.estado
                                            .toLowerCase()
                                            .replaceAll(" ", "-")}`}
                                    >
                                        {inventario.estado}
                                    </span>
                                </div>

                                <span className="inventario-fecha">
                                    {inventario.fecha}
                                </span>

                            </div>

                            <div className="inventario-card-info">

                                <div>
                                    <span>Almacén</span>
                                    <strong>{inventario.almacen}</strong>
                                </div>

                                <div>
                                    <span>Tipo</span>
                                    <strong>{inventario.tipo}</strong>
                                </div>

                                <div>
                                    <span>Productos</span>
                                    <strong>{inventario.productos}</strong>
                                </div>

                                <div>
                                    <span>Responsable</span>
                                    <strong>{inventario.responsable}</strong>
                                </div>

                            </div>

                            <div className="inventario-card-acciones">

                                <button
                                    className="btn-accion btn-reporte"
                                    onClick={() => verReporte(inventario)}
                                >
                                    Reporte
                                </button>

                                <button
                                    className="btn-accion btn-resultados"
                                    onClick={() =>
                                        registrarResultados(inventario)
                                    }
                                >
                                    Resultados
                                </button>

                                <button
                                    className="btn-accion btn-diferencias"
                                    onClick={() =>
                                        verDiferencias(inventario)
                                    }
                                >
                                    Diferencias
                                </button>

                                {inventario.estado === "BORRADOR" && (
                                    <button
                                        className="btn-accion btn-eliminar"
                                        onClick={() =>
                                            eliminarInventario(inventario.id)
                                        }
                                    >
                                        Eliminar
                                    </button>
                                )}

                            </div>

                        </div>

                    ))

                )}

            </div>

            {mostrarFormulario && (

                <div className="modal-inventario">

                    <div className="modal-inventario-contenido">

                        <div className="modal-inventario-header">

                            <div>
                                <h2>Nuevo inventario físico</h2>
                                <p>
                                    Configura el archivo que se utilizará
                                    para realizar el conteo.
                                </p>
                            </div>

                            <button
                                className="btn-cerrar-modal"
                                onClick={() =>
                                    setMostrarFormulario(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form onSubmit={crearInventario}>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Almacén *</label>

                                    <select
                                        name="almacen"
                                        value={nuevoInventario.almacen}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Seleccionar almacén
                                        </option>

                                        <option value="Almacén Principal">
                                            Almacén Principal
                                        </option>

                                        <option value="Almacén de Repuestos">
                                            Almacén de Repuestos
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Tipo de inventario *</label>

                                    <select
                                        name="tipo"
                                        value={nuevoInventario.tipo}
                                        onChange={handleChange}
                                    >
                                        <option value="General">
                                            General
                                        </option>

                                        <option value="Parcial">
                                            Parcial
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Categoría</label>

                                    <select
                                        name="categoria"
                                        value={nuevoInventario.categoria}
                                        onChange={handleChange}
                                    >
                                        <option value="Todas">
                                            Todas las categorías
                                        </option>

                                        <option value="Repuestos">
                                            Repuestos
                                        </option>

                                        <option value="Equipos">
                                            Equipos
                                        </option>

                                        <option value="Accesorios">
                                            Accesorios
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Responsable *</label>

                                    <input
                                        type="text"
                                        name="responsable"
                                        placeholder="Nombre del responsable"
                                        value={nuevoInventario.responsable}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                            <div className="form-checkbox">

                                <input
                                    type="checkbox"
                                    name="incluirStockCero"
                                    checked={
                                        nuevoInventario.incluirStockCero
                                    }
                                    onChange={handleChange}
                                />

                                <div>
                                    <strong>
                                        Incluir productos con stock 0
                                    </strong>

                                    <p>
                                        También aparecerán productos que
                                        actualmente no tengan existencias.
                                    </p>
                                </div>

                            </div>

                            <div className="form-group">

                                <label>Observaciones</label>

                                <textarea
                                    name="observaciones"
                                    rows="3"
                                    placeholder="Observaciones del inventario..."
                                    value={nuevoInventario.observaciones}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="modal-acciones">

                                <button
                                    type="button"
                                    className="btn-cancelar-inventario"
                                    onClick={() =>
                                        setMostrarFormulario(false)
                                    }
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn-crear-inventario"
                                >
                                    Crear archivo
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default InventarioFisico;