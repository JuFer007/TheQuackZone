import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const VentaURL = "http://localhost:8080/venta";

//Generar venta (comprar)
app.post("/venta/comprar", async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const { data } = await axios.post(`${VentaURL}/comprar?usuarioId=${usuarioId}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/venta/historial/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { data } = await axios.get(`${VentaURL}/historial/${usuarioId}`);
    res.json(data);
  } catch (error) {
    console.error("Error al obtener historial:", error.message);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

app.get("/venta/estadisticas/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { data } = await axios.get(`${VentaURL}/estadisticas/${usuarioId}`);
    res.json(data);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error.message);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Servidor Ventas corriendo en http://localhost:${PORT}`);
});
