import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import miloAvatar from "../assets/milo2.jpg";
import Navbar from "../components/Navbar";

import { getWeather, getLocalNews } from "../services/api.js";
import { useNotes } from "../hooks/useNotes";

export default function Dashboard() {
    const [chatActive, setChatActive] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingNote, setIsCreatingNote] = useState(false); // Nuevo estado

    const { createNote } = useNotes(); // Hook de notas
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [navigate]);

    const addMessage = (sender, text, isHtml = false, hasButton = false) => {
        setMessages((prev) => [...prev, { sender, text, isHtml, hasButton }]);
    };

    const keywords = {
        notes: ["nota", "anotar", "apuntar", "recordar algo", "guardar nota"],
        reminders: ["recordatorio", "recordarme", "agenda", "alarmar"],
        weather: ["clima", "temperatura", "lluvia", "sol"],
        tasks: ["tarea", "pendiente", "hacer", "to-do"],
        news: ["noticia", "novedad", "información", "actualidad"]
    };

    const handleSend = async (userMsgFromCard = "") => {
        const userMsg = userMsgFromCard || inputValue.trim();
        if (!userMsg) return;

        setInputValue("");
        setChatActive(true);
        setIsLoading(true);

        // 1️⃣ Agregamos el mensaje del usuario al chat inmediatamente
        addMessage("user", userMsg);

        try {
            const lowerMsg = userMsg.toLowerCase();
            let handled = false;

            // Manejo del saludo inicial (no cambia)
            const greetings = ["hola", "hola milo"];
            const isGreeting = greetings.includes(lowerMsg);
            if (isGreeting && !messages.some(msg => msg.sender === "milo")) {
                const introMessage = "Hola, soy Milo, tu asistente personal. ¿En qué puedo ayudarte hoy?";
                addMessage("milo", introMessage);
                setIsLoading(false);
                return;
            }

            if (isCreatingNote) {
                const content = userMsg;

                // 2✅ Separar título y contenido si el usuario usa "Título: contenido"
                let title = "Nueva Nota";
                let noteContent = content;

                const splitIndex = content.indexOf(":");
                if (splitIndex > -1) {
                    title = content.slice(0, splitIndex).trim(); // antes de los dos puntos
                    noteContent = content.slice(splitIndex + 1).trim(); // después de los dos puntos
                } else {
                    // Si no hay ":", tomar la primera línea como título
                    title = content.split("\n")[0].trim();
                    noteContent = content;
                }

                if (title.length > 30) title = title.slice(0, 30) + "...";

                try {
                    const newNote = await createNote({ title, content: noteContent });
                    if (newNote) {
                        addMessage("milo", `¡Nota "${title}" creada exitosamente! 📝`, false, true);
                    } else {
                        addMessage("milo", "No se pudo guardar la nota.");
                    }
                } catch (err) {
                    console.error("Error al crear nota:", err);
                    addMessage("milo", "Ocurrió un error al guardar la nota 😥");
                } finally {
                    setIsCreatingNote(false);
                    setIsLoading(false);
                }

                return;
            }

            // 3️⃣ Respuestas hardcodeadas por palabras clave
            if (keywords.notes.some(word => lowerMsg.includes(word))) {
                const noteReply = "📝 Claro, puedo ayudarte a crear una nota. ¿Qué te gustaría guardar?";
                addMessage("milo", noteReply);
                setIsCreatingNote(true); // Activa el modo de creación
                handled = true;
            } else if (keywords.weather.some(word => lowerMsg.includes(word))) {
                const weatherReply = await getWeather();
                addMessage("milo", weatherReply);
                handled = true;
            } else if (keywords.news.some(word => lowerMsg.includes(word))) {
                const newsReply = await getLocalNews();
                addMessage("milo", newsReply, true);
                handled = true;
            } else if (keywords.reminders.some(word => lowerMsg.includes(word))) {
                const reminderReply = "📅 Perfecto, pronto podrás ver tus recordatorios aquí.";
                addMessage("milo", reminderReply);
                handled = true;
            } else if (keywords.tasks.some(word => lowerMsg.includes(word))) {
                const tasksReply = "📝 Tus tareas estarán disponibles pronto, ¡no te preocupes!";
                addMessage("milo", tasksReply, false, true);
                handled = true;
            }

            if (handled) {
                setIsLoading(false);
                return; // No llamar a la IA si ya se respondió
            }

            // 4️⃣ Si no coincide, usamos la IA para respuesta general
            const historyToSend = messages.slice(-10);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);

            const res = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history: historyToSend }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const response = await res.json();
            const reply = response.reply || "No se pudo obtener una respuesta válida 😅";
            addMessage("milo", reply);

        } catch (error) {
            console.error("Error enviando mensaje:", error);
            addMessage("milo", "Lo siento, hubo un problema. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Manejo de tarjetas centralizado ---
    const handleCardClick = async (card) => {
        setChatActive(true);

        if (card === "clima") await handleSend("¿Qué clima hace hoy?");
        else if (card === "noticias") await handleSend("Dime las noticias de hoy");
        else if (card === "recordatorio") await handleSend("Quiero crear un recordatorio");
        else if (card === "tareas") await handleSend("Necesito organizar mis tareas");
        else if (card === "nota") {
            handleSend("Quiero crear una nota");
        }
    };

    const handleMinimize = () => {
        setChatActive(false);
        setMessages([]);
    };

    return (<>
        <Navbar showProfile={true} />

        <div className={`dashboard-main-container ${chatActive ? "chat-active" : ""}`}>

            <section className="chat-section">
                {!chatActive && (
                    <div className="chat-initial-content">
                        <div className="intro-section-wrapper">
                            <section className="intro-section">
                                <img src={miloAvatar} alt="Milo Avatar" className="milo-avatar" />
                                <h1>
                                    Hola, soy <span className="highlight">Milo,</span>
                                    <br />
                                    tu asistente personal.
                                </h1>
                                <p className="question">¿Qué te gustaría hacer hoy?</p>
                            </section>
                        </div>

                        <section className="action-cards-section">
                            <div className="card" onClick={() => handleCardClick("clima")}>
                                <i className="fas fa-cloud icon"></i>
                                <p className="card-title">Clima</p>
                                <p className="card-description">Consulta el clima actual</p>
                            </div>
                            <div className="card" onClick={() => handleCardClick("recordatorio")}>
                                <i className="fas fa-bell icon"></i>
                                <p className="card-title">Recordatorio</p>
                                <p className="card-description">Crea un recordatorio</p>
                            </div>
                            <div className="card" onClick={() => handleCardClick("tareas")}>
                                <i className="fas fa-tasks icon"></i>
                                <p className="card-title">Tareas</p>
                                <p className="card-description">Organiza tus pendientes</p>
                            </div>
                            <div className="card" onClick={() => handleCardClick("noticias")}>
                                <i className="fas fa-list-ul icon"></i>
                                <p className="card-title">Novedades Locales</p>
                                <p className="card-description">Ve noticias de hoy</p>
                            </div>
                            {/* Nueva tarjeta para crear notas */}
                            <div className="card" onClick={() => handleCardClick("nota")}>
                                <i className="fas fa-sticky-note icon"></i>
                                <p className="card-title">Notas</p>
                                <p className="card-description">Guarda un recordatorio</p>
                            </div>
                        </section>
                    </div>
                )}

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.sender}`}>
                            {msg.isHtml ? (
                                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                            ) : (
                                <div>{msg.text}</div>
                            )}
                            {msg.hasButton && (
                                <button className="go-to-notes-button" onClick={() => navigate("/notes")}>
                                    Ir a mis notas
                                </button>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message milo thinking-message">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <p>Milo está escribiendo...</p>
                        </div>
                    )}
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
    </>
    );
}