package com.app.QuackZone.Controller;
import com.app.QuackZone.Model.Juego;
import com.app.QuackZone.Service.JuegoService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/juegos")
@CrossOrigin(origins = "*")
@AllArgsConstructor

public class JuegoController {
    private final JuegoService juegoService;

    @GetMapping
    public List<Juego> listarTodos() {
        return juegoService.listarTodos();
    }

    @GetMapping("/seccion/{seccion}")
    public List<Juego> listarPorSeccion(@PathVariable String seccion) {
        return juegoService.listarPorSeccion(seccion);
    }

    @GetMapping("{id}")
    public Juego obtenerPorID(@PathVariable Long id) {
        return juegoService.obtenerPorID(id);
    }

    @PostMapping("/guardar")
    public Juego guardar(@RequestBody Juego juego) {
        return juegoService.guardarJuego(juego);
    }
}
