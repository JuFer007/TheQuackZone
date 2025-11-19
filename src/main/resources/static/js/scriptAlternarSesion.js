document.addEventListener("DOMContentLoaded", async () => {
    const usuarioId = localStorage.getItem("usuarioId");

    try {
        const response = await fetch(`http://localhost:3003/venta/historial/${usuarioId}`);
        if (!response.ok) throw new Error("Error al obtener historial");
        const ventas = await response.json();

        const actividadContainer = document.querySelector("#personal-info .info-card");
        const comprasContainer = document.querySelector("#my-orders .info-card");

        // --- Estadísticas ---
        const juegosComprados = ventas.reduce((acc, venta) => acc + venta.videojuegos.length, 0);
        const totalCompras = ventas.reduce((acc, venta) => acc + venta.total, 0);

        document.querySelectorAll(".stat-item")[0].querySelector(".stat-number").textContent = juegosComprados;
        document.querySelectorAll(".stat-item")[1].querySelector(".stat-number").textContent = `S/ ${totalCompras.toFixed(2)}`;

        // --- ACTIVIDAD ---
        if (ventas.length === 0) {
            actividadContainer.innerHTML = `
                <h3><i class="fas fa-chart-line"></i> Actividad Reciente</h3>
                <div class="empty-state">
                    <i class="fas fa-hourglass-half"></i>
                    <h3 class="titleInfo">Sin actividad reciente</h3>
                    <p>Aún no has realizado ninguna compra o interacción.</p>
                </div>
            `;
        } else {
            let actividadHTML = `<h3><i class="fas fa-chart-line"></i> Actividad Reciente</h3>`;
            ventas.forEach(v => {
                const titulos = v.videojuegos.map(j => j.titulo).join(", ");
                actividadHTML += `
                    <div class="info-row">
                        <span class="info-label">${titulos}</span>
                        <span class="info-value">${v.fecha}</span>
                    </div>
                `;
            });
            actividadContainer.innerHTML = actividadHTML;
        }

        // --- COMPRAS ---
        if (ventas.length === 0) {
            comprasContainer.innerHTML = `
                <h3><i class="fas fa-history"></i> Historial de Compras</h3>
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3 class="titleInfo">¡Tu Zona de Juegos te espera!</h3>
                    <p>Aún no has realizado ninguna compra. ¡Explora nuestros títulos ahora!</p>
                </div>
            `;
        } else {
            let comprasHTML = `
                <h3><i class="fas fa-history"></i> Historial de Compras</h3>
                ${ventas.flatMap(v =>
                    v.videojuegos.map(j => `
                        <div class="info-row">
                            <span class="info-label">${j.titulo}</span>
                            <span class="info-value">S/ ${j.precio.toFixed(2)}</span>
                        </div>
                    `)
                ).join("")}
            `;
            comprasContainer.innerHTML = comprasHTML;
        }

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
});
