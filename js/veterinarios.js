document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioVeterinario');
    const tabla = document.getElementById('tablaVeterinarios');
    const idInput = document.getElementById('idVeterinario');
    const btnCancelar = document.getElementById('botonCancelarVeterinario');
    
    // Obtener veterinarios de LocalStorage
    const obtenerVeterinarios = () => JSON.parse(localStorage.getItem('veterinarios')) || [];
    
    // Guardar veterinarios en LocalStorage
    const guardarVeterinarios = (vets) => localStorage.setItem('veterinarios', JSON.stringify(vets));
    
    // Generar un ID único simple
    const generarId = () => '_' + Math.random().toString(36).substr(2, 9);

    // Actualizar la tabla
    function actualizarTabla() {
        const veterinarios = obtenerVeterinarios();
        tabla.innerHTML = '';
        
        veterinarios.forEach(v => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${v.matricula}</td>
                <td>${v.nombre}</td>
                <td>${v.especializacion}</td>
                <td>$${v.valorConsulta}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1 mb-1" onclick="editarVeterinario('${v.idVeterinario}')" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger mb-1" onclick="eliminarVeterinario('${v.idVeterinario}')" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    }

    // Submit del formulario (Registrar / Editar)
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let veterinarios = obtenerVeterinarios();
        const idActual = idInput.value;
        
        const datosVet = {
            idVeterinario: idActual || generarId(),
            matricula: document.getElementById('matricula').value,
            nombre: document.getElementById('nombre').value,
            especializacion: document.getElementById('especializacion').value,
            valorConsulta: document.getElementById('valorConsulta').value
        };

        if (idActual) {
            // Modo Edición
            const index = veterinarios.findIndex(v => v.idVeterinario === idActual);
            if(index !== -1) veterinarios[index] = datosVet;
        } else {
            // Modo Registro
            veterinarios.push(datosVet);
        }

        guardarVeterinarios(veterinarios);
        resetearFormulario();
        actualizarTabla();
    });

    // Función global para editar
    window.editarVeterinario = (id) => {
        const veterinarios = obtenerVeterinarios();
        const vet = veterinarios.find(v => v.idVeterinario === id);
        
        if (vet) {
            idInput.value = vet.idVeterinario;
            document.getElementById('matricula').value = vet.matricula;
            document.getElementById('nombre').value = vet.nombre;
            document.getElementById('especializacion').value = vet.especializacion;
            document.getElementById('valorConsulta').value = vet.valorConsulta;
            
            btnCancelar.classList.remove('d-none');
            // Desplazar suavemente hacia el formulario
            document.querySelector('.card-header').scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Función global para eliminar
    window.eliminarVeterinario = (id) => {
        if(confirm('¿Seguro que deseas eliminar este veterinario?')) {
            let veterinarios = obtenerVeterinarios();
            veterinarios = veterinarios.filter(v => v.idVeterinario !== id);
            guardarVeterinarios(veterinarios);
            actualizarTabla();
        }
    };

    // Botón cancelar edición
    btnCancelar.addEventListener('click', resetearFormulario);

    function resetearFormulario() {
        formulario.reset();
        idInput.value = '';
        btnCancelar.classList.add('d-none');
    }

    // Inicializar la tabla al cargar la página
    actualizarTabla();
});