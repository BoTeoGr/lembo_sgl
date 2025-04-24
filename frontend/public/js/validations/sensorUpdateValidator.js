document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const sensorId = params.get("id");

    if (!sensorId) {
        alert("ID del sensor no encontrado en la URL");
        window.location.href = "listar-sensores.html";
        return;
    }

    const form = document.querySelector(".form__container");
    const tipoSelect = form.querySelector(".form__select--sensor-type");
    const nombreInput = form.querySelector(".form__input--sensor-name");
    const unidadSelect = form.querySelector(".form__select--sensor-unit");
    const descripcionTextarea = form.querySelector(".form__textarea--sensor-description");
    const tiempoEscaneoSelect = form.querySelector(".form__select--sensor-scan");
    const estadoRadios = form.querySelectorAll("[name='estado-habilitado']");
    const imagenInput = form.querySelector(".form__file--sensor-image"); // input type=file
    const submitButton = form.querySelector("button[type='submit']");

    let sensorActual = null;

    try {
        const response = await fetch(`http://localhost:5000/sensor/${sensorId}`);
        if (!response.ok) throw new Error("No se pudo obtener el sensor");

        sensorActual = await response.json();

        // Asignación de valores a los campos del formulario
        if (tipoSelect) tipoSelect.value = sensorActual.tipo_sensor || "default";
        if (nombreInput) nombreInput.value = sensorActual.nombre_sensor || "";
        if (unidadSelect) unidadSelect.value = sensorActual.unidad_medida || "default";
        if (descripcionTextarea) descripcionTextarea.value = sensorActual.descripcion || "";
        if (tiempoEscaneoSelect) tiempoEscaneoSelect.value = sensorActual.tiempo_escaneo || "default";

        // Imagen: solo mostrar nombre si existe, no se puede asignar value por seguridad
        if (imagenInput && sensorActual.imagen) {
            // Mostrar nombre del archivo en algún lugar si es necesario
            imagenInput.setAttribute('data-existing', sensorActual.imagen);
        }

        // Selección del estado
        for (const radio of estadoRadios) {
            radio.checked = radio.value === sensorActual.estado;
        }
    } catch (error) {
        console.error("Error cargando datos del sensor:", error);
        alert("No se pudo cargar la información del sensor.");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!sensorActual) {
            alert("No se puede actualizar sin datos del sensor cargados.");
            return;
        }

        const datosActualizados = {};

        // Comprobación de campos modificados
        if (nombreInput && nombreInput.value.trim() !== "" && nombreInput.value.trim() !== sensorActual.nombre_sensor) {
            datosActualizados.nombre_sensor = nombreInput.value.trim();
        }

        if (tipoSelect && tipoSelect.value !== "default" && tipoSelect.value !== sensorActual.tipo_sensor) {
            datosActualizados.tipo_sensor = tipoSelect.value;
        }

        if (unidadSelect && unidadSelect.value !== "default" && unidadSelect.value !== sensorActual.unidad_medida) {
            datosActualizados.unidad_medida = unidadSelect.value;
        }

        if (descripcionTextarea && descripcionTextarea.value.trim() !== sensorActual.descripcion) {
            datosActualizados.descripcion = descripcionTextarea.value.trim();
        }

        if (tiempoEscaneoSelect && tiempoEscaneoSelect.value !== "default" && tiempoEscaneoSelect.value !== sensorActual.tiempo_escaneo) {
            datosActualizados.tiempo_escaneo = tiempoEscaneoSelect.value;
        }

        // Imagen: solo enviar si se selecciona una nueva
        if (imagenInput && imagenInput.files && imagenInput.files.length > 0) {
            // Aquí deberías manejar la subida de archivos si el backend lo soporta
            // Por ahora, solo enviamos el nombre del archivo
            datosActualizados.imagen = imagenInput.files[0].name;
        }

        let estadoSeleccionado = null;
        for (const radio of estadoRadios) {
            if (radio.checked) {
                estadoSeleccionado = radio.value;
                break;
            }
        }
        if (estadoSeleccionado && estadoSeleccionado !== sensorActual.estado) {
            datosActualizados.estado = estadoSeleccionado;
        }

        if (Object.keys(datosActualizados).length === 0) {
            return;
        }

        submitButton.disabled = true;
        try {
            const response = await fetch(`http://localhost:5000/sensor/${sensorId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosActualizados)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "No se pudo actualizar el sensor");
            }

            window.location.href = "listar-sensores.html";
        } catch (error) {
            console.error("Error actualizando sensor:", error);
        } finally {
            submitButton.disabled = false;
        }
    });
});
