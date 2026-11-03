const hamburger = document.getElementById("hamburger");
const navBarContainer = document.querySelector(".nav-bar-container");

hamburger.addEventListener("click", () => {
  navBarContainer.classList.toggle("active");
});
