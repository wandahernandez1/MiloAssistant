// js/notes.js

document.addEventListener('DOMContentLoaded', () => {

    const newNoteBtn = document.getElementById('newNoteBtn');
    const noteInputCard = document.getElementById('noteInputCard');
    const noteTitleInput = document.getElementById('noteTitleInput');
    const noteContentTextarea = document.getElementById('noteContentTextarea');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const cancelNoteBtn = document.getElementById('cancelNoteBtn');
    const notesListContainer = document.getElementById('notesListContainer');

    let editingNoteId = null;


    function showMessage(message, type = 'info') {
        let messageDiv = document.getElementById('messageDiv');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'messageDiv';
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 30px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                display: none;
                text-align: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                min-width: 250px;
            `;
            document.body.appendChild(messageDiv);
        }

        messageDiv.textContent = message;
        messageDiv.style.display = 'block';

        if (type === 'success') {
            messageDiv.style.backgroundColor = '#4CAF50';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#F44336';
        } else {
            messageDiv.style.backgroundColor = '#2196F3';
        }


        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    // --- Funciones CRUD ---

    // Carga las notas desde localStorage
    function loadNotes() {

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser || !loggedInUser.email) {
            console.warn("No hay usuario logueado. No se cargarán notas.");
            return [];
        }
        const userNotesKey = `notes_${loggedInUser.email}`;
        const notes = JSON.parse(localStorage.getItem(userNotesKey)) || [];
        return notes;
    }

    // Guarda las notas en localStorage
    function saveNotes(notes) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser || !loggedInUser.email) {
            console.error("No hay usuario logueado. No se pudieron guardar las notas.");
            return;
        }
        const userNotesKey = `notes_${loggedInUser.email}`;
        localStorage.setItem(userNotesKey, JSON.stringify(notes));
    }

    // Renderiza la lista de notas en el DOM
    function displayNotes() {
        notesListContainer.innerHTML = ''; // Limpia el contenedor actual
        const notes = loadNotes();

        if (notes.length === 0) {
            notesListContainer.innerHTML = '<p style="text-align: center; color: #c0c0c0; margin-top: 30px;">Aún no tienes notas. ¡Crea una!</p>';
            return;
        }

        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-item-card');
            noteCard.dataset.id = note.id; // Guarda el ID de la nota en el dataset

            noteCard.innerHTML = `
                <div class="note-item-content">
                    <h3>${note.title}</h3>
                    <pre>${note.content}</pre>
                </div>
                <div class="note-item-actions">
                    <button class="icon-button edit-button"><i class="fas fa-pencil-alt"></i></button>
                    <button class="icon-button delete-button"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;

            // Añade event listeners a los botones de Editar y Eliminar
            noteCard.querySelector('.edit-button').addEventListener('click', () => {
                editNote(note.id);
            });
            noteCard.querySelector('.delete-button').addEventListener('click', () => {
                deleteNote(note.id);
            });

            notesListContainer.appendChild(noteCard);
        });
    }

    // Abre el formulario en modo "nueva nota"
    function openNewNoteForm() {
        noteTitleInput.value = '';
        noteContentTextarea.value = '';
        editingNoteId = null;
        noteInputCard.style.display = 'flex';
        noteTitleInput.focus();
    }

    // Carga una nota existente en el formulario para edición
    function editNote(id) {
        const notes = loadNotes();
        const noteToEdit = notes.find(note => note.id === id);

        if (noteToEdit) {
            noteTitleInput.value = noteToEdit.title;
            noteContentTextarea.value = noteToEdit.content;
            editingNoteId = id;
            noteInputCard.style.display = 'flex';
            noteTitleInput.focus();
        } else {
            showMessage('Nota no encontrada para editar.', 'error');
        }
    }

    // Guarda una nota (nueva o editada)
    function saveNote() {
        const title = noteTitleInput.value.trim();
        const content = noteContentTextarea.value.trim();

        if (!title || !content) {
            showMessage('El título y el contenido de la nota no pueden estar vacíos.', 'error');
            return;
        }

        let notes = loadNotes();

        if (editingNoteId) {
            // Modo edición
            notes = notes.map(note =>
                note.id === editingNoteId ? { ...note, title, content } : note
            );
            showMessage('Nota actualizada con éxito.', 'success');
        } else {
            // Modo nueva nota
            const newNote = {
                id: Date.now(),
                title,
                content
            };
            notes.push(newNote);
            showMessage('Nota guardada con éxito.', 'success');
        }

        saveNotes(notes);
        displayNotes(); // Refresca la lista de notas
        noteInputCard.style.display = 'none';
        editingNoteId = null;
    }

    // Elimina una nota
    function deleteNote(id) {

        if (!confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            return;
        }

        let notes = loadNotes();
        notes = notes.filter(note => note.id !== id);
        saveNotes(notes);
        displayNotes();
        showMessage('Nota eliminada.', 'info');
    }

    // Cierra y resetea el formulario de notas
    function cancelNote() {
        noteInputCard.style.display = 'none';
        noteTitleInput.value = '';
        noteContentTextarea.value = '';
        editingNoteId = null;
    }



    newNoteBtn.addEventListener('click', openNewNoteForm);
    saveNoteBtn.addEventListener('click', saveNote);
    cancelNoteBtn.addEventListener('click', cancelNote);

    // Carga las notas al inicializar la página
    displayNotes();
});
