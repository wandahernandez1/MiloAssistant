import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/login.css";
import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessage";
import Message from "../components/Message";
import miloAvatar from "../assets/milo-avatar.png";

import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const { message, type, showMessage } = useMessages();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      showMessage("¡Inicio de sesión exitoso!", "success");
      setTimeout(() => {
        window.location.href = "/dashboard"; // o usar react-router
      }, 1000);
    } else {
      showMessage(result.message || "Credenciales incorrectas", "error");
    }
  };

  return (
    <div>


      <Navbar />
      <main className="login-container">
        <div className="login-card">
          {/* Panel izquierdo */}
          <div className="left-panel">
            <h2 className="panel-title">MiloAssistant

            </h2>
            <img
              src={miloAvatar}
              alt="Avatar"
              className="panel-avatar"
            />
            <p className="panel-tagline">
              Tu asistente personal
            </p>
          </div>

          {/* Panel derecho */}
          <div className="right-panel">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
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

              <button type="submit" className="login-button">
                Ingresar
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

        {/* Toast de mensajes */}
        <Message message={message} type={type} onClose={() => { }} />
      </main>
    </div>
  );
}
