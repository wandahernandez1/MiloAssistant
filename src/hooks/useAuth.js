import { useState, useEffect, useCallback } from "react";

export function useAuth() {
    const API_URL = "http://localhost:3000/api";
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // useCallback para evitar que la función se recree en cada render
    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setCurrentUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const user = await res.json();
                setCurrentUser(user);
            } else {
                // Si el token no es válido, lo eliminamos
                localStorage.removeItem("token");
                setCurrentUser(null);
            }
        } catch (err) {
            console.error("Error al obtener usuario:", err);
            // Si hay un error de red, también invalidamos el token
            localStorage.removeItem("token");
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    // Llama a fetchUser solo al montar el componente
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // LÓGICA DE LOGIN
    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok && data.access_token) {
                localStorage.setItem("token", data.access_token);
                setCurrentUser(data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message || "Credenciales incorrectas" };
            }
        } catch (err) {
            console.error("Login failed:", err);
            return { success: false, message: "Error de conexión con el servidor." };
        } finally {
            setLoading(false);
        }
    };

    // LÓGICA DE REGISTRO
    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();

            if (res.ok && data.access_token) {
                localStorage.setItem("token", data.access_token);
                setCurrentUser(data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message || "Error al registrar" };
            }
        } catch (err) {
            console.error("Register failed:", err);
            return { success: false, message: err.message || "Error de conexión." };
        } finally {
            setLoading(false);
        }
    };

    // LÓGICA DE LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        setCurrentUser(null);
        // navigate("/login");
    };

    // LÓGICA DE ACTUALIZACIÓN DE USUARIO
    const updateUser = async (updatedData) => {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, message: "No estás logueado" };
        if (!currentUser) return { success: false, message: "Usuario no encontrado" };

        try {
            const res = await fetch(`${API_URL}/users/${currentUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al actualizar usuario");

            setCurrentUser(data.user);
            return { success: true, user: data.user };
        } catch (err) {
            console.error("Error al actualizar:", err);
            return { success: false, message: err.message };
        }
    };

    // LÓGICA DE ELIMINACIÓN DE USUARIO
    const deleteUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, message: "No estás logueado" };
        if (!currentUser) return { success: false, message: "Usuario no encontrado" };

        try {
            const res = await fetch(`${API_URL}/users/${currentUser.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al eliminar usuario");

            logout();
            return { success: true };
        } catch (err) {
            console.error("Error al eliminar:", err);
            return { success: false, message: err.message };
        }
    };

    return { login, register, logout, updateUser, deleteUser, currentUser, loading };
}