package com.app.QuackZone.Controller;

import com.app.QuackZone.Model.Resena;
import com.app.QuackZone.Service.ResenaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/resenas")
public class ResenaController {

    private final ResenaService resenaService;

    public ResenaController(ResenaService resenaService) {
        this.resenaService = resenaService;
    }

    @GetMapping("/juego/{juegoId}")
    public ResponseEntity<List<Resena>> obtenerPorJuego(@PathVariable Long juegoId) {
        return ResponseEntity.ok(resenaService.obtenerPorJuego(juegoId));
    }

    @GetMapping("/juego/{juegoId}/promedio")
    public ResponseEntity<Double> obtenerPromedio(@PathVariable Long juegoId) {
        return ResponseEntity.ok(resenaService.obtenerPromedio(juegoId));
    }

    @PostMapping
    public ResponseEntity<Resena> crear(@RequestBody Resena resena) {
        return ResponseEntity.ok(resenaService.crear(resena));
    }
}
