export function useAuth() {
    const login = async (email, password) => {
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // guardamos el token o user en estado/contexto
                localStorage.setItem("token", data.token);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (res.ok) return { success: true, user: data.user };
            else return { success: false, message: data.message };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const logout = async () => {
        localStorage.removeItem("token");
        // opcional: avisar al backend para invalidar sesión
    };

    const getCurrentUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const res = await fetch("/api/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return null;
        return await res.json();
    };

    return { login, register, logout, getCurrentUser };
}
