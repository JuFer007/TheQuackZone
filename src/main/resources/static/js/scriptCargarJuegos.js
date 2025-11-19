const gamesGrid = document.getElementById("gamesGrid");
const modal = document.getElementById("gameModal");
const closeModal = document.querySelector(".close-modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalReleaseDate = document.getElementById("modalReleaseDate");
const modalDeveloper = document.getElementById("modalDeveloper");
const modalPlatform = document.getElementById("modalPlatform");
const modalRating = document.getElementById("modalRating");
const modalPrice = document.getElementById("modalPrice");

let juegos = [];

//Cargar juegos MAS-VENDIDOS al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/juegos/seccion/mas-vendidos");
    if (!res.ok) throw new Error("Error al obtener los juegos MAS-VENDIDOS");
    juegos = await res.json();
    mostrarJuegos(juegos);
  } catch (err) {
    console.error("Error al cargar los juegos:", err);
  }
});

//Mostrar juegos
function mostrarJuegos(juegosFiltrados) {
  gamesGrid.innerHTML = "";

  if (!juegosFiltrados || juegosFiltrados.length === 0) {
    gamesGrid.innerHTML = `<p class="no-games">No hay juegos disponibles</p>`;
    return;
  }

  juegosFiltrados.forEach(juego => {
    const card = `
      <div class="game-card" data-id="${juego.id}">
        <img src="${juego.imagenUrl}" alt="${juego.titulo}" class="game-card-image">
        <div class="game-card-content">
          <span class="game-card-category">${juego.categoria}</span>
          <h3 class="game-card-title">${juego.titulo}</h3>
          <div class="game-card-price">S/. ${parseFloat(juego.precio).toFixed(2)}</div>
          <div class="game-card-actions">
            <button class="info-btn" onclick="abrirModal(${juego.id})">
              <i class="fas fa-info-circle"></i> Info
            </button>
            <button class="wishlist-btn" onclick="agregarListaDeseos(${juego.id})">
              <i class="fas fa-heart"></i> Lista de deseos
            </button>
          </div>
        </div>
      </div>
    `;
    gamesGrid.insertAdjacentHTML("beforeend", card);
  });
}

//Abrir modal
function abrirModal(id) {
  const juego = juegos.find(j => j.id === id);
  if (!juego) return;

  currentGame = {
    id: juego.id,
    titulo: juego.titulo,
    precio: juego.precio,
    imagenUrl: juego.imagenUrl || juego.portadaUrl || 'RECURSOS/placeholder.jpg'
  };

  modalImage.src = juego.portadaUrl;
  modalTitle.textContent = juego.titulo;
  modalDescription.textContent = juego.descripcion || "Sin descripción disponible";
  modalReleaseDate.textContent = juego.fechaLanzamiento || "Desconocida";
  modalCategoria.textContent = juego.categoria || "Desconocido";
  modalPlatform.textContent = juego.plataforma || "Desconocido";
  modalRating.textContent = juego.numeroEstrellas ? `${juego.numeroEstrellas} ⭐` : "⭐⭐⭐⭐⭐";
  modalPrice.textContent = `S/. ${parseFloat(juego.precio).toFixed(2)}`;

  modal.classList.add("show");
}

//Cerrar modal
closeModal.addEventListener("click", () => modal.classList.remove("show"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("show");
});

//Filtrar por categoría usando botones
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".category-btn.active")?.classList.remove("active");
    btn.classList.add("active");

    const cat = btn.dataset.category;

    if (cat === "todos") {
      mostrarJuegos(juegos);
    } else {
      const filtrados = juegos.filter(j => j.categoria?.toLowerCase() === cat.toLowerCase());
      mostrarJuegos(filtrados);
    }
  });
});
