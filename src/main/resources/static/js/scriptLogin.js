function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.querySelector("#loginForm input[type='email']");
    const passwordInput = document.getElementById("loginPassword");
    const btn = document.getElementById("loginBtn");
    const errorDiv = document.getElementById("loginError");
    const errorText = document.getElementById("loginErrorText");
    const successDiv = document.getElementById("loginSuccess");

    errorDiv.classList.remove("show");
    if (successDiv) successDiv.classList.remove("show");

    btn.classList.add("loading");
    btn.innerHTML = '<div class="spinner"></div> Iniciando sesión...';

    fetch("http://localhost:3001/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            correo: emailInput.value,
            contraseña: passwordInput.value
        })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
        if (status !== 200) throw new Error(body.error || "Error en el login");

        const usuario = body;

        if (!usuario.id) {
            throw new Error("Respuesta del servidor sin ID de usuario");
        }

        if (successDiv) {
            successDiv.textContent = "Inicio de sesión exitoso. Redirigiendo...";
            successDiv.classList.add("show");
        }

        localStorage.setItem("usuario", JSON.stringify(usuario));
        localStorage.setItem("usuarioId", usuario.id);

        console.log("Usuario guardado:", usuario);
        console.log("ID guardado:", usuario.id);

        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    })
    .catch(err => {
        errorText.textContent = "Usuario o contraseña incorrectos. Intente nuevamente";
        errorDiv.classList.add("show");
        console.error("Error en login:", err);
    })
    .finally(() => {
        btn.classList.remove("loading");
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
    });
}
