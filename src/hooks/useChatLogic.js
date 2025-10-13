import { useState } from "react";
import { getWeather, getLocalNews, askGemini } from "../services/api";
import { useNotes } from "./useNotes";

export function useChatLogic(setChatActive) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationStep, setConversationStep] = useState(null);
    const [tempData, setTempData] = useState({});
    const { createNote } = useNotes();

    const addMessage = (sender, text, isHtml = false, buttons = null) => {
        let safeText = "";

        if (typeof text === "string") {
            safeText = text;
        } else if (Array.isArray(text)) {
            // Convierte arrays en líneas separadas
            safeText = text.map(item => {
                if (typeof item === "string") return item;
                // Si el item es un objeto, convierte a JSON bonito
                return JSON.stringify(item, null, 2);
            }).join("\n");
        } else if (typeof text === "object" && text !== null) {
            // Objeto normal -> JSON bonito
            safeText = JSON.stringify(text, null, 2);
        } else {
            // Otros tipos (números, booleanos, null)
            safeText = String(text);
        }

        setMessages(prev => [
            ...prev,
            { sender, text: safeText, isHtml, buttons, time: Date.now() }
        ]);
    };

    const resetFlow = () => {
        setConversationStep(null);
        setTempData({});
    };

    const handleDirectActions = async (userMsg) => {
        const lowerMsg = userMsg.toLowerCase();

        const keywords = {
            weather: ["clima", "temperatura", "lluvia", "sol", "qué tiempo hace"],
            news: ["noticia", "novedad", "información", "actualidad", "noticias de hoy"],
            notes: ["nota", "anotar", "apuntar", "guardar nota"],
            reminders: ["recordatorio", "recordarme", "agenda", "alarmar"],
            tasks: ["tarea", "pendiente", "hacer", "to-do"],
        };

        if (keywords.notes.some(w => lowerMsg.includes(w))) {
            addMessage("milo", "📝 Claro, ¿cómo se va a llamar la nota?");
            setConversationStep("nota_titulo");
            return true;
        }
        if (keywords.reminders.some(w => lowerMsg.includes(w))) {
            addMessage("milo", "📅 Perfecto, ¿cómo se va a llamar el recordatorio?");
            setConversationStep("recordatorio_titulo");
            return true;
        }
        if (keywords.tasks.some(w => lowerMsg.includes(w))) {
            addMessage("milo", "📝 ¡Perfecto! Comencemos. ¿Cuál es el título de tu tarea?");
            setConversationStep("tarea_titulo");
            return true;
        }
        if (keywords.weather.some(w => lowerMsg.includes(w))) {
            const weatherReply = await getWeather();
            addMessage("milo", weatherReply, true);
            return true;
        }
        if (keywords.news.some(w => lowerMsg.includes(w))) {
            const newsReply = await getLocalNews();
            addMessage("milo", newsReply, true);
            return true;
        }

        return false;
    };

    const handleSend = async (userMsgFromCard = "") => {
        let userMsg = (userMsgFromCard || inputValue?.trim() || "").toString();
        if (!userMsg) return;

        setInputValue("");
        if (setChatActive) setChatActive(true);
        setIsLoading(true);

        addMessage("user", userMsg);

        try {
            if (conversationStep) {
                switch (conversationStep) {
                    case "nota_titulo":
                        setTempData({ title: userMsg });
                        addMessage("milo", "Perfecto. ¿Qué contenido querés guardar en la nota?");
                        setConversationStep("nota_contenido");
                        break;
                    case "nota_contenido":
                        const { title } = tempData;
                        const newNote = await createNote({ title, content: userMsg });
                        addMessage(
                            "milo",
                            newNote ? `¡Nota "${title}" creada exitosamente! 📝` : "No se pudo guardar la nota.",
                            false,
                            newNote ? { label: "Ir a mis notas", route: "/notes" } : null
                        );
                        resetFlow();
                        break;

                    case "recordatorio_titulo":
                        setTempData({ title: userMsg });
                        addMessage("milo", "Genial. ¿Cuándo querés que te lo recuerde? (ej: mañana a las 10)");
                        setConversationStep("recordatorio_fecha");
                        break;
                    case "recordatorio_fecha":
                        const { title: rTitle } = tempData;
                        const dateText = userMsg;
                        const storedReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
                        localStorage.setItem("reminders", JSON.stringify([...storedReminders, { title: rTitle, dateText }]));
                        if ("Notification" in window) {
                            Notification.requestPermission().then((permission) => {
                                if (permission === "granted") {
                                    new Notification(`Recordatorio: ${rTitle}`, { body: `Para: ${dateText}` });
                                }
                            });
                        }
                        addMessage(
                            "milo",
                            `⏰ Recordatorio "${rTitle}" programado para ${dateText}.`,
                            false,
                            { label: "Ir a mi calendario", route: "/calendar" }
                        );
                        resetFlow();
                        break;

                    case "tarea_titulo":
                        setTempData({ title: userMsg });
                        addMessage("milo", "¿Quieres agregar una descripción?");
                        setConversationStep("tarea_descripcion");
                        break;
                    case "tarea_descripcion":
                        setTempData((prev) => ({ ...prev, description: userMsg }));
                        addMessage("milo", "¿Tiene fecha límite? (ej: 30/09/2025) o escribí 'no'");
                        setConversationStep("tarea_fecha");
                        break;
                    case "tarea_fecha":
                        const dueDate = userMsg.toLowerCase() === "no" ? null : userMsg;
                        setTempData((prev) => ({ ...prev, dueDate }));
                        addMessage("milo", "¿Prioridad alta, media o baja?");
                        setConversationStep("tarea_prioridad");
                        break;
                    case "tarea_prioridad":
                        const priority = ["alta", "media", "baja"].includes(userMsg.toLowerCase()) ? userMsg.toLowerCase() : "media";
                        const { title: tTitle, description, dueDate: tDueDate } = tempData;
                        const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
                        localStorage.setItem("tasks", JSON.stringify([...storedTasks, { title: tTitle, description, dueDate: tDueDate, priority }]));
                        addMessage(
                            "milo",
                            `✅ Tarea "${tTitle}" creada${tDueDate ? ` para ${tDueDate}` : ""} con prioridad ${priority}.`,
                            false,
                            { label: "Ir a mis tareas", route: "/tasks" }
                        );
                        resetFlow();
                        break;
                }
                setIsLoading(false);
                return;
            }

            const handledByKeywords = await handleDirectActions(userMsg);
            if (handledByKeywords) {
                setIsLoading(false);
                return;
            }

            const historyToSend = [...messages, { sender: "user", text: userMsg }].slice(-10);
            const response = await askGemini(userMsg, historyToSend);

            if (response.reply) {
                addMessage("milo", response.reply);
            } else {
                addMessage("milo", "Lo siento, no pude obtener una respuesta válida.");
            }

        } catch (err) {
            console.error("Error en handleSend:", err);
            addMessage("milo", "Lo siento, hubo un problema. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = async (card) => {
        if (setChatActive) setChatActive(true);
        resetFlow();

        const cardMap = {
            clima: "¿Qué clima hace hoy?",
            noticias: "Dime las noticias de hoy",
            recordatorio: "Quiero crear un recordatorio",
            tareas: "Necesito organizar mis tareas",
            nota: "Quiero crear una nota",
        };

        await handleSend(cardMap[card]);
    };

    const handleMinimize = () => {
        if (setChatActive) setChatActive(false);
        setMessages([]);
        resetFlow();
    };

    return { messages, inputValue, setInputValue, isLoading, handleSend, handleCardClick, handleMinimize };
}
