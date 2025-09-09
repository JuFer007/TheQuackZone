// ==================== INICIALIZAR AL CARGAR ====================
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        actualizarContadorCarrito();
        if (document.querySelector(".cart-box")) {
            mostrarCarrito();
        }
        renderStars(calificacion);
    }, 50);
});

// ==================== CALIFICACIÓN DE ESTRELLAS ====================
let calificacion = 0;

function renderStars(rating) {
    const maxStars = 5;
    let html = "";
    for (let i = 1; i <= maxStars; i++) {
        html += `<span 
            style="color:${i <= rating ? 'gold' : 'gray'}; font-size:28px; cursor:pointer;" 
            onclick="setRating(${i})">&#9733;</span>`;
    }
    const starElem = document.getElementById("star-rating");
    if (starElem) {
        starElem.innerHTML = html;
    }
}

function setRating(valor) {
    calificacion = valor;
    renderStars(calificacion);
}

// ==================== MENSAJE CARRITO VACÍO ====================
function mostrarMensajeCarritoVacio(carrito) {
    const vacio = document.getElementById("carritoVacio");
    const mainContainer = document.querySelector(".main-container");
    if (!vacio || !mainContainer) return;

    if (carrito.length === 0) {
        vacio.style.display = "flex";
        mainContainer.style.display = "none";
    } else {
        vacio.style.display = "none";
        mainContainer.style.display = "flex";
    }
}

// ==================== ACTUALIZAR CONTADOR CARRITO ====================
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contador-carrito");
    if (contador) contador.textContent = carrito.length;
}

// ==================== MOSTRAR PRODUCTOS DEL CARRITO ====================
function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const itemsContenedor = document.querySelector(".cart-items");
    if (!itemsContenedor) return;

    itemsContenedor.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.innerHTML = 'Mis compras <i class="fa-solid fa-cart-shopping"> :</i>';
    itemsContenedor.appendChild(titulo);

    mostrarMensajeCarritoVacio(carrito);

    if (carrito.length === 0) {
        calcularTotal();
        return;
    }

    //Mostrar productos en el carrito
    carrito.forEach((juego, index) => {
        const item = document.createElement("div");
        item.classList.add("cart-item");
        item.innerHTML = `
            <img src="${juego.imagen}" alt="${juego.nombre}" width="80" class="imagen-juego">
            <div class="product-info">
                <span class="product-title">${juego.nombre}</span>
                <span class="product-description">${juego.descripcion}</span>
                <span class="product-price">Precio: S/. ${juego.precio.toFixed(2)}</span>
                <span class="product-cantidad">Cantidad: ${juego.cantidad}</span>
                <span class="product-plataforma">Plataforma: ${juego.plataforma}</span>
                <span class="product-categoria">Categoria: ${juego.categoria}</span>
                <span class="product-subtotal">Sub Total: S/. ${(juego.cantidad * juego.precio).toFixed(2)}</span>
            </div>
            <div class="cart-icons">
                <span class="icon-trash" onclick="eliminarDelCarrito(${index})"><i class="fa-solid fa-trash"></i></span>
            </div>
        `;
        itemsContenedor.appendChild(item);
    });
    calcularTotal();
    actualizarContadorCarrito();
}

