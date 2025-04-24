export default function Navbar() {
	const currentPath = window.location.pathname.split("/").pop();

	const isSelected = (linkPath) => {
		return currentPath === linkPath ? "nav__link--selected" : "";
	};

	return `
        <div class="nav">
            <div class="nav__left">
                <img src="../imgs/logoSena.svg" alt="Logo Sena" class="nav__logo" />
                
                <nav class="nav__menu">
                    <ul class="nav__list">
                        <li class="nav__item">
                            <a href="home.html" class="nav__link ${isSelected(
															"home.html"
														)}">
                                <span class="material-symbols-outlined">home</span>
                                <span>Inicio</span>
                            </a>
                        </li>
                        
                        <li class="nav__item nav__item--dropdown">
                            <button class="nav__dropdown-btn ${isSelected(
															"listar-sensores.html"
														)}">
                                <span class="material-symbols-outlined">sensors</span>
                                <span>Sensores</span>
                                <span class="material-symbols-outlined nav__arrow">expand_more</span>
                            </button>
                            <div class="nav__dropdown-content">
                                <a href="listar-sensores.html" class="nav__dropdown-link">Lista de Sensores</a>
                                <a href="crear-sensor.html" class="nav__dropdown-link">Agregar Sensor</a>
                            </div>
                        </li>

                        <li class="nav__item nav__item--dropdown">
                            <button class="nav__dropdown-btn ${isSelected(
															"listar-usuarios.html"
														)}">
                                <span class="material-symbols-outlined">group</span>
                                <span>Usuarios</span>
                                <span class="material-symbols-outlined nav__arrow">expand_more</span>
                            </button>
                            <div class="nav__dropdown-content">
                                <a href="listar-usuarios.html" class="nav__dropdown-link">Lista de Usuarios</a>
                                <a href="crear-usuario.html" class="nav__dropdown-link">Registrar Usuario</a>
                            </div>
                        </li>

                        <li class="nav__item nav__item--dropdown">
                            <button class="nav__dropdown-btn ${isSelected(
															"listar-insumos.html"
														)}">
                                <span class="material-symbols-outlined">inventory</span>
                                <span>Insumos</span>
                                <span class="material-symbols-outlined nav__arrow">expand_more</span>
                            </button>
                            <div class="nav__dropdown-content">
                                <a href="listar-insumos.html" class="nav__dropdown-link">Lista de Insumos</a>
                                <a href="crear-insumo.html" class="nav__dropdown-link">Agregar Insumo</a>
                            </div>
                        </li>

                        <li class="nav__item nav__item--dropdown">
                            <button class="nav__dropdown-btn ${isSelected(
															"listar-cultivos.html"
														)}">
                                <span class="material-symbols-outlined">agriculture</span>
                                <span>Cultivos</span>
                                <span class="material-symbols-outlined nav__arrow">expand_more</span>
                            </button>
                            <div class="nav__dropdown-content">
                                <a href="listar-cultivos.html" class="nav__dropdown-link">Lista de Cultivos</a>
                                <a href="listar-ciclos-cultivos.html" class="nav__dropdown-link">Lista de Ciclos</a>
                                <a href="crear-cultivo.html" class="nav__dropdown-link">Agregar Cultivo</a>
                                <a href="crear-ciclo-cultivo.html" class="nav__dropdown-link">Agregar Ciclo</a>
                            </div>
                        </li>

                        <li class="nav__item nav__item--dropdown">
                            <button class="nav__dropdown-btn ${isSelected(
															"listar-producciones.html"
														)}">
                                <span class="material-symbols-outlined">manufacturing</span>
                                <span>Producciones</span>
                                <span class="material-symbols-outlined nav__arrow">expand_more</span>
                            </button>
                            <div class="nav__dropdown-content">
                                <a href="listar-producciones.html" class="nav__dropdown-link">Lista de Producciones</a>
                                <a href="crear-produccion.html" class="nav__dropdown-link">Agregar Producción</a>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>

            <div class="nav__right">
                <div class="nav__user">
                    <img src="../imgs/profile-img.jpg" alt="Usuario" class="nav__user-image" />
                    <div class="nav__user-dropdown">
                        <a href="perfil.html" class="nav__dropdown-link">
                            <span class="material-symbols-outlined">person</span>
                            <span>Perfil</span>
                        </a>
                        <a href="index.html" class="nav__dropdown-link">
                            <span class="material-symbols-outlined">logout</span>
                            <span>Cerrar Sesión</span>
                        </a>
                    </div>
                </div>
                
                <button class="nav__mobile-menu">
                    <span class="material-symbols-outlined">menu</span>
                </button>
            </div>
        </div>

        <div class="nav__mobile-menu-container">
            <div class="nav__overlay"></div>
            <nav class="nav__mobile-nav">
                <div class="nav__mobile-header">
                    <img src="../imgs/logoSena.svg" alt="Logo Sena" class="nav__logo" />
                  </div>
                <a href="home.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">home</span>
                    <span>Inicio</span>
                </a>
                <a href="listar-sensores.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">sensors</span>
                    <span>Lista de Sensores</span>
                </a>
                <a href="crear-sensor.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">add_circle</span>
                    <span>Agregar Sensor</span>
                </a>
                <a href="listar-usuarios.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">group</span>
                    <span>Lista de Usuarios</span>
                </a>
                <a href="crear-usuario.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">person_add</span>
                    <span>Registrar Usuario</span>
                </a>
                <a href="listar-insumos.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">inventory</span>
                    <span>Lista de Insumos</span>
                </a>
                <a href="crear-insumo.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">add_box</span>
                    <span>Agregar Insumo</span>
                </a>
                <a href="listar-cultivos.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">agriculture</span>
                    <span>Lista de Cultivos</span>
                </a>
                <a href="listar-ciclos-cultivos.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">cycle</span>
                    <span>Lista de Ciclos</span>
                </a>
                <a href="crear-cultivo.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">add</span>
                    <span>Agregar Cultivo</span>
                </a>
                <a href="crear-ciclo-cultivo.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">add_circle</span>
                    <span>Agregar Ciclo</span>
                </a>
                <a href="listar-producciones.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">manufacturing</span>
                    <span>Lista de Producciones</span>
                </a>
                <a href="crear-produccion.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">add_circle</span>
                    <span>Agregar Producción</span>
                </a>

                <a href="index.html" class="nav__mobile-link">
                    <span class="material-symbols-outlined">logout</span>
                    <span>Cerrar Sesión</span>
                </a>
            </nav>
        </div>
    `;
}
