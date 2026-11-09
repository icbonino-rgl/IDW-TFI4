const formularioLogin = document.getElementById('formularioLogin');
const errorLogin = document.getElementById('errorLogin');

// Si ya tiene sesión iniciada, redirigir a administración
if (sessionStorage.getItem('token')) {
    window.location.href = '/turnos.html';
}

formularioLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorLogin.classList.add('d-none');

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const respuesta = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            // Guardar token recibido en sessionStorage
            const token = datos.accessToken || datos.token;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('usuario', datos.username);
            window.location.href = '/turnos.html';
        } else {
            errorLogin.classList.remove('d-none');
        }
    } catch (error) {
        errorLogin.textContent = 'Error de conexión con el servidor.';
        errorLogin.classList.remove('d-none');
    }
});