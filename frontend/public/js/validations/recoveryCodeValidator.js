document.addEventListener("DOMContentLoaded", () => {
	const codeInputs = document.querySelectorAll(".login-code__input");
	const form = document.querySelector("#form-recovery-code");
	const alertContainer = document.querySelector("#alert-container");

	// Mover al siguiente input
	codeInputs.forEach((input, index) => {
		input.addEventListener("input", (e) => {
			const value = e.target.value;

			// Asegurar que solo se escriba un número
			if (!/^\d$/.test(value)) {
				input.value = "";
				return;
			}

			if (value && index < codeInputs.length - 1) {
				codeInputs[index + 1].focus();
			}

			// Eliminamos esta línea para que no muestre el mensaje mientras se completa el código
			// showAlert("Completando el código...");
		});

		input.addEventListener("keydown", (e) => {
			if (e.key === "Backspace" && !input.value && index > 0) {
				codeInputs[index - 1].focus();
			}
		});
	});

	// Validar código al enviar
	form.addEventListener("submit", (e) => {
		e.preventDefault();

		const code = Array.from(codeInputs).map((input) => input.value).join("");

		// Si no se completaron los 6 dígitos
		if (code.length < 6) {
			showAlert("Por favor, completa los 6 dígitos del código.", true);
			return;
		}

		// Si el código tiene 6 dígitos
		showAlert("Datos enviados satisfactoriamente!", false);

		// Redirigir a la página de actualización de contraseña
		setTimeout(() => {
			window.location.href = "actualizacion-contraseña.html";
		}, 2000); // Damos un poco más de tiempo para que el usuario vea el mensaje
	});

	// Función para mostrar alertas
	function showAlert(message, error = false) {
		const alert = document.createElement("p");
		alert.textContent = message;
		alert.classList.add("login-code__alert");

		if (error) {
			alert.classList.add("login-code__alert--error");
		} else {
			alert.classList.add("login-code__alert--success");
		}

		alertContainer.innerHTML = ""; // Limpiar alertas anteriores
		alertContainer.appendChild(alert);

		// Eliminar la alerta después de 5 segundos (solo para alertas de error)
		if (error) {
			setTimeout(() => {
				alert.remove();
			}, 5000);
		}
	}
});