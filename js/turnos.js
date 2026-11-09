const formularioTurno = document.getElementById('formularioTurno');
const tablaTurnos = document.getElementById('tablaTurnos');
const selectMascota = document.getElementById('mascotaTurno');
const selectVeterinario = document.getElementById('veterinarioTurno');
const filtroVeterinario = document.getElementById('filtroVeterinario');
const filtroFecha = document.getElementById('filtroFecha');
const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');

function obtenerTurnos() {
    return JSON.parse(localStorage.getItem('turnos')) || [];
}

function guardarTurnos(turnos) {
    localStorage.setItem('turnos', JSON.stringify(turnos));
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

// Cargar listas desplegables desde LocalStorage
function cargarSelectores() {
    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();

    selectMascota.innerHTML = '<option value="">Seleccione una mascota...</option>';
    mascotas.forEach(m => {
        selectMascota.innerHTML += `<option value="${m.idMascota}">${m.nombreMascota} (Dueño: ${m.nombreDuenio})</option>`;
    });

    selectVeterinario.innerHTML = '<option value="">Seleccione un veterinario...</option>';
    filtroVeterinario.innerHTML = '<option value="">Todos</option>';
    veterinarios.forEach(v => {
        selectVeterinario.innerHTML += `<option value="${v.idVeterinario}">${v.nombre} - ${v.especializacion}</option>`;
        filtroVeterinario.innerHTML += `<option value="${v.idVeterinario}">${v.nombre}</option>`;
    });
}

// Listar Turnos
function actualizarTablaTurnos() {
    let turnos = obtenerTurnos();
    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();

    // Aplicar filtros si están seleccionados
    if (filtroVeterinario.value) {
        turnos = turnos.filter(t => t.idVeterinario === filtroVeterinario.value);
    }
    if (filtroFecha.value) {
        turnos = turnos.filter(t => t.fecha === filtroFecha.value);
    }

    tablaTurnos.innerHTML = '';

    turnos.forEach(turno => {
        const mascota = mascotas.find(m => m.idMascota === turno.idMascota);
        const veterinario = veterinarios.find(v => v.idVeterinario === turno.idVeterinario);

        const nombreMascota = mascota ? `${mascota.nombreMascota} (${mascota.nombreDuenio})` : 'Mascota eliminada';
        const nombreVet = veterinario ? veterinario.nombre : 'Veterinario eliminado';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${turno.fecha} - ${turno.hora} hs</td>
            <td>${nombreMascota}</td>
            <td>${nombreVet}</td>
            <td>${turno.motivo}</td>
            <td>
                <button class="btn btn-info btn-sm text-white" onclick="imprimirComprobante('${turno.idTurno}')" title="Imprimir comprobante">
                    <i class="bi bi-printer"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarTurno('${turno.idTurno}')">
                    Eliminar
                </button>
            </td>
        `;
        tablaTurnos.appendChild(tr);
    });
}

// Registrar Turno
formularioTurno.addEventListener('submit', function(e) {
    e.preventDefault();
    const turnos = obtenerTurnos();

    const nuevoTurno = {
        idTurno: generarId(),
        idMascota: selectMascota.value,
        idVeterinario: selectVeterinario.value,
        fecha: document.getElementById('fechaTurno').value,
        hora: document.getElementById('horaTurno').value,
        motivo: document.getElementById('motivoTurno').value
    };

    turnos.push(nuevoTurno);
    guardarTurnos(turnos);
    formularioTurno.reset();
    actualizarTablaTurnos();
});

// Eliminar Turno
function eliminarTurno(id) {
    if (confirm("¿Está seguro que desea eliminar este turno?")) {
        let turnos = obtenerTurnos();
        turnos = turnos.filter(t => t.idTurno !== id);
        guardarTurnos(turnos);
        actualizarTablaTurnos();
    }
}

// Opcional: Imprimir comprobante del turno
function imprimirComprobante(id) {
    const turnos = obtenerTurnos();
    const turno = turnos.find(t => t.idTurno === id);
    if (!turno) return;

    const mascota = obtenerMascotas().find(m => m.idMascota === turno.idMascota);
    const vet = obtenerVeterinarios().find(v => v.idVeterinario === turno.idVeterinario);

    const ventana = window.open('', '_blank', 'width=600,height=400');
    ventana.document.write(`
        <html>
        <head>
            <title>Comprobante de Turno - Veterinaria Ojeto</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #22425C; }
                .caja { border: 2px solid #4CA593; padding: 20px; border-radius: 8px; }
                h2 { margin-top: 0; color: #4CA593; }
            </style>
        </head>
        <body>
            <div class="caja">
                <h2>Veterinaria Ojeto - Comprobante de Turno</h2>
                <p><strong>Fecha:</strong> ${turno.fecha} a las ${turno.hora} hs</p>
                <p><strong>Mascota:</strong> ${mascota ? mascota.nombreMascota : '-'}</p>
                <p><strong>Dueño:</strong> ${mascota ? mascota.nombreDuenio : '-'}</p>
                <p><strong>Veterinario:</strong> ${vet ? vet.nombre : '-'} (${vet ? vet.especializacion : '-'})</p>
                <p><strong>Motivo:</strong> ${turno.motivo}</p>
            </div>
            <script>window.print();<\/script>
        </body>
        </html>
    `);
    ventana.document.close();
}

filtroVeterinario.addEventListener('change', actualizarTablaTurnos);
filtroFecha.addEventListener('change', actualizarTablaTurnos);
btnLimpiarFiltros.addEventListener('click', () => {
    filtroVeterinario.value = '';
    filtroFecha.value = '';
    actualizarTablaTurnos();
});

document.addEventListener('DOMContentLoaded', () => {
    cargarSelectores();
    actualizarTablaTurnos();
});