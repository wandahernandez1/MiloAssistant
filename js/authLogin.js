
// Este script maneja la autenticación (registro, login, logout)
// y las operaciones CRUD para el perfil de usuario (carga, actualización, eliminación).
// También gestiona la visualización del menú de perfil en todas las páginas.

// Variable global para el contenedor del menú de perfil, accesible en cualquier parte del script.
let profileMenuContainer;

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerLink = document.querySelector('.register-link');
    const loginLink = document.querySelector('.login-link');
    const loginCard = document.querySelector('.login-card');
    const registerCard = document.querySelector('.register-card');
    profileMenuContainer = document.querySelector('.profile-menu-container');

    // edición de perfil.
    const editProfileForm = document.getElementById('editProfileForm');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    // Funciones de Utilidad 


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




    function logoutUser() {
        localStorage.removeItem('loggedInUser');
        showMessage('Sesión cerrada correctamente.', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }


    function displayProfileMenu(user) {
        if (!profileMenuContainer) {

            profileMenuContainer = document.querySelector('.profile-menu-container');
            if (!profileMenuContainer) return;
        }

        profileMenuContainer.innerHTML = '';


        const profileButton = document.createElement('div');
        profileButton.className = 'profile-button';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.textContent = user.username ? user.username.charAt(0).toUpperCase() : '';

        const userNameSpan = document.createElement('span');
        userNameSpan.textContent = user.username || user.email;

        const dropdownArrow = document.createElement('i');
        dropdownArrow.className = 'fas fa-caret-down dropdown-arrow';

        profileButton.appendChild(avatarDiv);
        profileButton.appendChild(userNameSpan);
        profileButton.appendChild(dropdownArrow);


        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        dropdownContent.style.display = 'none';

        const editProfileLink = document.createElement('a');
        editProfileLink.href = 'edit-profile.html';
        editProfileLink.textContent = 'Editar Perfil';

        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Cerrar Sesión';
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });

        dropdownContent.appendChild(editProfileLink);
        dropdownContent.appendChild(logoutLink);

        profileMenuContainer.appendChild(profileButton);
        profileMenuContainer.appendChild(dropdownContent);

        profileButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });


        document.addEventListener('click', (event) => {
            if (!profileMenuContainer.contains(event.target)) {
                dropdownContent.style.display = 'none';
            }
        });
    }

    // --- CRUD  ---

    // Load
    function loadUserProfile() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser && editProfileForm) {
            document.getElementById('profileUsername').value = loggedInUser.username || '';
            document.getElementById('profileEmail').value = loggedInUser.email || '';
            // Password is not loaded for security reasons.
        }
    }

    // Update localStorage.
    function updateUserProfile(updatedUser) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));


        const userIndex = users.findIndex(u => u.email === loggedInUser.email);

        if (userIndex !== -1) {

            users[userIndex] = { ...users[userIndex], ...updatedUser };
            localStorage.setItem('users', JSON.stringify(users));


            localStorage.setItem('loggedInUser', JSON.stringify(users[userIndex]));
            showMessage('Perfil actualizado con éxito.', 'success');

            displayProfileMenu(users[userIndex]);
        } else {
            showMessage('Error: Usuario no encontrado para actualizar.', 'error');
        }
    }

    // Delete localStorage.
    function deleteUserAccount() {
        if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        users = users.filter(u => u.email !== loggedInUser.email);
        localStorage.setItem('users', JSON.stringify(users));

        logoutUser();
        showMessage('Tu cuenta ha sido eliminada con éxito.', 'success');
    }



    const loggedInUserFromStorage = localStorage.getItem('loggedInUser');
    const currentPage = window.location.pathname.split('/').pop();

    if (loggedInUserFromStorage) {
        const user = JSON.parse(loggedInUserFromStorage);

        if (currentPage === 'login.html' || currentPage === 'index.html' || currentPage === '') {
            window.location.href = 'dashboard.html';
        } else {

            displayProfileMenu(user);

            if (currentPage === 'edit-profile.html') {
                loadUserProfile();
            }
        }
    } else {

        if (currentPage !== 'login.html' && currentPage !== 'index.html' && currentPage !== '') {
            window.location.href = 'login.html';
        }
    }



    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                showMessage('¡Inicio de sesión exitoso!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showMessage('Credenciales incorrectas o usuario no registrado.', 'error');
            }
        });
    }

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginCard) loginCard.style.display = 'none';
            if (registerCard) registerCard.style.display = 'flex';
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerCard) registerCard.style.display = 'none';
            if (loginCard) loginCard.style.display = 'flex';
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = registerForm.username.value;
            const email = registerForm.registerEmail.value;
            const password = registerForm.registerPassword.value;
            const confirmPassword = registerForm.confirmPassword.value;

            if (password !== confirmPassword) {
                showMessage('Las contraseñas no coinciden.', 'error');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === email)) {
                showMessage('Este email ya está registrado.', 'error');
                return;
            }

            const newUser = { username, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            showMessage('¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
            setTimeout(() => {
                if (registerCard) loginCard.style.display = 'flex'; // Go back to login form
                if (registerCard) registerCard.style.display = 'none';
                registerForm.reset();
            }, 1000);
        });
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const profileUsername = document.getElementById('profileUsername').value;

            const newPassword = document.getElementById('profileNewPassword').value;
            const confirmNewPassword = document.getElementById('profileConfirmNewPassword').value;

            if (newPassword && newPassword !== confirmNewPassword) {
                showMessage('La nueva contraseña y la confirmación no coinciden.', 'error');
                return;
            }

            const updatedUser = { username: profileUsername };
            if (newPassword) {
                updatedUser.password = newPassword;
            }

            updateUserProfile(updatedUser);
        });
    }


    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            deleteUserAccount();
        });
    }
});
