// ============================================
// SCRIPT DE CARRITO - Con funcionalidad de compra
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartLinkDropdown = document.getElementById('cartLinkDropdown');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');

    if (!cartSidebar || !cartOverlay || !closeCart || !cartItems || !cartFooter) {
        console.error("No se encontraron elementos del carrito");
        return;
    }

    window.actualizarCarrito = function() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        console.log("Actualizando carrito. Items:", carrito.length);

        if (carrito.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fa-solid fa-shopping-cart"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos juegos para comenzar.</p>
                </div>
            `;
            cartFooter.style.display = 'none';
            return;
        }

        cartItems.innerHTML = carrito.map(item => `
            <div class="cart-item">
                <img src="${item.imagenUrl}" alt="${item.titulo}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.titulo}</div>
                    <div class="cart-item-price">S/. ${(item.precio * item.cantidad).toFixed(2)}</div>
                    <div class="cart-item-cantidad" style="color: white !important;">x${item.cantidad}</div>
                </div>
            </div>
        `).join('');

        const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        document.getElementById('cartSubtotal').textContent = `S/. ${subtotal.toFixed(2)}`;
        document.getElementById('cartTotal').textContent = `S/. ${subtotal.toFixed(2)}`;

        cartFooter.style.display = 'block';
    };

    // ==========================================
    // FUNCIÓN PARA ABRIR EL CARRITO
    // ==========================================
    window.abrirCarrito = function() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        actualizarCarrito();
    };

    window.cerrarCarrito = function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    window.vaciarCarrito = async function() {
        const confirmar = confirm("¿Estás seguro que deseas vaciar el carrito?");

        if (confirmar) {
            localStorage.removeItem('carrito');

            // Si hay usuario logueado, también vaciar en el backend
            const usuarioId = localStorage.getItem('usuarioId');
            if (usuarioId) {
                try {
                    await axios.delete(`http://localhost:3002/carrito/vaciar/${usuarioId}`);
                    console.log("Carrito vaciado en el backend");
                } catch (error) {
                    console.error("Error al vaciar carrito en backend:", error);
                }
            }

            actualizarCarrito();
        }
    };

    // ==========================================
    // FUNCIÓN PARA PROCEDER AL CHECKOUT
    // ==========================================
    window.procederAlCheckout = async function() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        if (carrito.length === 0) {
            alert("Tu carrito está vacío");
            return;
        }

        // Verificar si el usuario está logueado
        const usuarioId = localStorage.getItem('usuarioId');

        if (!usuarioId) {
            const redirigir = confirm("Debes iniciar sesión para realizar una compra. ¿Ir a la página de inicio de sesión?");
            if (redirigir) {
                window.location.href = "/sesion";
            }
            return;
        }

        const confirmar = confirm(`¿Confirmar compra de ${carrito.length} artículo(s)?`);

        if (!confirmar) return;

        try {
            // Deshabilitar el botón mientras se procesa
            const checkoutBtn = document.querySelector('.checkout-btn');
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';

            // Realizar la compra
            const response = await axios.post("http://localhost:3003/venta/comprar", {
                usuarioId: parseInt(usuarioId)
            });

            console.log("Respuesta de compra:", response.data);

            // Limpiar el carrito en localStorage
            localStorage.removeItem('carrito');

            // Limpiar el carrito en el backend
            try {
                await axios.delete(`http://localhost:3002/carrito/vaciar/${usuarioId}`);
                console.log("Carrito vaciado en el backend");
            } catch (error) {
                console.error("Error al vaciar carrito en backend:", error);
            }

            actualizarCarrito();

            alert("¡Compra realizada con éxito! \nGracias por tu compra.");

            cerrarCarrito();
        } catch (error) {
            console.error("Error al procesar la compra:", error);

            let mensajeError = "Error al procesar la compra. Por favor, intenta de nuevo.";

            if (error.response) {
                mensajeError = error.response.data.error || mensajeError;
            }

            alert(mensajeError);

            // Rehabilitar el botón
            const checkoutBtn = document.querySelector('.checkout-btn');
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = '<i class="fa-solid fa-credit-card"></i> Proceder al Pago';
        }
    };

    closeCart.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarCarrito();
    });

    cartOverlay.addEventListener('click', cerrarCarrito);

    if (cartLinkDropdown) {
        cartLinkDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.classList.remove('active');
            }

            abrirCarrito();
        });
    }

    // ==========================================
    // CARGAR CARRITO AL INICIAR
    // ==========================================
    cargarCarritoInicial();
});

