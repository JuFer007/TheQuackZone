import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PerfilURL = "http://localhost:8080/perfil";

//Obtener perfil de usuario
app.get("/perfil/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { data } = await axios.get(`${PerfilURL}/${usuarioId}`);
    res.json(data);
  } catch (error) {
    console.error("Error al obtener perfil:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.message || "Error al obtener perfil del usuario",
    });
  }
});

//Actualizar imágenes
app.put("/perfil/actualizar/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { imagenPerfilUrl, imagenPortadaUrl } = req.body;

    const { data } = await axios.put(
      `${PerfilURL}/actualizar/${usuarioId}`,
      null,
      {
        params: {
          imagenPerfilUrl,
          imagenPortadaUrl,
        },
      }
    );

    res.json(data);
  } catch (error) {
    console.error("Error al actualizar imágenes:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.message || "Error al actualizar imágenes del perfil",
    });
  }
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Servidor Perfil corriendo en http://localhost:${PORT}`);
});
