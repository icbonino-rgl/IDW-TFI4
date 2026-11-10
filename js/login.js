// --- 1. PROTECCIÓN DE PÁGINAS DE ADMINISTRACIÓN ---
const token = sessionStorage.getItem('token');
const urlActual = document.URL; // Propiedad vista en Unidad 5 - DOM (pág. 9)

// Si intenta entrar a una página de administración sin haber iniciado sesión, redirige a login.html
if (!token) {
    if (urlActual.includes('veterinarios.html') || 
        urlActual.includes('mascotas.html') || 
        urlActual.includes('turnos.html') || 
        urlActual.includes('historia-clinica.html')) {
        window.location.href = '/login.html';
    }
}

// --- 2. BARRA DE NAVEGACIÓN Y EVENTOS ---
document.addEventListener('DOMContentLoaded', function () {
    const opcionesAdmin = document.querySelectorAll('.nav-admin');
    const navLogin = document.getElementById('navLogin');
    const navLogout = document.getElementById('navLogout');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    // Mostrar u ocultar opciones según si existe el token en sessionStorage
    if (token) {
        opcionesAdmin.forEach(item => item.classList.remove('d-none'));
        if (navLogin) navLogin.classList.add('d-none');
        if (navLogout) navLogout.classList.remove('d-none');
    } else {
        opcionesAdmin.forEach(item => item.classList.add('d-none'));
        if (navLogin) navLogin.classList.remove('d-none');
        if (navLogout) navLogout.classList.add('d-none');
    }

    // Evento para Cerrar Sesión
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function (event) {
            event.preventDefault();
            sessionStorage.removeItem('token');
            window.location.href = '/index.html';
        });
    }

    // --- 3. INICIO DE SESIÓN CON FETCH Y PROMESAS (Unidad 6 - Pág. 10) ---
    const formularioLogin = document.getElementById('formularioLogin');

    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function (event) {
            event.preventDefault();

            const usuarioInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;
            const mensajeError = document.getElementById('errorLogin');

            mensajeError.classList.add('d-none');

            const prom = fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: usuarioInput,
                    password: passwordInput
                })
            });

            prom.then(response => {
                if (!response.ok) throw Error('Credenciales incorrectas');
                return response.json(); // response.json() devuelve otra promise
            })
            .then(data => {
                // Guardamos el token recibido en sessionStorage
                sessionStorage.setItem('token', data.accessToken);
                window.location.href = '/mascotas.html';
            })
            .catch(error => {
                console.error(error);
                mensajeError.classList.remove('d-none');
            });
        });
    }
});
