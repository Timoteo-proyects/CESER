
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Login from "../pages/login/login";

import Dashboard from "../pages/Dashboard/Dashboard";
import Productos from "../pages/Productos/Productos";
import Clientes from "../pages/Clientes/Clientes";
import Proveedores from "../pages/Proveedores/Proveedores";
import Ventas from "../pages/Ventas/Ventas";
import Compras from "../pages/Compras/Compras";
import Inventario from "../pages/Inventario/Inventario";
import Servicios from "../pages/Servicios/Servicios";
import Presupuestos from "../pages/Presupuestos/Presupuestos";
import OrdenesReparacion from "../pages/ordenReparacion/ordenesReparacion";
import PedidoRepuestos from "../pages/pedidoRepuestos/pedidosRepuestos";
import CierreOrden from "../pages/cierreOrden/cierreOrden";
import Facturacion from "../pages/facturacion/facturacion";
import InventarioFisico from "../pages/inventarioFisico/inventarioFisico";
import SalidaArticulos from "../pages/salidaArticulos/salidaArticulos";
import Reportes from "../pages/Reportes/Reportes";

function AppRoutes() {
    const [autenticado, setAutenticado] = useState(
        () => sessionStorage.getItem("ceser_demo_auth") === "true"
    );

    const iniciarSesion = () => {
        sessionStorage.setItem("ceser_demo_auth", "true");
        setAutenticado(true);
    };

    const cerrarSesion = () => {
        sessionStorage.removeItem("ceser_demo_auth");
        setAutenticado(false);
    };

    return (
        <BrowserRouter>
            {!autenticado ? (
                <Login onLogin={iniciarSesion} />
            ) : (
                <Routes>
                    <Route
                        element={<MainLayout onLogout={cerrarSesion} />}
                    >
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/clientes" element={<Clientes />} />
                        <Route path="/proveedores" element={<Proveedores />} />
                        <Route path="/ventas" element={<Ventas />} />
                        <Route path="/compras" element={<Compras />} />
                        <Route path="/inventario" element={<Inventario />} />
                        <Route path="/servicios" element={<Servicios />} />

                        <Route
                            path="/servicios/presupuestos"
                            element={<Presupuestos />}
                        />
                        <Route
                            path="/servicios/ordenReparacion"
                            element={<OrdenesReparacion />}
                        />
                        <Route
                            path="/servicios/pedidoRepuestos"
                            element={<PedidoRepuestos />}
                        />
                        <Route
                            path="/servicios/cierreOrden"
                            element={<CierreOrden />}
                        />
                        <Route
                            path="/servicios/facturacion"
                            element={<Facturacion />}
                        />
                        <Route
                            path="/inventario/inventarioFisico"
                            element={<InventarioFisico />}
                        />
                        <Route
                            path="/servicios/salidaArticulos"
                            element={<SalidaArticulos />}
                        />
                        <Route path="/reportes" element={<Reportes />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            )}
        </BrowserRouter>
    );
}

export default AppRoutes;