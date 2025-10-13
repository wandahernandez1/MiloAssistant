
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api.js";

export function useNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const data = await apiFetch("notes", { method: "GET" });
            setNotes(data);
            setError(null);
        } catch (err) {
            setError(`Error al cargar notas: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const createNote = async (note) => {
        setLoading(true);
        try {
            const data = await apiFetch("notes", {
                method: "POST",
                body: JSON.stringify(note),
            });
            setNotes((prev) => [...prev, data]);
            setError(null);
            return data;
        } catch (err) {
            setError(`Error al crear nota: ${err.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateNote = async (id, note) => {
        setLoading(true);
        try {
            const data = await apiFetch(`notes/${id}`, {
                method: "PATCH",
                body: JSON.stringify(note),
            });
            setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
            setError(null);
            return data;
        } catch (err) {
            setError(`Error al actualizar nota: ${err.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        setLoading(true);
        try {
            await apiFetch(`notes/${id}`, { method: "DELETE" });
            setNotes((prev) => prev.filter((n) => n.id !== id));
            setError(null);
            return true;
        } catch (err) {
            setError(`Error al eliminar nota: ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote };
}
