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
        tipoDocumentoInput.value = usuarioActual.tipo_documento;
        nombreInput.value = usuarioActual.nombre_completo;
        numeroDocumentoInput.value = usuarioActual.numero_documento;
        telefonoInput.value = usuarioActual.telefono;
        correoInput.value = usuarioActual.correo;
        confirmarCorreoInput.value = usuarioActual.correo;
        rolInput.value = usuarioActual.rol;

        // Selección del estado
        for (const radio of estadoRadios) {
            radio.checked = radio.value === usuarioActual.estado;
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

        const datosActualizados = {};

        // Comprobación de campos modificados
        if (nombreInput.value.trim() !== usuarioActual.nombre_completo) {
            datosActualizados.nombre_completo = nombreInput.value.trim();
        }

        if (tipoDocumentoInput.value !== usuarioActual.tipo_documento) {
            datosActualizados.tipo_documento = tipoDocumentoInput.value;
        }

        if (numeroDocumentoInput.value.trim() !== usuarioActual.numero_documento) {
            datosActualizados.numero_documento = numeroDocumentoInput.value.trim();
        }

        if (telefonoInput.value.trim() !== usuarioActual.telefono) {
            datosActualizados.telefono = telefonoInput.value.trim();
        }

        if (correoInput.value.trim() !== usuarioActual.correo) {
            datosActualizados.correo = correoInput.value.trim();
        }

        if (rolInput.value !== usuarioActual.rol) {
            datosActualizados.rol = rolInput.value;
        }

        let estadoSeleccionado = null;
        for (const radio of estadoRadios) {
            if (radio.checked) {
                estadoSeleccionado = radio.value;
                break;
            }
        }

        if (estadoSeleccionado && estadoSeleccionado !== usuarioActual.estado) {
            datosActualizados.estado = estadoSeleccionado;
        }

        if (Object.keys(datosActualizados).length === 0) {
            alert("No se han realizado cambios.");
            return;
        }

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
