document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (!userId) {
        alert("ID del usuario no encontrado en la URL");
        window.location.href = "listar-usuarios.html";
        return;
    }

    const form = document.querySelector(".form__container");
    const tipoDocumentoInput = form.querySelector("#tipo-documento");
    const nombreInput = form.querySelector("#nombre");
    const numeroDocumentoInput = form.querySelector("#numero-documento");
    const telefonoInput = form.querySelector("#telefono");
    const correoInput = form.querySelector("#correo");
    const confirmarCorreoInput = form.querySelector("#confirmar-correo");
    const rolInput = form.querySelector("#rol");
    const estadoRadios = form.querySelectorAll("[name='estado-habilitado']");
    const submitButton = form.querySelector("button[type='submit']");

    let usuarioActual = null;

    try {
        const response = await fetch(`http://localhost:5000/usuarios/${userId}`);
        if (!response.ok) throw new Error("No se pudo obtener el usuario");

        usuarioActual = await response.json();

        // Asignación de valores a los campos del formulario
        tipoDocumentoInput.value = usuarioActual.tipo_documento || usuarioActual.tipoDocumento || '';
        nombreInput.value = usuarioActual.nombre || usuarioActual.nombre_completo || '';
        numeroDocumentoInput.value = usuarioActual.numero_documento || usuarioActual.numeroDocumento || '';
        telefonoInput.value = usuarioActual.telefono || '';
        correoInput.value = usuarioActual.correo || '';
        confirmarCorreoInput.value = usuarioActual.correo || '';
        rolInput.value = usuarioActual.rol || '';

        // Selección del estado
        for (const radio of estadoRadios) {
            radio.checked = radio.value === (usuarioActual.estado || '').toLowerCase();
        }
    } catch (error) {
        console.error("Error cargando datos del usuario:", error);
        alert("No se pudo cargar la información del usuario.");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!usuarioActual) {
            alert("No se puede actualizar sin datos del usuario cargados.");
            return;
        }

        let estadoSeleccionado = null;
        for (const radio of estadoRadios) {
            if (radio.checked) {
                estadoSeleccionado = radio.value;
                break;
            }
        }

        // Construcción de objeto para PUT
        const datosActualizados = {
            nombre: nombreInput.value.trim(),
            correo: correoInput.value.trim(),
            rol: rolInput.value,
            estado: estadoSeleccionado
        };

        // Puedes agregar validaciones adicionales aquí

        submitButton.disabled = true;

        try {
            const response = await fetch(`http://localhost:5000/usuarios/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosActualizados)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "No se pudo actualizar el usuario");
            }

            alert("Usuario actualizado correctamente.");
            window.location.href = "listar-usuarios.html";
        } catch (error) {
            console.error("Error actualizando usuario:", error);
            alert("Hubo un error al actualizar el usuario.");
        } finally {
            submitButton.disabled = false;
        }
    });
});
