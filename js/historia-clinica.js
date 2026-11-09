const formularioHistoria = document.getElementById('formularioHistoria');
const tablaHistorias = document.getElementById('tablaHistorias');
const selectMascota = document.getElementById('mascotaHistoria');
const selectVeterinario = document.getElementById('veterinarioHistoria');
const filtroMascotaHistoria = document.getElementById('filtroMascotaHistoria');

function obtenerHistorias() {
    return JSON.parse(localStorage.getItem('historiasClinicas')) || [];
}

function guardarHistorias(historias) {
    localStorage.setItem('historiasClinicas', JSON.stringify(historias));
}

function obtenerMascotas() {
    return JSON.parse(localStorage.getItem('mascotas')) || [];
}

function obtenerVeterinarios() {
    return JSON.parse(localStorage.getItem('veterinarios')) || [];
}

function generarId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function cargarSelectores() {
    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();

    selectMascota.innerHTML = '<option value="">Seleccione una mascota...</option>';
    filtroMascotaHistoria.innerHTML = '<option value="">Mostrar todas las consultas registradas</option>';

    mascotas.forEach(m => {
        const opcion = `<option value="${m.idMascota}">${m.nombreMascota} (Dueño: ${m.nombreDuenio})</option>`;
        selectMascota.innerHTML += opcion;
        filtroMascotaHistoria.innerHTML += opcion;
    });

    selectVeterinario.innerHTML = '<option value="">Seleccione un veterinario...</option>';
    veterinarios.forEach(v => {
        selectVeterinario.innerHTML += `<option value="${v.idVeterinario}">${v.nombre} - ${v.especializacion}</option>`;
    });
}

function actualizarTablaHistorias() {
    let historias = obtenerHistorias();
    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();

    const idMascotaFiltro = filtroMascotaHistoria.value;
    if (idMascotaFiltro) {
        historias = historias.filter(h => h.idMascota === idMascotaFiltro);
    }

    tablaHistorias.innerHTML = '';

    historias.forEach(h => {
        const mascota = mascotas.find(m => m.idMascota === h.idMascota);
        const vet = veterinarios.find(v => v.idVeterinario === h.idVeterinario);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${h.fecha}</td>
            <td>${mascota ? mascota.nombreMascota : 'Eliminada'}</td>
            <td>${vet ? vet.nombre : 'Eliminado'}</td>
            <td>Peso: ${h.peso} kg<br>Temp: ${h.temperatura} °C</td>
            <td>
                <strong>Diag:</strong> ${h.diagnostico}<br>
                <strong>Trat:</strong> ${h.tratamiento}
            </td>
            <td>${h.proximoControl || 'Sin definir'}</td>
        `;
        tablaHistorias.appendChild(tr);
    });
}

formularioHistoria.addEventListener('submit', function(e) {
    e.preventDefault();
    const historias = obtenerHistorias();

    const nuevaHistoria = {
        idHistoria: generarId(),
        idMascota: selectMascota.value,
        idVeterinario: selectVeterinario.value,
        fecha: document.getElementById('fechaHistoria').value,
        peso: parseFloat(document.getElementById('pesoHistoria').value),
        temperatura: parseFloat(document.getElementById('temperaturaHistoria').value),
        diagnostico: document.getElementById('diagnosticoHistoria').value,
        tratamiento: document.getElementById('tratamientoHistoria').value,
        proximoControl: document.getElementById('proximoControlHistoria').value
    };

    historias.push(nuevaHistoria);
    guardarHistorias(historias);
    formularioHistoria.reset();
    actualizarTablaHistorias();
});

filtroMascotaHistoria.addEventListener('change', actualizarTablaHistorias);

document.addEventListener('DOMContentLoaded', () => {
    cargarSelectores();
    actualizarTablaHistorias();
});