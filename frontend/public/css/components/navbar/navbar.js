export default function Navbar() {
	// Obtener la ruta actual
	const currentPath = window.location.pathname.split("/").pop();
	// .split('/') divide el pathname en un array usando / como separador
	//.pop() obtiene el último elemento del array, que normalmente es el nombre del archivo actual.

	// Función para verificar si un enlace debe estar seleccionado
	const isSelected = (linkPath) => {
		return currentPath === linkPath ? "nav__link--selected" : "";
	};

	return `
        <img
    src="../imgs/logoSena.svg"
    alt="Logo Sena"
    class="nav__logo"
    width="60px"
    height="60px"
    />
    <div class="nav__aside">
    <span class="nav__menu-btn material-symbols-outlined"> menu </span>
    <div class="nav__dropdown-side-menu">
        <a href="home.html" class="nav__link ${isSelected(
					"home.html"
				)}">Inicio</a>
        <a href="listar-sensores.html" class="nav__link ${isSelected(
					"listar-sensores.html"
				)}">Lista de Sensores</a>
        <a href="crear-sensor.html" class="nav__link ${isSelected(
					"crear-sensor.html"
				)}">Agregar Sensor</a>
        <a href="listar-usuarios.html" class="nav__link ${isSelected(
					"listar-usuarios.html"
				)}">Lista de Usuarios</a>
        <a href="crear-usuario.html" class="nav__link ${isSelected(
					"crear-usuario.html"
				)}">Registrar Usuario</a>
        <a href="listar-insumos.html" class="nav__link ${isSelected(
					"listar-insumos.html"
				)}">Lista de Insumos</a>
        <a href="crear-insumo.html" class="nav__link ${isSelected(
					"crear-insumo.html"
				)}">Agregar Insumo</a>
        <a href="listar-cultivos.html" class="nav__link ${isSelected(
					"listar-cultivos.html"
				)}">Lista de Cultivos</a>
        <a href="listar-ciclo-cultivos.html" class="nav__link ${isSelected(
					"listar-ciclo-cultivos.html"
				)}">Lista de Ciclos</a>
        <a href="crear-cultivo.html" class="nav__link ${isSelected(
					"crear-cultivo.html"
				)}">Agregar Cultivo</a>
        <a href="crear-ciclo-cultivo.html" class="nav__link ${isSelected(
					"crear-ciclo-cultivo.html"
				)}">Agregar Ciclo</a>
        <a href="index.html" class="nav__link ${isSelected(
					"index.html"
				)}">Cerrar Sesión</a>
    </div>
    </div>
    <div class="nav__right-content">
    <ul class="nav__list">
        <li class="nav__item">
            <a href="home.html" class="nav__link ${isSelected(
							"home.html"
						)}">Inicio</a>
        </li>
        <li class="nav__item nav__item--dropdown">
            <a href="#" class="nav__link ${isSelected("listar-sensores.html")}">
                Sensores
                <span class="nav__icon material-symbols-outlined">keyboard_arrow_down</span>
            </a>
            <div class="nav__dropdown-content">
                <a href="listar-sensores.html" class="nav__link ${isSelected(
									"listar-sensores.html"
								)}">Lista de Sensores</a>
                <a href="crear-sensor.html" class="nav__link">Agregar Sensor</a>
            </div>
        </li>
        <li class="nav__item nav__item--dropdown">
            <a href="#" class="nav__link ${isSelected("listar-usuarios.html")}">
                Usuarios
                <span class="nav__icon material-symbols-outlined">keyboard_arrow_down</span>
            </a>
            <div class="nav__dropdown-content">
                <a href="listar-usuarios.html" class="nav__link ${isSelected(
									"listar-usuarios.html"
								)}">Lista de Usuarios</a>
                <a href="crear-usuario.html" class="nav__link">Registrar Usuario</a>
            </div>
        </li>
        <li class="nav__item nav__item--dropdown">
            <a href="#" class="nav__link ${isSelected("listar-insumos.html")}">
                Insumos
                <span class="nav__icon material-symbols-outlined">keyboard_arrow_down</span>
            </a>
            <div class="nav__dropdown-content">
                <a href="listar-insumos.html" class="nav__link ${isSelected(
									"listar-insumos.html"
								)}">Lista de Insumos</a>
                <a href="crear-insumo.html" class="nav__link">Agregar Insumo</a>
            </div>
        </li>
        <li class="nav__item nav__item--dropdown">
            <a href="#" class="nav__link ${isSelected(
							"listar-cultivos.html"
						)} ${isSelected("listar-ciclo-cultivos.html")}">
                Cultivos
                <span class="nav__icon material-symbols-outlined">keyboard_arrow_down</span>
            </a>
            <div class="nav__dropdown-content">
                <a href="listar-cultivos.html" class="nav__link ${isSelected(
									"listar-cultivos.html"
								)}">Lista de Cultivos</a>
                <a href="listar-ciclo-cultivos.html" class="nav__link ${isSelected(
									"listar-ciclo-cultivos.html"
								)}">Lista de Ciclos</a>
                <a href="crear-cultivo.html" class="nav__link">Agregar Cultivo</a>
                <a href="crear-ciclo-cultivo.html" class="nav__link">Agregar Ciclo</a>
            </div>
        </li>
        <li class="nav__item">
            <a href="index.html" class="nav__link ${isSelected(
							"index.html"
						)}">Cerrar Sesión</a>
        </li>
    </ul>
    <img
        src="../imgs/profile-img.jpg"
        alt="profile-image"
        class="nav__user-image"
    />
    </div>

    `;
}
