export default function Header(title = "SGAL") {
	return `
        <div class="header__logo-container">
				<img src="../imgs/logoSena.svg" alt="Logo SENA" class="logo--sena" />
				<h1 class="header__title">${title}</h1>
				<img src="../imgs/sgal.jpeg" alt="Logo SGAL" class="logo--sgal" />
		</div>
    `;
}
