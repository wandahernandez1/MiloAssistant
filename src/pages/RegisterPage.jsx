import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/login.css";
import miloAvatar from "../assets/milo-avatar.png";

import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessage";
import Message from "../components/Message";
import { Link } from "react-router-dom";


export default function Register() {
    const { register } = useAuth();
    const { message, type, showMessage } = useMessages();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showMessage("Las contraseñas no coinciden", "error");
            return;
        }

        const result = await register(username, email, password);
        if (result.success) {
            showMessage("Registro exitoso. Ya puedes iniciar sesión.", "success");
            setTimeout(() => (window.location.href = "/login"), 1000);
        } else {
            showMessage(result.message || "Error en el registro", "error");
        }
    };

    return (
        <div>
            <Navbar />

            <main className="login-container">
                <div className="register-card">
                    {/* Panel izquierdo */}
                    <div className="left-panel">
                        <h2 className="panel-title">¡Únete a MiloAssistant!</h2>
                        <img
                            src={miloAvatar}
                            alt="Avatar"
                            className="panel-avatar"
                        />
                        <p className="panel-tagline">
                            Crea tu cuenta
                        </p>
                    </div>

                    {/* Panel derecho */}
                    <div className="right-panel">
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="username">Nombre de usuario</label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Tu nombre de usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="email">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Tu correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Repite tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="login-button">
                                Registrarse
                            </button>
                        </form>

                        <p>
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                        </p>
                    </div>
                </div>

                {/* Toast de mensajes */}
                <Message message={message} type={type} onClose={() => { }} />
            </main>
        </div>
    );
}
