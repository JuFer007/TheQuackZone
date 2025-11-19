import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const CarritoURL = "http://localhost:8080/carrito";

//Agregar juego al carrito
app.post("/carrito/agregar", async (req, res) => {
  try {
    const { usuarioId, juegoId } = req.body;
    const { data } = await axios.post(`${CarritoURL}/agregar?usuarioId=${usuarioId}&juegoId=${juegoId}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Obtener carrito de un usuario
app.get("/carrito/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { data } = await axios.get(`${CarritoURL}/${usuarioId}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Vaciar carrito
app.delete("/carrito/vaciar/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { data } = await axios.delete(`${CarritoURL}/vaciar/${usuarioId}`);
    res.json(data);
  } catch (error) {
    console.error("Error al vaciar carrito:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor Carrito corriendo en http://localhost:${PORT}`);
});
