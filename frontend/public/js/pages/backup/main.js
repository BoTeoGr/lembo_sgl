import Footer from "../pages/footer.js";
import Navbar from "../pages/navbar.js";
import MenuNav from "../pages/menu.js";
import Header from "../pages/header.js";

const footer = document.querySelector(".footer");
if (footer) {
	footer.innerHTML = Footer();
}

const nav = document.querySelector(".nav");
if (nav) {
	nav.innerHTML = Navbar();
	MenuNav();
}

const headerRoot = document.querySelector(".header");
if (headerRoot) {
	const title = headerRoot.dataset.title;
	headerRoot.innerHTML = Header(title);
}