// ==================== AGREGAR AL CARRITO ====================
function addToCart(nombre, descripcion, precio, imagen, plataforma, categoria) {
    const cont = document.getElementById('toast'); //PARA LA CREACIÓN DE TOASTS
    
    function crearToast(msg) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<span>${msg}</span>  <button type = "button">x</button>`;
        cont.appendChild(t);
        t.querySelector('button').onclick = () => cerrar(t);
        setTimeout(() => cerrar(t), 2000);
    }
    function cerrar(el) {
        el.classList.add('hide');
        el.addEventListener('animationend', () => el.remove());
    }


    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carrito.findIndex(j => j.nombre === nombre);
    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        const nuevoJuego = {
            nombre: nombre,
            descripcion: descripcion,
            precio: parseFloat(precio),
            imagen: imagen,
            cantidad: 1,
            plataforma: plataforma,
            categoria: categoria
        };
        carrito.push(nuevoJuego);
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarModalCarrito();
    actualizarContadorCarrito();
    crearToast(`¡Juego agregado al carrito!`);
    mostrarCarrito();
}

// ==================== ELIMINAR PRODUCTO ====================
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1;
    } else {
        carrito.splice(index, 1);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
}

// ==================== CALCULAR TOTAL ====================
function calcularTotal() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((sum, juego) => sum + (juego.precio * juego.cantidad), 0);
    const totalElem = document.querySelector(".total-price");
    if (totalElem) totalElem.textContent = total.toFixed(2);
}

// ==================== MODAL FUNCIONES ====================
//Funcion para mostrar el modal
function mostrarModalCarrito() {
    const modal = document.getElementById('modal-carrito');
    if (modal) {
        modal.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }
}

//Funcion para cerrar el modal
function cerrarModalCarrito() {
    const modal = document.getElementById('modal-carrito');
    if (modal) {
        modal.classList.remove('activo');
        document.body.style.overflow = '';
    }
}

// ==================== FUNCIONES DE LOS BOTONES DEL MODAL DE CARRITO ========================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-continuar').addEventListener('click', cerrarModalCarrito);
    document.getElementById('btn-ver-carrito').addEventListener('click', function() {
        window.location.href="/html/Carrito.html";
        cerrarModalCarrito();
    });
});

// ==================== FUNCIONES DE FINALIZAR COMPRA ====================
document.querySelector('.yellow-btn').addEventListener('click', function () {
    const usuario = localStorage.getItem('usuarioLogueado');
    const cont = document.getElementById('toast'); //PARA LA CREACIÓN DE TOASTS
    
    function crearToast(msg) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<span>${msg}</span>  <button type = "button">x</button>`;
        cont.appendChild(t);
        t.querySelector('button').onclick = () => cerrar(t);
        setTimeout(() => cerrar(t), 4000);
    }
    function cerrar(el) {
        el.classList.add('hide');
        el.addEventListener('animationend', () => el.remove());
    }

    if (!usuario) {
        alert('Debes iniciar sesión para finalizar tu compra.');
        //window.location.href = '/html/Formulario.html';
        return;
    }
    // Verifica si el evento está siendo activado

    const confirmacion = confirm('¿Estás seguro de que deseas finalizar tu compra?');

    if (confirmacion) {
        
        const cartItems = document.querySelector('.cart-items');
        cartItems.innerHTML = '<h2>Mis compras <i class="fa-solid fa-cart-shopping"></i> :</h2><p></p>';
        const summaryDetails = document.querySelector('.summary-details');
        summaryDetails.innerHTML = '';
        document.querySelector('.total-price').textContent = '0.00';
        localStorage.setItem('carrito', JSON.stringify([]));
        crearToast(`¡Operacion Exitosa! Gracias por su compra.`);
        mostrarCarrito();
        calcularTotal();
    } else {
        console.log('La compra no fue realizada');
        alert('La compra no ha sido realizada.');
    }
});

// ==================== FUNCIONES DE LOS TABS DE INFO ====================
const tabs = document.getElementById('tabs');
const btns = [...tabs.querySelectorAll('button')];
const panes = [...tabs.querySelectorAll('.contenido > div')];
const ind = tabs.querySelector('.indicador');

btns.forEach((b,i)=> b.addEventListener('click',()=>{
        btns.forEach(x=>x.classList.remove('activo'));
        panes.forEach(x=>x.classList.remove('activo'));
        b.classList.add('activo');
        panes[i].classList.add('activo');
        ind.style.left = (i * 100/btns.length) + '%';
    })
);

// ==================== FUNCION PARA EL CARRUSEL DEL CARRITO ====================
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const items = document.querySelectorAll(".carousel-item");

    if (!track || items.length === 0) return;

    let currentIndex = 0;
    const itemWidth = items[0].offsetWidth + 20;
    const totalItems = items.length;

    function moveCarousel() {
        if (currentIndex >= totalItems - 8) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }

        const translateX = -currentIndex * itemWidth;
        track.style.transform = `translateX(${translateX}px)`;
    }
    setInterval(moveCarousel, 2500);
});
