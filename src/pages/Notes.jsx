import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/notes.css";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: "", type: "" });

    const token = localStorage.getItem("token");


    const showMessage = (message, type = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    // Función principal para obtener las notas del backend
    const fetchNotes = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/notes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setNotes(data);
            } else {
                showMessage("Error al cargar notas: " + (data.message || "Desconocido"), "error");
            }
        } catch (error) {
            showMessage("Error de conexión con el servidor.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Se ejecuta al cargar el componente para traer las notas
    useEffect(() => {
        fetchNotes();
    }, []);

    const openNewNoteForm = () => {
        setTitle("");
        setContent("");
        setEditingNoteId(null);
        setShowInput(true);
    };

    const handleSaveNote = async () => {
        if (!title.trim() || !content.trim()) {
            showMessage("El título y el contenido no pueden estar vacíos.", "error");
            return;
        }

        let method = "POST";
        let url = "http://localhost:3000/api/notes";
        let successMessage = "Nota guardada con éxito.";

        if (editingNoteId) {
            method = "PATCH";
            url = `http://localhost:3000/api/notes/${editingNoteId}`;
            successMessage = "Nota actualizada con éxito.";
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                showMessage(successMessage, "success");
                setShowInput(false);
                setTitle("");
                setContent("");
                setEditingNoteId(null);
                fetchNotes();
            } else {
                const errorData = await response.json();
                showMessage("Error: " + (errorData.message || "No se pudo guardar la nota."), "error");
            }
        } catch (error) {
            showMessage("Error de conexión. No se pudo guardar la nota.", "error");
        }
    };

    const handleEditNote = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingNoteId(note._id);
        setShowInput(true);
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                showMessage("Nota eliminada.", "info");
                fetchNotes(); // Vuelve a cargar las notas
            } else {
                const errorData = await response.json();
                showMessage("Error: " + (errorData.message || "No se pudo eliminar la nota."), "error");
            }
        } catch (error) {
            showMessage("Error de conexión. No se pudo eliminar la nota.", "error");
        }
    };

    const handleCancel = () => {
        setTitle("");
        setContent("");
        setShowInput(false);
        setEditingNoteId(null);
    };

    return (
        <div className="notes-page">
            <Navbar />
            <div className="main-container">
                <aside className="sidebar">
                    <button onClick={() => window.history.back()} className="back-button-sidebar">
                        <i className="fas fa-arrow-left"></i> <span>Volver</span>
                    </button>
                    <button className="sidebar-button active">
                        <i className="fas fa-file-alt icon"></i>
                        <span>Notas</span>
                    </button>
                    <button className="sidebar-button">
                        <i className="fas fa-calendar-alt icon"></i>
                        <span>Organiza tu calendario</span>
                    </button>
                </aside>

                <main className="content-area">
                    <section className="notes-section">
                        <div className="section-header">
                            <h2>Tus Notas</h2>
                            <button className="new-note-button" onClick={openNewNoteForm}>
                                <i className="fas fa-plus"></i> Nueva nota
                            </button>
                        </div>

                        {showInput && (
                            <div className="note-input-card">
                                <input
                                    type="text"
                                    placeholder="Agregar título"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <textarea
                                    placeholder="Escribe tu nota..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <div className="note-actions">
                                    <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
                                    <button className="save-button" onClick={handleSaveNote}>Guardar</button>
                                </div>
                            </div>
                        )}

                        <h2 className="notes-list-title">Notas Guardadas</h2>
                        <div className="notes-list-container">
                            {loading ? (
                                <p className="empty-notes">Cargando notas...</p>
                            ) : notes.length === 0 ? (
                                <p className="empty-notes">Aún no tienes notas. ¡Crea una!</p>
                            ) : (
                                notes.map((note) => (
                                    <div key={note.id} className="note-item-card">
                                        <div className="note-item-content">
                                            <h3>{note.title}</h3>
                                            <pre>{note.content}</pre>
                                        </div>
                                        <div className="note-item-actions">
                                            <button className="icon-button edit-button" onClick={() => handleEditNote(note)}>
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="icon-button delete-button" onClick={() => handleDeleteNote(note.id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </main>
            </div>
            {toast.message && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}