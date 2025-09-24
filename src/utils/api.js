// Manejo de token y errores HTTP
export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        throw new Error("No hay token, inicia sesión");
    }

    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    const res = await fetch(`http://localhost:3000/api/${cleanUrl}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("No autorizado. Inicia sesión nuevamente.");
    }

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error en la petición: ${res.status} - ${errorText}`);
    }

    return await res.json();
}
