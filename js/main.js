import Footer from "../components/footer/footer.js";
import Navbar from "../components/navbar/navbar.js";
import MenuNav from "../components/navbar/menu.js";

const footer = document.querySelector(".footer");
if (footer) {
	footer.innerHTML = Footer();
}

const nav = document.querySelector(".nav");
nav.innerHTML = Navbar();

MenuNav();