// ==========================================
// FUNCIÓN PARA CARGAR CARRITO INICIAL
// ==========================================
async function cargarCarritoInicial() {
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
        // Si no hay usuario logueado, solo mostrar carrito local
        actualizarCarrito();
        return;
    }

    try {
        console.log("Cargando carrito del usuario:", usuarioId);

        // Obtener carrito del backend
        const response = await axios.get(`http://localhost:3002/carrito/${usuarioId}`);
        const carritoBackend = response.data || [];

        console.log("Carrito del backend:", carritoBackend);

        if (carritoBackend.length > 0) {
            // Obtener carrito local
            const carritoLocal = JSON.parse(localStorage.getItem('carrito')) || [];

            // Crear un Map para facilitar la combinación
            const carritoMap = new Map();

            // Agregar items del backend
            carritoBackend.forEach(item => {
                carritoMap.set(item.id, item);
            });

            // Combinar con items locales (por si agregaron algo sin estar logueados)
            carritoLocal.forEach(itemLocal => {
                if (carritoMap.has(itemLocal.id)) {
                    // Si el item existe, sumar las cantidades
                    const itemExistente = carritoMap.get(itemLocal.id);
                    itemExistente.cantidad = (itemExistente.cantidad || 1) + (itemLocal.cantidad || 1);
                } else {
                    // Si no existe, agregarlo
                    carritoMap.set(itemLocal.id, itemLocal);
                }
            });

            // Convertir el Map de vuelta a array
            const carritoFinal = Array.from(carritoMap.values());

            // Guardar el carrito combinado
            localStorage.setItem('carrito', JSON.stringify(carritoFinal));

            // Sincronizar con el backend si hubo items locales
            if (carritoLocal.length > 0) {
                sincronizarCarritoConBackend(usuarioId, carritoLocal);
            }
        } else {
            // Si el backend no tiene items, sincronizar el carrito local al backend
            const carritoLocal = JSON.parse(localStorage.getItem('carrito')) || [];
            if (carritoLocal.length > 0) {
                sincronizarCarritoConBackend(usuarioId, carritoLocal);
            }
        }

        actualizarCarrito();

    } catch (error) {
        console.error("Error al cargar carrito del backend:", error);
        // Si hay error, usar el carrito local
        actualizarCarrito();
    }
}

// ==========================================
// SINCRONIZAR CARRITO LOCAL CON BACKEND
// ==========================================
async function sincronizarCarritoConBackend(usuarioId, carritoLocal) {
    try {
        for (const item of carritoLocal) {
            await axios.post("http://localhost:3002/carrito/agregar", {
                usuarioId: parseInt(usuarioId),
                juegoId: item.id,
                cantidad: item.cantidad || 1
            });
        }
        console.log("Carrito local sincronizado con el backend");
    } catch (error) {
        console.error("Error al sincronizar carrito:", error);
    }
}

window.agregarAlCarrito = async function(juego) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const existingItem = carrito.find(item => item.id === juego.id);
    if (existingItem) {
        existingItem.cantidad += 1;
    } else {
        juego.cantidad = 1;
        carrito.push(juego);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarCarrito();

    alert("Juego agregado al carrito.");

    // Sincronizar con el backend si el usuario está logueado
    const usuarioId = localStorage.getItem('usuarioId');

    if (usuarioId) {
        try {
            await axios.post("http://localhost:3002/carrito/agregar", {
                usuarioId: parseInt(usuarioId),
                juegoId: juego.id
            });
            console.log("Juego agregado al carrito backend");
        } catch (err) {
            console.error("Error al agregar juego al backend:", err.message);
        }
    }
};
