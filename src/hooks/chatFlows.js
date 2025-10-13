// src/hooks/chatFlows.js
import { getWeather, getLocalNews } from "../services/api";

export const keywords = {
    notes: ["nota", "anotar", "apuntar", "recordar algo", "guardar nota"],
    reminders: ["recordatorio", "recordarme", "agenda", "alarmar"],
    weather: ["clima", "temperatura", "lluvia", "sol"],
    tasks: ["tarea", "pendiente", "hacer", "to-do"],
    news: ["noticia", "novedad", "información", "actualidad"],
};

export async function handleHardcodedFlow(userMsg, addMessage, setConversationStep) {
    const lowerMsg = String(userMsg).toLowerCase();

    // --- Keywords ---
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

    // --- Funcionalidades directas ---
    if (keywords.weather.some(w => lowerMsg.includes(w))) {
        try {
            const weatherReply = await getWeather();
            addMessage("milo", weatherReply, true);
        } catch {
            addMessage("milo", "No pude obtener el clima 😥");
        }
        return true;
    }

    if (keywords.news.some(w => lowerMsg.includes(w))) {
        try {
            const newsReply = await getLocalNews();
            addMessage("milo", Array.isArray(newsReply) ? newsReply.join("\n") : newsReply, true);
        } catch {
            addMessage("milo", "No pude obtener las noticias 😥");
        }
        return true;
    }

    return false; // No coincidió con ningún flujo
}
