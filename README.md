<div align="center">
  <img src="frontend/public/recursos/logoPagina.png" alt="The QuackZone" width="320"/>
  <br><br>
  <p><strong>Tienda online de videojuegos con catálogo, carrito de compras, lista de deseos, reseñas, y más</strong></p>

  ![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?logo=vue.js&logoColor=white)
  ![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?logo=springboot&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
</div>

<br>

The QuackZone es una tienda virtual de videojuegos con una interfaz moderna. Los usuarios pueden navegar el catálogo organizado por categorías, buscar juegos, ver detalles con capturas y reseñas, agregar al carrito, crear una lista de deseos, personalizar su perfil, y recibir notificaciones por correo. El frontend se conecta con un backend en Spring Boot que maneja la lógica de negocio y la autenticación, y con un microservicio Node.js que sirve de puente hacia APIs externas como RAWG, IGDB y CheapShark para obtener información actualizada sobre juegos.

---

## Capturas

### Inicio y catálogo
<div align="center">
  <img src="capturas/home1.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/home2.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/home3.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/buscador.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/modal.png" width="280" style="border-radius:10px; margin:6px" />
</div>

### Detalle del juego y plataformas
<div align="center">
  <img src="capturas/paginaJuego1.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/paginaJuego2.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/ps5.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/ps51.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/pc.png" width="280" style="border-radius:10px; margin:6px" />
</div>

### Carrito de compras
<div align="center">
  <img src="capturas/carritoVacio.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/carritoLleno.png" width="280" style="border-radius:10px; margin:6px" />
</div>

### Autenticación
<div align="center">
  <img src="capturas/login.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/registro.png" width="280" style="border-radius:10px; margin:6px" />
</div>

### Perfil
<div align="center">
  <img src="capturas/perfil.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/editarPerfil.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/elegirAvatar.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/elegirBanner.png" width="280" style="border-radius:10px; margin:6px" />
  <img src="capturas/comprasPerfil.png" width="280" style="border-radius:10px; margin:6px" />
</div>

---

## Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Vue 3, Pinia, Vue Router, Tailwind CSS, Axios |
| **Backend** | Spring Boot 3, Spring Security, JPA / Hibernate, JWT (jjwt), Thymeleaf |
| **Microservicio** | Node.js, Express, Axios, Nodemailer |
| **Base de datos** | MySQL 8 |
| **Contenedores** | Docker, Docker Compose |

---

## Desarrollo local

### Requisitos

- Java 21+
- Node.js 20+
- MySQL 8
- Maven (o `mvnw` incluido)

### Pasos

```bash
# 1. Crear la base de datos
mysql -u root -p -e "CREATE DATABASE quackzone;"

# 2. Ejecutar datos semilla
mysql -u root -p quackzone < scriptBD.sql

# 3. Backend
cd backend
./mvnw spring-boot:run

# 4. Microservicio Node
cd servidor
npm install
npm run dev

# 5. Frontend
cd frontend
npm install
npm run dev
```

---

## Docker

```bash
docker-compose up -d
```

Levanta MySQL (`:3306`), backend (`:8080`) y Node service (`:4000`). El frontend se corre por separado con `npm run dev`.
