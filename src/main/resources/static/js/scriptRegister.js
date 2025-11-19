function handleRegister(event) {
    event.preventDefault();
    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const telefono = document.getElementById("registerTelefono");
    const btn = document.getElementById("registerBtn");
    const errorDiv = document.getElementById("registerError");
    const errorText = document.getElementById("registerErrorText");
    const successDiv = document.getElementById("registerSuccess");
    errorDiv.classList.remove("show");
    successDiv.classList.remove("show");

    btn.disabled = true;
    btn.classList.add("loading");
    btn.innerHTML = '<div class="spinner"></div> Creando cuenta...';

    fetch("http://localhost:3001/usuario/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: nameInput.value,
            correo: emailInput.value,
            contraseña: passwordInput.value,
            numeroTelefono: telefono.value
        })
    })
    .then(async res => {
        const data = await res.json();
        return { status: res.status, body: data };
    })
    .then(({status, body}) => {
        if (status !== 200) throw new Error(body.error || "Error al registrar");
        successDiv.classList.add("show");
        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        telefono.value = "";

        setTimeout(() => {
            switchTab('login');
        }, 1500);
    })
    .catch(err => {
        errorText.textContent = "Error al registrarse, intente nuevamente.";
        console.log(err);
        errorDiv.classList.add("show");
    })
    .finally(() => {
        btn.disabled = false;
        btn.classList.remove("loading");
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Crear Cuenta';
    });
}
