const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const cont = document.getElementById('toast'); //PARA LA CREACIÓN DE TOASTS

//CREACIÓN DE TOASTS
/*document.getElementById('nuevo').addEventListener('click', () => {
    crearToast('Inicio de Sesion Exitoso');
});*/

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



const usuariosValidos = [
    { usuario: "criss", contraseña: "1234" ,correo:"crisss@gmail.com",telefono:"123456789", nombres:"Cristian", apellidos:"Huaman"},
    { usuario: "jufer_07", contraseña: "jufer07", correo:"jufer@gmail.com", telefono:"987654321", nombres:"Jufer", apellidos:"Castañeda"},
    { usuario: "admin", contraseña: "admin", correo:"admin1@gmail.com", telefono:"987452521", nombres:"Administrador", apellidos:"unknow" },
];

// Validación de inicio de sesión
document.addEventListener('DOMContentLoaded', function() {
    // Validación de inicio de sesión
    const signInForm = document.querySelector('.sign-in-form');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usuario = this.querySelector('input[type="text"]').value.trim();
            const contraseña = this.querySelector('input[type="password"]').value.trim();
            if (!usuario || !contraseña) {
                alert('Por favor, completa todos los campos para iniciar sesión.');
            } else {
                const usuarioValido = usuariosValidos.find(u => u.usuario === usuario && u.contraseña === contraseña);
                if (usuarioValido) {
                    crearToast(`¡Bienvenido, ${usuario}!`);
                    localStorage.setItem('usuarioLogueado', usuario);
                    setTimeout(() => {
                        const destino = localStorage.getItem('urlDestino');
                        if (destino) {
                            window.location.href = destino;
                            localStorage.removeItem('urlDestino');
                        } else {
                            window.location.href = "/index.html";
                        }
                    }, 1000);
                } else {
                    alert('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
                }
            }
        });
    }

    // Validación de registro
    const signUpForm = document.querySelector('.sign-up-form');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = this.querySelector('input[placeholder="Nombre de usuario"]').value.trim();
            const email = this.querySelector('input[placeholder="Correo electrónico"]').value.trim();
            const password = this.querySelector('input[placeholder="Contraseña"]').value.trim();
            const usuarioValido = usuariosValidos.find(u => u.usuario === username );

            if (!username || !email || !password) {
                alert('Por favor, completa todos los campos para registrarte.');
            } else if (!email.includes('@') || (!email.includes('.'))){
                alert('El correo electrónico debe contener "@" y ".".');
            } else if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
            } else if (usuarioValido) {
                alert('El nombre de usuario no se encuentra disponible. Escoja otro.');
            } else {
                crearToast(`¡Registro exitoso! Bienvenido, ${username}!`);
                localStorage.setItem('usuarioLogueado', username);
                setTimeout(() => {
                    const destino = localStorage.getItem('urlDestino');
                    if (destino) {
                        window.location.href = destino;
                        localStorage.removeItem('urlDestino');
                    } else {
                        window.location.href = "/index.html";
                    }
                }, 1000);
            }
        });
    }
    
});

