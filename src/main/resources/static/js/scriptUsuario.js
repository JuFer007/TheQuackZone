function verificarUsuarioLogueado() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        const authButtons = document.getElementById("auth-buttons");
        const userSection = document.getElementById("user-section");
        if (authButtons && userSection) {
            authButtons.classList.add("hidden");
            userSection.classList.remove("hidden");
            userSection.querySelector(".user-name").textContent = usuario.nombre;
        }
    }
}

function initLogoutListener() {
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            window.location.reload();
        });
    }
}
