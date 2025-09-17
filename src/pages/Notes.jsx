import { useState, useEffect } from "react";
import "../styles/notes.css"; // CSS que pasamos abajo
import Navbar from "../components/Navbar";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "" });

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || { email: "guest" };
    const userNotesKey = `notes_${loggedInUser.email}`;

    // Carga notas desde localStorage
    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem(userNotesKey)) || [];
        setNotes(savedNotes);
    }, [userNotesKey]);

    const saveNotes = (updatedNotes) => {
        localStorage.setItem(userNotesKey, JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
    };

    const showMessage = (message, type = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    const openNewNoteForm = () => {
        setTitle("");
        setContent("");
        setEditingNoteId(null);
        setShowInput(true);
    };

    const handleSaveNote = () => {
        if (!title.trim() || !content.trim()) {
            showMessage("El título y el contenido no pueden estar vacíos.", "error");
            return;
        }

        let updatedNotes;
        if (editingNoteId) {
            updatedNotes = notes.map((note) =>
                note.id === editingNoteId ? { ...note, title, content } : note
            );
            showMessage("Nota actualizada con éxito.", "success");
        } else {
            const newNote = { id: Date.now(), title, content };
            updatedNotes = [...notes, newNote];
            showMessage("Nota guardada con éxito.", "success");
        }

        saveNotes(updatedNotes);
        setShowInput(false);
        setTitle("");
        setContent("");
        setEditingNoteId(null);
    };

    const handleEditNote = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingNoteId(note.id);
        setShowInput(true);
    };

    const handleDeleteNote = (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) return;
        const updatedNotes = notes.filter((note) => note.id !== id);
        saveNotes(updatedNotes);
        showMessage("Nota eliminada.", "info");
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
                            {notes.length === 0 && (
                                <p className="empty-notes">Aún no tienes notas. ¡Crea una!</p>
                            )}
                            {notes.map((note) => (
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
                            ))}
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
