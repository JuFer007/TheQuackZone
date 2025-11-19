async function cargarJuegosPopulares() {
    const carrusel = document.querySelector('.carrusel');
    carrusel.innerHTML = '<p>Cargando juegos...</p>'; // Mensaje de carga

    try {
        const response = await fetch('http://localhost:3000/juegos/seccion/populares');
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const juegos = await response.json();

        const juegosPopulares = juegos.slice(0, 4);

        carrusel.innerHTML = '';

        juegosPopulares.forEach(juego => {
            const precio = juego.precio ? juego.precio.toFixed(2) : 'N/A';
            const imagenUrl = juego.imagenUrl || 'RECURSOS/placeholder.jpg';
            const nombreJuego = juego.titulo || 'Juego Desconocido';
            const portadaJuego = juego.portadaUrl || imagenUrl;

            const juegoHTML = `
                <div class="cover-container">
                    <img src="${imagenUrl}"
                        class="cover-img" alt="Portada - ${nombreJuego}">
                    <div class="hover-content">
                        <img src="${portadaJuego}" class="cover-img-hover"
                            alt="Portada alternativa - ${nombreJuego}">
                        <div class="overlay">
                            <h4>${nombreJuego}</h4>
                            <div class="precio">S/. ${precio}</div>
                            <button class="buy-btn disabled" onclick="agregarAlCarrito({id: ${juego.id},
                            titulo: '${nombreJuego.replace(/'/g, "\\'")}',
                            precio: ${juego.precio},
                            imagenUrl: '${imagenUrl}'})">
                                <i class="fas fa-shopping-cart"></i> Comprar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            carrusel.insertAdjacentHTML('beforeend', juegoHTML);
        });

    } catch (error) {
        console.error('Hubo un problema al obtener los juegos:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarJuegosPopulares);
