import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import miloAvatar from "../assets/milo-avatar.png";
import "../styles/login.css";

import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessage";
import Message from "../components/Message";

export default function Register() {
    const { register } = useAuth();
    const { message, type, showMessage } = useMessages();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showMessage("Las contraseñas no coinciden", "error");
            return;
        }

        setIsLoading(true);
        const result = await register(name, email, password);
        setIsLoading(false);

        if (result.success) {
            showMessage("Registro exitoso. ¡Bienvenido!", "success");
            setTimeout(() => navigate("/dashboard"), 1000); // Redirige al dashboard
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
                        <img src={miloAvatar} alt="Avatar" className="panel-avatar" />
                        <p className="panel-tagline">Crea tu cuenta</p>
                    </div>

                    {/* Panel derecho */}
                    <div className="right-panel">
                        <h2>Registro</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="name">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Tu nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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

                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? "Registrando..." : "Registrarse"}
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
