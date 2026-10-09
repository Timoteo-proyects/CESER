
import { useState } from "react";
import "./login.css";

function Login({ onLogin }) {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [error, setError] = useState("");

    const iniciarSesion = (e) => {
        e.preventDefault();
        setError("");

        // Credenciales provisionales para la demo.
        const usuarioDemo = "admin";
        const contrasenaDemo = "CESER-demo-2026";

        if (
            usuario.trim() === usuarioDemo &&
            contrasena === contrasenaDemo
        ) {
            onLogin();
        } else {
            setError("Usuario o contraseña incorrectos.");
        }
    };

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-logo">C</div>

                <h1>CESER</h1>
                <p className="login-subtitle">
                    Sistema de Gestión Empresarial
                </p>

                <form onSubmit={iniciarSesion}>
                    <div className="login-field">
                        <label htmlFor="usuario">Usuario</label>
                        <input
                            id="usuario"
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            placeholder="Ingresa tu usuario"
                            autoComplete="username"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="contrasena">Contraseña</label>

                        <div className="login-password-wrapper">
                            <input
                                id="contrasena"
                                type={mostrarContrasena ? "text" : "password"}
                                value={contrasena}
                                onChange={(e) =>
                                    setContrasena(e.target.value)
                                }
                                placeholder="Ingresa tu contraseña"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="login-toggle-password"
                                onClick={() =>
                                    setMostrarContrasena(!mostrarContrasena)
                                }
                                aria-label={
                                    mostrarContrasena
                                        ? "Ocultar contraseña"
                                        : "Mostrar contraseña"
                                }
                            >
                                {mostrarContrasena ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="login-submit">
                        Iniciar sesión
                    </button>
                </form>

                <p className="login-footer">
                    CESER · Sistema interno de gestión
                </p>
            </section>
        </main>
    );
}

export default Login;