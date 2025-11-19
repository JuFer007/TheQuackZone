document.addEventListener("DOMContentLoaded", async () => {
  const userSection = document.getElementById("user-section");
  const authButtons = document.getElementById("auth-buttons");
  const userNameSpan = document.querySelector(".user-name");
  const userProfile = document.querySelector(".user-profile");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const logoutLink = document.getElementById("logout-link");
  const profileLink = document.getElementById("profileLink");

  if (!userProfile) {
    console.log("No hay dropdown en esta página");
    return;
  }

  const userImg = userProfile.querySelector("img");

  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
  let usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId && usuarioGuardado && usuarioGuardado.id) {
    usuarioId = usuarioGuardado.id;
    localStorage.setItem("usuarioId", usuarioId);
  }

  if (!usuarioGuardado || !usuarioId) {
    userSection.classList.add("hidden");
    authButtons.style.display = "block";
    return;
  }

  userNameSpan.textContent = usuarioGuardado.nombre || usuarioGuardado.nombreUsuario || "Usuario";
  userSection.classList.remove("hidden");
  authButtons.style.display = "none";

  console.log("ID de usuario para cargar perfil:", usuarioId);

  try {
    const response = await fetch(`http://localhost:3004/perfil/${usuarioId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener perfil - Status: ${response.status}`);
    }

    const perfil = await response.json();
    console.log("Perfil cargado:", perfil);

    if (perfil && perfil.imagenPerfil) {
      userImg.src = perfil.imagenPerfil;
    } else {
      console.log("No se encontró imagen de perfil en la respuesta, se usará la imagen por defecto.");
    }

  } catch (error) {
    console.error("No se pudo cargar la imagen de perfil:", error.message);
  }

  //Evento para ir al perfil
  if (profileLink) {
    profileLink.addEventListener("click", (e) => {
      e.preventDefault();
      const id = localStorage.getItem("usuarioId");
      console.log("🔗 Redirigiendo al perfil con ID:", id);

      if (id) {
        window.location.href = `/perfil?usuarioId=${id}`;
      } else {
        console.error("No se encontró usuarioId");
        alert("Error: No se encontró el ID del usuario");
        window.location.href = "/sesion";
      }
    });
  } else {
    console.warn("No se encontró el enlace de perfil (profileLink)");
  }

  //Dropdown
  if (userProfile && dropdownMenu) {
    userProfile.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!userProfile.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove("active");
      }
    });

    dropdownMenu.addEventListener("click", (e) => e.stopPropagation());
  } else {
    console.error("No se encontraron elementos del dropdown");
  }

  //Logout
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      const confirmar = confirm("¿Estás seguro que deseas cerrar sesión?");

      if (confirmar) {
        localStorage.removeItem("usuario");
        localStorage.removeItem("usuarioId");
        window.location.href = "/";
      }
    });
  }
});
