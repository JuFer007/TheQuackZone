import { spawn } from "child_process";

const servicios = [
  { nombre: "Juegos", archivo: "serverJuegos.js" },       //puerto 3000
  { nombre: "Usuarios", archivo: "serverUsuario.js" },   //puerto 3001
  { nombre: "Carrito", archivo: "serverCarrito.js" },     //puerto 3002
  { nombre: "Ventas", archivo: "serverVentas.js" },       //puerto 3003
  { nombre: "Perfil", archivo: "serverPerfil.js" },       //puerto 3004
];

servicios.forEach(({ nombre, archivo }) => {
  const proceso = spawn("node", [archivo], { stdio: "inherit" });

  proceso.on("error", (err) => {
    console.error(`Error al iniciar ${nombre}:`, err);
  });

  proceso.on("exit", (code) => {
    console.log(`${nombre} finalizó con código ${code}`);
  });
});
