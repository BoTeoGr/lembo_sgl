document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const sensorId = params.get("id");

    if (!sensorId) {
        alert("ID del sensor no encontrado en la URL");
        window.location.href = "listar-sensores.html";
        return;
    }

    const form = document.querySelector(".form__container");
    const tipoInput = form.querySelector(".form__input--sensor-type");
    const nombreInput = form.querySelector(".form__input--sensor-name");
    const unidadInput = form.querySelector(".form__input--sensor-unit");
    const descripcionInput = form.querySelector(".form__textarea--sensor-description");
    const tiempoEscaneoInput = form.querySelector(".form__input--sensor-scan-time");
    const estadoRadios = form.querySelectorAll("[name='estado-habilitado']");
    const imagenInput = form.querySelector(".form__file--sensor-image"); // cadena, no archivo
    const submitButton = form.querySelector("button[type='submit']");

    let sensorActual = null;

    try {
        const response = await fetch(`http://localhost:5000/sensor/${sensorId}`);
        if (!response.ok) throw new Error("No se pudo obtener el sensor");

        sensorActual = await response.json();

        // Asignación de valores a los campos del formulario
        tipoInput.value = sensorActual.tipo_sensor;
        nombreInput.value = sensorActual.nombre_sensor;
        unidadInput.value = sensorActual.unidad_medida;
        descripcionInput.value = sensorActual.descripcion;
        tiempoEscaneoInput.value = sensorActual.tiempo_escaneo;

        imagenInput.value = sensorActual.imagen; // Como cadena de texto

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
        if (nombreInput.value.trim() !== "" && nombreInput.value.trim() !== sensorActual.nombre_sensor) {
            datosActualizados.nombre_sensor = nombreInput.value.trim();
        }

        if (tipoInput.value.trim() !== "" && tipoInput.value.trim() !== sensorActual.tipo_sensor) {
            datosActualizados.tipo_sensor = tipoInput.value.trim();
        }

        if (unidadInput.value.trim() !== "" && unidadInput.value.trim() !== sensorActual.unidad_medida) {
            datosActualizados.unidad_medida = unidadInput.value.trim();
        }

        if (descripcionInput.value.trim() !== "" && descripcionInput.value.trim() !== sensorActual.descripcion) {
            datosActualizados.descripcion = descripcionInput.value.trim();
        }

        if (tiempoEscaneoInput.value !== "" && tiempoEscaneoInput.value !== sensorActual.tiempo_escaneo) {
            datosActualizados.tiempo_escaneo = tiempoEscaneoInput.value.trim();
        }

        if (imagenInput.value.trim() !== "" && imagenInput.value.trim() !== sensorActual.imagen) {
            datosActualizados.imagen = imagenInput.value.trim(); // Como cadena de texto
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
            alert("No se han realizado cambios.");
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

            alert("Sensor actualizado correctamente.");
            window.location.href = "listar-sensores.html";
        } catch (error) {
            console.error("Error actualizando sensor:", error);
            alert("Hubo un error al actualizar el sensor.");
        } finally {
            submitButton.disabled = false;
        }
    });
});
