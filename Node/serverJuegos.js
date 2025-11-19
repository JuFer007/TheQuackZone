import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const JuegosURL = "http://localhost:8080/juegos";

//Listar todos
app.get("/juegos", async (req, res) => {
  try {
    const { data } = await axios.get(JuegosURL);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Listar juegos por seccion
app.get("/juegos/seccion/:seccion", async (req, res) => {
  try {
    const { seccion } = req.params;
    const { data } = await axios.get(`${JuegosURL}/seccion/${seccion}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Obtener por ID
app.get("/juegos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`${JuegosURL}/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Guardar juego
app.post("/juegos/guardar", async (req, res) => {
  try {
    const { data } = await axios.post(`${JuegosURL}/guardar`, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node corriendo en http://localhost:${PORT}`);
});
