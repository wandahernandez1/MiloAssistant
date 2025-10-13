import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import miloAvatar from "../assets/milo-avatar.png";
import "../styles/login.css";

import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessage";
import Message from "../components/Message";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser, loading, login } = useAuth();
  const { message, type, showMessage } = useMessages();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      // Redirigir solo si la carga ha terminado y hay un usuario
      navigate("/dashboard", { replace: true });
    }
  }, [loading, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result && result.success) {
      showMessage("¡Inicio de sesión exitoso!", "success");
      // La redirección ahora se maneja en el useEffect de arriba
    } else {
      showMessage(result?.message || "Credenciales incorrectas", "error");
    }
  };
  return (
    <div>
      <Navbar />
      <main className="login-container">

        {loading ? (
          <div>Cargando...</div>
        ) : (
          <div className="login-card">
            {/* Panel izquierdo */}
            <div className="left-panel">
              <h2 className="panel-title">MiloAssistant</h2>
              <img src={miloAvatar} alt="Avatar" className="panel-avatar" />
              <p className="panel-tagline">Tu asistente personal</p>
            </div>

            {/* Panel derecho */}
            <div className="right-panel">
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email">Correo electrónico</label>
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    id="password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="password">Contraseña</label>
                </div>

                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>

              <a href="/forgot-password" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
              <p>
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
              </p>
            </div>
          </div>
        )}

        {/* Toast de mensajes */}
        <Message message={message} type={type} onClose={() => { }} />
      </main>
    </div>
  );
}