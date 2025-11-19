//============ CARGAR PERFIL DESDE BACKEND ============
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUsuarioId = urlParams.get('usuarioId');

    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    let usuarioId = urlUsuarioId || localStorage.getItem("usuarioId");

    if (!usuarioId && usuarioGuardado && usuarioGuardado.id) {
        usuarioId = usuarioGuardado.id;
        localStorage.setItem("usuarioId", usuarioId);
    }

    if (!usuarioId) {
        console.warn("No se encontró usuario logueado. Redirigiendo...");
        setTimeout(() => {
            window.location.href = "/sesion";
        }, 2000);
        return;
    }


    try {
        //Obtener datos del usuario desde el backend
        const responseUsuario = await fetch(`http://localhost:3001/usuario/${usuarioId}`);
        if (!responseUsuario.ok) {
            throw new Error(`Error al obtener usuario - Status: ${responseUsuario.status}`);
        }

        const usuario = await responseUsuario.json();

        //Obtener datos del perfil desde el backend
        const responsePerfil = await fetch(`http://localhost:3004/perfil/${usuarioId}`);
        if (!responsePerfil.ok) {
            throw new Error(`Error al obtener perfil - Status: ${responsePerfil.status}`);
        }

        const perfil = await responsePerfil.json();

        // ======== ASIGNAR DATOS AL PERFIL ========
        const nombreCompleto = usuario.nombre || usuario.nombreUsuario || "Usuario";
        const primerNombre = nombreCompleto.split(" ")[0];

        document.getElementById("profileName").textContent = nombreCompleto;
        document.getElementById("viewName").textContent = nombreCompleto;
        document.getElementById("editName").value = nombreCompleto;

        const userNameElement = document.querySelector(".user-name");
        if (userNameElement) {
            userNameElement.textContent = nombreCompleto;
        }

        if (usuario.correo) {
            document.getElementById("profileEmail").textContent = usuario.correo;
            document.getElementById("viewEmail").textContent = usuario.correo;
            document.getElementById("editEmail").value = usuario.correo;
        }

        if (usuario.numeroTelefono) {
            document.getElementById("viewPhone").textContent = usuario.numeroTelefono;
            document.getElementById("editPhone").value = usuario.numeroTelefono;
        } else {
            document.getElementById("viewPhone").textContent = "No registrado";
            document.getElementById("editPhone").value = "";
        }

        if (perfil.imagenPerfil) {
            currentAvatar = perfil.imagenPerfil;
            document.getElementById("profileAvatar").src = perfil.imagenPerfil;
            document.getElementById("modalCurrentAvatar").src = perfil.imagenPerfil;

            const headerAvatar = document.getElementById("headerAvatar");
            if (headerAvatar) {
                headerAvatar.src = perfil.imagenPerfil;
            }
        }

        if (perfil.imagenPortada) {
            currentBanner = perfil.imagenPortada;
            document.getElementById("currentBanner").src = perfil.imagenPortada;
        }

        console.log("Perfil cargado completamente");

    } catch (error) {
        console.error("Error cargando perfil:", error);
    }
});

// ============ GUARDAR PERFIL ============
async function saveProfile() {
  const form = document.getElementById('editProfileForm');
  if (!form.reportValidity()) {
    return;
  }

  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    return;
  }

  const name = document.getElementById('editName').value;
  const email = document.getElementById('editEmail').value;
  const phone = document.getElementById('editPhone').value;

  const btnSave = document.querySelector('.btn-save');
  const originalBtnText = btnSave.innerHTML;
  btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
  btnSave.disabled = true;

  try {
    const responseUsuario = await fetch(`http://localhost:3001/usuario/actualizar/${usuarioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: name,
        correo: email,
        numeroTelefono: phone
      })
    });

    if (!responseUsuario.ok) {
      const errData = await responseUsuario.json();
      throw new Error(errData.error || "Error al actualizar usuario");
    }

    const usuarioActualizado = await responseUsuario.json();
    console.log("Usuario actualizado:", usuarioActualizado);

    const responsePerfil = await fetch(`http://localhost:3004/perfil/actualizar/${usuarioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imagenPerfilUrl: currentAvatar,
        imagenPortadaUrl: currentBanner
      })
    });

    if (!responsePerfil.ok) {
      const errPerfil = await responsePerfil.json();
      throw new Error(errPerfil.error || "Error al actualizar perfil");
    }

    const perfilActualizado = await responsePerfil.json();
    console.log("Perfil actualizado:", perfilActualizado);

    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profileAvatar').src = currentAvatar;
    document.getElementById('currentBanner').src = currentBanner;
    document.getElementById('viewName').textContent = name;
    document.getElementById('viewEmail').textContent = email;
    document.getElementById('viewPhone').textContent = phone || "No registrado";

    const headerAvatar = document.getElementById('headerAvatar');
    if (headerAvatar) headerAvatar.src = currentAvatar;

    const userHeaderName = document.querySelector('.user-name');
    if (userHeaderName) userHeaderName.textContent = name.split(' ')[0];

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      usuario.nombre = name;
      usuario.correo = email;
      usuario.numeroTelefono = phone;
      localStorage.setItem("usuario", JSON.stringify(usuario));
    }

    closeEditModal();

  } catch (error) {
    console.error("Error al guardar perfil:", error);
  } finally {
    btnSave.innerHTML = originalBtnText;
    btnSave.disabled = false;
  }
}

// ============ SELECCIONAR AVATAR ============
async function selectAvatarAndClose() {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
        return;
    }

    currentAvatar = tempSelectedAvatar;

    try {
        const response = await fetch(`http://localhost:3004/perfil/actualizar/${usuarioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imagenPerfilUrl: currentAvatar,
                imagenPortadaUrl: currentBanner
            })
        });

        if (!response.ok) throw new Error("Error al actualizar avatar");

        document.getElementById('modalCurrentAvatar').src = currentAvatar;
        document.getElementById('profileAvatar').src = currentAvatar;

        const headerAvatar = document.getElementById('headerAvatar');
        if (headerAvatar) headerAvatar.src = currentAvatar;

        closeAvatarModal();

    } catch (error) {
        console.error("Error al actualizar avatar:", error);
    }
}

// ============ SELECCIONAR BANNER ============
async function selectBannerAndClose() {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
        return;
    }

    currentBanner = tempSelectedBanner;

    try {
        const response = await fetch(`http://localhost:3004/perfil/actualizar/${usuarioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imagenPerfilUrl: currentAvatar,
                imagenPortadaUrl: currentBanner
            })
        });

        if (!response.ok) throw new Error("Error al actualizar portada");

        document.getElementById('currentBanner').src = currentBanner;

        closeBannerModal();
    } catch (error) {
        console.error("Error al actualizar portada:", error);
    }
}