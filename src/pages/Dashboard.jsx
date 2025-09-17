// src/pages/Dashboard.jsx
import { useState } from "react";
import "../styles/dashboard.css"; // tu CSS que pasaste arriba
import miloAvatar from "../assets/milo2.jpg";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    const [chatActive, setChatActive] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { text: inputValue, sender: "user" }]);
        setInputValue("");

        // Simulación de respuesta de Milo
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { text: "Hola, soy Milo. ¿En qué puedo ayudarte?", sender: "milo" },
            ]);
        }, 500);
        setChatActive(true);
    };

    const handleMinimize = () => {
        setChatActive(false);
    };

    return (
        <div className={`dashboard-main-container ${chatActive ? "chat-active" : ""}`}>
            <Navbar />

            <section className="chat-section">
                {/* Contenido inicial */}
                {!chatActive && (
                    <div className="chat-initial-content">
                        <div className="intro-section-wrapper">
                            <section className="intro-section">
                                <img src={miloAvatar} alt="Milo Avatar" className="milo-avatar" />
                                <h1>
                                    Hola, soy <span className="highlight">Milo,</span>
                                    <br />tu asistente personal.
                                </h1>
                                <p className="question">¿Qué te gustaría hacer hoy?</p>
                            </section>
                        </div>

                        <section className="action-cards-section">
                            <div className="card" onClick={() => setChatActive(true)}>
                                <i className="fas fa-cloud icon"></i>
                                <p className="card-title">Clima</p>
                                <p className="card-description">Consulta el clima actual</p>
                            </div>
                            <div className="card" onClick={() => setChatActive(true)}>
                                <i className="fas fa-bell icon"></i>
                                <p className="card-title">Recordatorio</p>
                                <p className="card-description">Crea un recordatorio</p>
                            </div>
                            <div className="card" onClick={() => setChatActive(true)}>
                                <i className="fas fa-tasks icon"></i>
                                <p className="card-title">Tareas</p>
                                <p className="card-description">Organiza tus pendientes</p>
                            </div>
                            <div className="card" onClick={() => setChatActive(true)}>
                                <i className="fas fa-list-ul icon"></i>
                                <p className="card-title">Novedades Locales</p>
                                <p className="card-description">Ve noticias de hoy</p>
                            </div>
                        </section>
                    </div>
                )}

                {/* Chat */}
                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="chat-input-container">
                    <input
                        type="text"
                        placeholder="Escribe un mensaje a Milo..."
                        className="chat-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button className="send-button" onClick={handleSend}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                    <button className="minimize-chat-button" onClick={handleMinimize}>
                        <i className="fas fa-arrow-up"></i>
                        <span>Volver al Inicio</span>
                    </button>
                </div>
            </section>
        </div>
    );
}
