import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const UsuarioURL = "http://localhost:8080/usuario";

//Registrar usuario
app.post("/usuario/registrar", async (req, res) => {
  try {
    const { data } = await axios.post(`${UsuarioURL}/registrar`, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Iniciar sesion
app.post("/usuario/login", async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const { data } = await axios.post(
      `${UsuarioURL}/login`,
      { correo, contraseña },
      { headers: { "Content-Type": "application/json" } }
    );

    res.json(data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.message || error.message });
  }
});

//Obtener usuario por ID
app.get("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`${UsuarioURL}/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Actualizar datos del usuario
app.post("/usuario/actualizar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.post(`${UsuarioURL}/actualizar/${id}`, req.body, {
      headers: { "Content-Type": "application/json" },
    });
    res.json(data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.message || error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor Usuarios corriendo en http://localhost:${PORT}`);
});
