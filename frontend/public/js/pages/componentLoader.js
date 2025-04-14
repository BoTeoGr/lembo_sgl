import Footer from "./footerComponent.js";
import Navbar from "./topNavigationBar.js";
import MenuNav from "./navigationMenu.js";
import Header from "./headerComponent.js";

const footer = document.querySelector(".footer");
if (footer) {
	footer.innerHTML = Footer();
}

const nav = document.querySelector(".nav-render");
if (nav) {
	nav.innerHTML = Navbar();
	MenuNav();
}

const headerRoot = document.querySelector(".header");
if (headerRoot) {
	const title = headerRoot.dataset.title;
	headerRoot.innerHTML = Header(title);
}
