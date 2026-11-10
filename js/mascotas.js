document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioMascota');
    const tabla = document.getElementById('tablaMascotas');
    const idInput = document.getElementById('idMascota');
    const btnCancelar = document.getElementById('botonCancelar');
    const contador = document.getElementById('totalMascotas');
    
    const obtenerMascotas = () => JSON.parse(localStorage.getItem('mascotas')) || [];
    const guardarMascotas = (mascotas) => localStorage.setItem('mascotas', JSON.stringify(mascotas));
    const generarId = () => '_' + Math.random().toString(36).substr(2, 9);

    function actualizarTabla() {
        const mascotas = obtenerMascotas();
        tabla.innerHTML = '';
        
        if(contador) contador.textContent = mascotas.length;
        
        mascotas.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${m.nombreMascota}</strong></td>
                <td>${m.nombreDuenio}</td>
                <td>${m.color}</td>
                <td>${m.edad} años</td>
                <td>${m.peso} kg</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1 mb-1" onclick="editarMascota('${m.idMascota}')" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger mb-1" onclick="eliminarMascota('${m.idMascota}')" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    }

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let mascotas = obtenerMascotas();
        const idActual = idInput.value;
        
        const datosMascota = {
            idMascota: idActual || generarId(),
            nombreMascota: document.getElementById('nombreMascota').value,
            nombreDuenio: document.getElementById('nombreDuenio').value,
            color: document.getElementById('color').value,
            edad: document.getElementById('edad').value,
            peso: document.getElementById('peso').value
        };

        if (idActual) {
            const index = mascotas.findIndex(m => m.idMascota === idActual);
            if(index !== -1) mascotas[index] = datosMascota;
        } else {
            mascotas.push(datosMascota);
        }

        guardarMascotas(mascotas);
        resetearFormulario();
        actualizarTabla();
    });

    window.editarMascota = (id) => {
        const mascotas = obtenerMascotas();
        const m = mascotas.find(x => x.idMascota === id);
        
        if (m) {
            idInput.value = m.idMascota;
            document.getElementById('nombreMascota').value = m.nombreMascota;
            document.getElementById('nombreDuenio').value = m.nombreDuenio;
            document.getElementById('color').value = m.color;
            document.getElementById('edad').value = m.edad;
            document.getElementById('peso').value = m.peso;
            
            btnCancelar.classList.remove('d-none');
            document.querySelector('.card-header').scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.eliminarMascota = (id) => {
        if(confirm('¿Seguro que deseas eliminar el registro de esta mascota?')) {
            let mascotas = obtenerMascotas();
            mascotas = mascotas.filter(m => m.idMascota !== id);
            guardarMascotas(mascotas);
            actualizarTabla();
        }
    };

    btnCancelar.addEventListener('click', resetearFormulario);

    function resetearFormulario() {
        formulario.reset();
        idInput.value = '';
        btnCancelar.classList.add('d-none');
    }

    actualizarTabla();
});