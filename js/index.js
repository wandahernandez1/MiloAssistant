// index.js creado para revisar que inicio sesion antes de navegar.
document.addEventListener('DOMContentLoaded', () => {
    const beginButton = document.getElementById('beginButton');

    if (beginButton) {
        beginButton.addEventListener('click', () => {
            // Revisa si hay un usuario logueado en el almacenamiento local
            const loggedInUser = localStorage.getItem('loggedInUser');

            if (loggedInUser) {
                // Si ya hay una sesion, va directo al dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Si no hay sesion, va a la pagina de login
                window.location.href = 'login.html';
            }
        });
    }
});