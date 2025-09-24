
export async function askGemini(message, chatHistory = []) {
    try {
        const res = await fetch('http://localhost:3000/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token") || ""}`
            },
            body: JSON.stringify({ message, history: chatHistory }),
        });
        const data = await res.json();
        return {
            reply: data?.reply || "",
            action: data?.action || null,
            title: data?.title || "",
            content: data?.content || "",
        };
    } catch (err) {
        console.error(err);
        return {
            reply: 'No se pudo obtener una respuesta válida 😅',
            action: null,
            title: "",
            content: "",
        };
    }
}

export async function getWeather() {
    const API_KEY = "361221015a8e10e6cd9a6d4725732fe4";
    try {
        const pos = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const { latitude: lat, longitude: lon } = pos.coords;

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return `🌤️ En ${data.name}: ${data.main.temp.toFixed(0)}°C, ${data.weather[0].description}`;
    } catch (err) {
        return `No pude obtener el clima 😥 (${err.message})`;
    }
}

export async function getLocalNews() {
    const API_KEY = "5ee6801a049547db820850d072b7cbb7";
    try {
        const url = `https://newsapi.org/v2/everything?q=Argentina&language=es&sortBy=publishedAt&apiKey=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        if (!data.articles?.length) return "No encontré noticias 😅.";

        return data.articles
            .slice(0, 3)
            .map(
                (a) =>
                    `<strong>${a.title}</strong><br><a href="${a.url}" target="_blank">Leer más</a>`
            )
            .join("<br><br>");
    } catch (err) {
        return `Error al traer noticias 😥 (${err.message})`;
    }
}

export async function saveNoteFromChat(content) {
    const token = localStorage.getItem("token");
    if (!token) return { success: false, message: "Necesitas iniciar sesión para guardar notas." };

    try {
        const res = await fetch("http://localhost:3000/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ title: "Nota desde Milo", content }),
        });
        const data = await res.json();

        if (res.ok) return { success: true, message: "¡Nota guardada correctamente! 📝" };
        else return { success: false, message: data.message || "Error al guardar la nota." };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Error de conexión con el servidor." };
    }
}
