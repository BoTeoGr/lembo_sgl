document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.userForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Recuperar los datos almacenados
        const userData = JSON.parse(localStorage.getItem("userData"));

        if (!userData) {
            console.error("No hay datos en localStorage");
            return;
        }

        // Validar que los valores estén completos
        if (!userData.id_insumo || !userData.nombre || !userData.tipo || !userData.unidad_medida ||
            !userData.valor_unitario || !userData.cantidad || !userData.descripcion) {
            console.error("Faltan datos obligatorios");
            return;
        }

        // Calcular el valor total antes de enviarlo
        userData.valor_total = (parseFloat(userData.valor_unitario) * parseInt(userData.cantidad)).toFixed(2);

        try {
            const response = await fetch('http://localhost:5500/insumo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const result = await response.json();
            console.log('Insumo registrado:', result);

            form.reset(); // Limpiar formulario
            localStorage.removeItem("userData"); // Eliminar datos después de enviarlos
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
