import { askGemini, getWeather, getLocalNews, saveNoteFromChat } from "../services/api";

export async function handleGemini(userMsg, messages, addMessage) {
    try {
        const historyToSend = messages.map(m => ({ sender: m.sender, text: m.text }));
        const { reply, action, title, content } = await askGemini(userMsg, historyToSend);

        if (reply) addMessage("milo", reply);
        else if (action) {
            switch (action) {
                case "get_weather":
                    addMessage("milo", await getWeather());
                    break;
                case "get_news":
                    addMessage("milo", await getLocalNews());
                    break;
                case "create_note":
                    addMessage("milo", (await saveNoteFromChat(content || userMsg)).message);
                    break;
                default:
                    addMessage("milo", `🔧 Acción detectada: ${action}`);
            }
        } else {
            addMessage("milo", "No se pudo obtener una respuesta válida 😅");
        }
    } catch (err) {
        console.error("Error Gemini:", err);
        addMessage("milo", "Lo siento, Milo no pudo responder ahora 😥");
    }
}
