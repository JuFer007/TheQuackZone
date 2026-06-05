package com.app.QuackZone.Controller;
import com.app.QuackZone.Model.Juego;
import com.app.QuackZone.Service.JuegoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/juegos")

public class JuegoController {
    private final JuegoService juegoService;

    public JuegoController(JuegoService juegoService) {
        this.juegoService = juegoService;
    }

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

    @GetMapping("/categoria/{categoria}")
    public List<Juego> listarPorCategoria(@PathVariable String categoria) {
        return juegoService.listarPorCategoria(categoria);
    }

    @GetMapping("/buscar")
    public List<Juego> buscar(@RequestParam String q) {
        return juegoService.buscarPorTitulo(q);
    }

    @PostMapping("/guardar")
    public Juego guardar(@RequestBody Juego juego) {
        return juegoService.guardarJuego(juego);
    }

    @GetMapping("/rawg-exists/{rawgId}")
    public java.util.Map<String, Object> existsByRawgId(@PathVariable Long rawgId) {
        var juego = juegoService.obtenerPorRawgId(rawgId);
        return java.util.Map.of("exists", juego.isPresent(), "juego", juego.orElse(null));
    }

    @PostMapping("/rawg-exists/batch")
    public java.util.Map<Long, Boolean> existsByRawgIds(@RequestBody java.util.List<Long> rawgIds) {
        var encontrados = juegoService.obtenerPorRawgIds(rawgIds);
        var set = encontrados.stream().map(Juego::getRawgId).collect(java.util.stream.Collectors.toSet());
        java.util.Map<Long, Boolean> result = new java.util.HashMap<>();
        for (Long id : rawgIds) {
            result.put(id, set.contains(id));
        }
        return result;
    }
}
