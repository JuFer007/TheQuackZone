document.addEventListener("DOMContentLoaded", async () => {
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
        console.warn("No hay usuarioId en localStorage.");
        mostrarEstadoVacio();
        return;
    }

    try {
        // Cargar estadísticas y historial en paralelo
        const [estadisticas, historial] = await Promise.all([
            cargarEstadisticas(usuarioId),
            cargarHistorial(usuarioId)
        ]);

        actualizarEstadisticas(estadisticas);
        actualizarActividad(historial);
        actualizarHistorialCompras(historial);

    } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
        mostrarError();
    }
});

// Función para cargar estadísticas del usuario
async function cargarEstadisticas(usuarioId) {
    try {
        const response = await fetch(`http://localhost:3003/venta/estadisticas/${usuarioId}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Estadísticas recibidas:", data);
        return data;
    } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        return {
            totalGastado: 0,
            totalCompras: 0,
            juegosComprados: 0,
            ultimaCompra: null,
            promedioCompra: 0
        };
    }
}

// Función para cargar historial de compras
async function cargarHistorial(usuarioId) {
    try {
        const response = await fetch(`http://localhost:3003/venta/historial/${usuarioId}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Historial recibido:", data);

        if (!Array.isArray(data)) {
            console.error("El historial no es un array:", data);
            return [];
        }

        return data;
    } catch (error) {
        console.error("Error al cargar historial:", error);
        return [];
    }
}

// Actualizar las estadísticas en los badges del perfil
function actualizarEstadisticas(stats) {
    const statItems = document.querySelectorAll(".stat-item");

    if (statItems.length >= 2) {
        // Juegos comprados
        statItems[0].querySelector(".stat-number").textContent = stats.juegosComprados || 0;

        // Total gastado
        const totalGastado = stats.totalGastado || 0;
        statItems[1].querySelector(".stat-number").textContent = `S/. ${totalGastado.toFixed(2)}`;
        statItems[1].querySelector(".stat-label").innerHTML = "Total<br>Gastado";
    }
}

// Actualizar la sección de actividad reciente
function actualizarActividad(ventas) {
    const actividadContainer = document.querySelector("#personal-info .info-card");

    if (!ventas || ventas.length === 0) {
        actividadContainer.innerHTML = `
            <h3><i class="fas fa-chart-line"></i> Actividad Reciente</h3>
            <div class="empty-state">
                <i class="fas fa-hourglass-half"></i>
                <h3 class="titleInfo">Sin actividad reciente</h3>
                <p>Aún no has realizado ninguna compra o interacción.</p>
            </div>
        `;
        return;
    }

    // Tomar las últimas 5 compras
    const ultimasCompras = ventas.slice(0, 5);

    let actividadHTML = `<h3><i class="fas fa-chart-line"></i> Actividad Reciente</h3>`;

    ultimasCompras.forEach(venta => {
        // Manejar tanto 'videojuegos' como 'juegos'
        const juegos = venta.videojuegos || venta.juegos || [];
        const fecha = venta.fecha || "Fecha desconocida";
        const total = venta.total || 0;

        if (Array.isArray(juegos) && juegos.length > 0) {
            const titulosJuegos = juegos.map(j => j.titulo || "Juego sin título").join(", ");

            actividadHTML += `
                <div class="info-row">
                    <div style="flex: 1;">
                        <span class="info-label" style="color: white !important;">${titulosJuegos}</span>
                        <small style="display: block; color: #888; font-size: 0.9em;">
                            ${juegos.length} ${juegos.length === 1 ? 'juego' : 'juegos'}
                        </small>
                    </div>
                    <div style="text-align: right;">
                        <span class="info-value" style="display: block;">S/. ${total.toFixed(2)}</span>
                        <small style="color: #888; font-size: 0.85em;">${formatearFecha(fecha)}</small>
                    </div>
                </div>
            `;
        }
    });

    actividadContainer.innerHTML = actividadHTML;
}

// Actualizar el historial completo de compras
function actualizarHistorialCompras(ventas) {
    const comprasContainer = document.querySelector("#my-orders .info-card");

    if (!ventas || ventas.length === 0) {
        comprasContainer.innerHTML = `
            <h3><i class="fas fa-history"></i> Historial de Compras</h3>
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3 class="titleInfo">¡Tu Zona de Juegos te espera!</h3>
                <p>Aún no has realizado ninguna compra. ¡Explora nuestros títulos ahora!</p>
            </div>
        `;
        return;
    }

    let comprasHTML = `<h3><i class="fas fa-history"></i> Historial de Compras</h3>`;

    // Agrupar por venta
    ventas.forEach(venta => {
        const juegos = venta.videojuegos || venta.juegos || [];
        const fecha = venta.fecha || "Fecha desconocida";
        const total = venta.total || 0;

        if (Array.isArray(juegos) && juegos.length > 0) {
            comprasHTML += `
                <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid gray;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <strong style="color: white;">Compra del ${formatearFecha(fecha)}</strong>
                        <strong style="color: #ff6300;">Total: S/. ${total.toFixed(2)}</strong>
                    </div>
            `;

            juegos.forEach(juego => {
                const titulo = juego.titulo || "Juego sin título";
                const precio = juego.precio || 0;

                comprasHTML += `
                    <div class="info-row" style="margin-left: 15px;">
                        <span class="info-label">${titulo}</span>
                        <span class="info-value">S/. ${precio.toFixed(2)}</span>
                    </div>
                `;
            });

            comprasHTML += `</div>`;
        }
    });

    comprasContainer.innerHTML = comprasHTML;
}

// Formatear fecha de manera legible
function formatearFecha(fecha) {
    if (!fecha) return "Fecha desconocida";

    try {
        // Si la fecha ya viene formateada como dd/MM/yyyy
        if (typeof fecha === 'string' && fecha.includes('/')) {
            return fecha;
        }

        // Si viene como array [año, mes, día] desde Java
        if (Array.isArray(fecha) && fecha.length === 3) {
            const [year, month, day] = fecha;
            return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
        }

        // Si es un string ISO o similar
        const fechaObj = new Date(fecha);
        if (!isNaN(fechaObj.getTime())) {
            return fechaObj.toLocaleDateString('es-PE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        return fecha.toString();
    } catch (error) {
        console.error("Error al formatear fecha:", error);
        return fecha.toString();
    }
}

// Mostrar estado vacío si no hay usuario
function mostrarEstadoVacio() {
    const statItems = document.querySelectorAll(".stat-item");
    statItems.forEach(item => {
        item.querySelector(".stat-number").textContent = "0";
    });

    actualizarActividad([]);
    actualizarHistorialCompras([]);
}

// Mostrar error en caso de fallo
function mostrarError() {
    const actividadContainer = document.querySelector("#personal-info .info-card");
    const comprasContainer = document.querySelector("#my-orders .info-card");

    const errorHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i>
            <h3>Error al cargar datos</h3>
            <p>Hubo un problema al cargar tu información. Por favor, intenta recargar la página.</p>
            <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #e91e63; color: white; border: none; border-radius: 5px; cursor: pointer;">
                <i class="fas fa-sync-alt"></i> Recargar
            </button>
        </div>
    `;

    if (actividadContainer) {
        actividadContainer.innerHTML = `<h3><i class="fas fa-chart-line"></i> Actividad Reciente</h3>` + errorHTML;
    }

    if (comprasContainer) {
        comprasContainer.innerHTML = `<h3><i class="fas fa-history"></i> Historial de Compras</h3>` + errorHTML;
    }
}
