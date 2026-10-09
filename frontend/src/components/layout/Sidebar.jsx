import { NavLink } from "react-router-dom";

function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                <h2>
                    CESER
                </h2>

                <span>
                    Sistema de Gestión
                </span>

            </div>


            <nav className="sidebar-menu">

                <NavLink to="/">
                    Dashboard
                </NavLink>


                <div className="menu-title">
                    GESTIÓN COMERCIAL
                </div>

                <NavLink to="/ventas">
                    Ventas
                </NavLink>

                <NavLink to="/compras">
                    Compras
                </NavLink>


                <div className="menu-title">
                    INVENTARIO
                </div>

                <NavLink to="/productos">
                    Productos
                </NavLink>

                <NavLink to="/inventario" end>
                    Inventario
                </NavLink>


                <div className="menu-title">
                    CLIENTES Y PROVEEDORES
                </div>

                <NavLink to="/clientes">
                    Clientes
                </NavLink>

                <NavLink to="/proveedores">
                    Proveedores
                </NavLink>


                <div className="menu-title">
                    SERVICIO TÉCNICO
                </div>

                <NavLink
                    to="/servicios"
                    end
                >
                    Servicios
                </NavLink>

                <NavLink
                    to="/servicios/presupuestos"
                    className="submenu-item"
                >
                    Presupuestos
                </NavLink>

                <NavLink
                    to="/servicios/ordenReparacion"
                    className="submenu-item"
                >
                    Órdenes de reparación
                </NavLink>

                <NavLink
                    to="/servicios/pedidoRepuestos"
                    className="submenu-item"
                >
                    Pedidos de repuestos
                </NavLink>
                <NavLink
                    to="/servicios/cierreOrden"
                    className="submenu-item"
                >
                    Cierre de órdenes
                </NavLink>

                <NavLink
                    to="/servicios/facturacion"
                    className="submenu-item"
                >
                    Facturación
                </NavLink>

                <NavLink
                    to="/inventario/inventarioFisico"
                    className="submenu-item"
                >
                    Inventario físico
                </NavLink>

                <NavLink
                    to="/servicios/salidaArticulos"
                    className="submenu-item"
                >
                    Salida de artículos
                </NavLink>

                <div className="menu-title">
                    REPORTES
                </div>

                <NavLink to="/reportes">
                    Reportes
                </NavLink>

            </nav>

        </aside>
    );
}


export default Sidebar;