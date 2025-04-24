document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const cropId = params.get("id");

    if (!cropId) {
        alert("ID del cultivo no encontrado en la URL");
        window.location.href = "listar-cultivos.html";
        return;
    }

    const form = document.querySelector(".form__container");
    const nombreInput = document.getElementById("nombre");
    const tipoInput = document.getElementById("tipo");
    const imagenInput = document.getElementById("imagen"); // cadena, no file
    const idInput = document.getElementById("id");
    const ubicacionInput = document.getElementById("ubicacion");
    const tamanoInput = document.getElementById("tamano");
    const descripcionInput = document.getElementById("descripcion");
    const estadoRadios = document.getElementsByName("estado-habilitado");
    const submitButton = form.querySelector("button[type='submit']");

    let cultivoActual = null;

    try {
        const response = await fetch(`http://localhost:5000/cultivos/${cropId}`);
        if (!response.ok) throw new Error("No se pudo obtener el cultivo");

        cultivoActual = await response.json();

        nombreInput.value = cultivoActual.nombre;
        tipoInput.value = cultivoActual.tipo;
        idInput.value = cultivoActual.id;
        ubicacionInput.value = cultivoActual.ubicacion;
        tamanoInput.value = cultivoActual.tamano;
        descripcionInput.value = cultivoActual.descripcion;
        // imagenInput.value = cultivoActual.imagen;

        for (const radio of estadoRadios) {
            radio.checked = radio.value === cultivoActual.estado;
        }
    } catch (error) {
        console.error("Error cargando datos del cultivo:", error);
        alert("No se pudo cargar la información del cultivo.");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!cultivoActual) {
            alert("No se puede actualizar sin datos del cultivo cargados.");
            return;
        }

        const datosActualizados = {};

        if (nombreInput.value.trim() !== "" && nombreInput.value.trim() !== cultivoActual.nombre) {
            datosActualizados.nombre = nombreInput.value.trim();
        }

        if (tipoInput.value.trim() !== "" && tipoInput.value.trim() !== cultivoActual.tipo) {
            datosActualizados.tipo = tipoInput.value.trim();
        }

        if (ubicacionInput.value.trim() !== "" && ubicacionInput.value.trim() !== cultivoActual.ubicacion) {
            datosActualizados.ubicacion = ubicacionInput.value.trim();
        }

        if (tamanoInput.value.trim() !== "" && tamanoInput.value.trim() !== cultivoActual.tamano) {
            datosActualizados.tamano = tamanoInput.value.trim();
        }

        if (descripcionInput.value.trim() !== "" && descripcionInput.value.trim() !== cultivoActual.descripcion) {
            datosActualizados.descripcion = descripcionInput.value.trim();
        }

        if (imagenInput.value.trim() !== "" && imagenInput.value.trim() !== cultivoActual.imagen) {
            datosActualizados.imagen = imagenInput.value.trim(); // como cadena de texto
        }

        let estadoSeleccionado = null;
        for (const radio of estadoRadios) {
            if (radio.checked) {
                estadoSeleccionado = radio.value;
                break;
            }
        }

        if (estadoSeleccionado && estadoSeleccionado !== cultivoActual.estado) {
            datosActualizados.estado = estadoSeleccionado;
        }

        if (Object.keys(datosActualizados).length === 0) {
            alert("No se han realizado cambios.");
            return;
        }

        submitButton.disabled = true;

        try {
            const response = await fetch(`http://localhost:5000/cultivos/${cropId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosActualizados)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "No se pudo actualizar el cultivo");
            }

            alert("Cultivo actualizado correctamente.");
            window.location.href = "listar-cultivos.html";
        } catch (error) {
            console.error("Error actualizando cultivo:", error);
            alert("Hubo un error al actualizar el cultivo.");
        } finally {
            submitButton.disabled = false;
        }
    });
});
