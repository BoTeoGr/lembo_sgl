export default function MenuNav() {
	const menu = document.querySelector(".nav__dropdown-side-menu");
	const menuBtn = document.querySelector(".nav__menu-btn");
	const navList = document.querySelector(".nav__right-content");

	// Función para alternar la visibilidad del menú desplegable
	const toggleMenu = () => {
		if (menu.style.display === "none" || menu.style.display === "") {
			menu.style.display = "flex"; // Mostrar el menú desplegable
			menuBtn.textContent = "close"; // Cambiar el ícono/texto del botón
		} else {
			menu.style.display = "none"; // Ocultar el menú desplegable
			menuBtn.textContent = "menu"; // Cambiar el ícono/texto del botón
		}
	};

	// Evento para abrir/cerrar el menú desplegable al hacer clic en el botón
	menuBtn.addEventListener("click", toggleMenu);

	// Función para manejar el cambio de tamaño de la ventana
	const handleResize = () => {
		if (window.innerWidth > 767) {
			// Pantallas grandes
			menu.style.display = "none"; // Ocultar el menú desplegable
			menuBtn.style.display = "none"; // Ocultar el botón del menú
			navList.style.display = "flex"; // Mostrar el menú normal
		} else {
			// Pantallas pequeñas
			menuBtn.style.display = "block"; // Mostrar el botón del menú
			navList.style.display = "none"; // Ocultar el menú normal
		}
	};

	// Evento para manejar el cambio de tamaño de la ventana
	window.addEventListener("resize", handleResize);

	// Inicializar el estado del menú y el botón al cargar la página
	handleResize();
}
