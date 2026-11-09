const paginasProtegidas = [
    'veterinarios.html',
    'mascotas.html',
    'turnos.html',
    'historia-clinica.html'
];

function tieneSesionIniciada() {
    return sessionStorage.getItem('token') !== null;
}

// Proteger acceso directo por URL
function verificarAccesoRuta() {
    const rutaActual = window.location.pathname;
    const esProtegida = paginasProtegidas.some(pagina => rutaActual.includes(pagina));

    if (esProtegida && !tieneSesionIniciada()) {
        window.location.href = '/login.html';
    }
}

// Ejecutar inmediatamente al cargar el script
verificarAccesoRuta();

// Configurar barra de navegación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const itemsAdmin = document.querySelectorAll('.nav-admin');
    const navLogin = document.getElementById('navLogin');
    const navLogout = document.getElementById('navLogout');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    if (tieneSesionIniciada()) {
        itemsAdmin.forEach(item => item.classList.remove('d-none'));
        if (navLogin) navLogin.classList.add('d-none');
        if (navLogout) navLogout.classList.remove('d-none');
    } else {
        itemsAdmin.forEach(item => item.classList.add('d-none'));
        if (navLogin) navLogin.classList.remove('d-none');
        if (navLogout) navLogout.classList.add('d-none');
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('usuario');
            window.location.href = '/index.html';
        });
    }
});