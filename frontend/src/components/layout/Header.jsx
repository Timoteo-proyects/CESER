
import { useState } from "react";

function Header({ onLogout }) {
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <header className="header">
            <div>
                <h1>CESER servicio técnico</h1>
            </div>

            <div className="header-user">
                <span>Administrador</span>

                <button
                    type="button"
                    aria-label="Abrir menú de usuario"
                    aria-expanded={menuAbierto}
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    ▼
                </button>

                {menuAbierto && (
                    <div className="header-user-menu">
                        <button
                            type="button"
                            onClick={() => {
                                setMenuAbierto(false);
                                onLogout();
                            }}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;