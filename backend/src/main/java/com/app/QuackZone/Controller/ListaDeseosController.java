package com.app.QuackZone.Controller;

import com.app.QuackZone.Model.ListaDeseos;
import com.app.QuackZone.Service.ListaDeseosService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/listaDeseos")
public class ListaDeseosController {

    private final ListaDeseosService listaDeseosService;

    public ListaDeseosController(ListaDeseosService listaDeseosService) {
        this.listaDeseosService = listaDeseosService;
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<ListaDeseos> obtenerLista(@PathVariable Long usuarioId) {
        ListaDeseos lista = listaDeseosService.obtenerLista(usuarioId);
        return ResponseEntity.ok(lista);
    }

    @PostMapping("/agregar/{usuarioId}/{juegoId}")
    public ResponseEntity<ListaDeseos> agregarJuego(@PathVariable Long usuarioId, @PathVariable Long juegoId) {
        ListaDeseos lista = listaDeseosService.agregarJuego(usuarioId, juegoId);
        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/quitar/{usuarioId}/{juegoId}")
    public ResponseEntity<ListaDeseos> quitarJuego(@PathVariable Long usuarioId, @PathVariable Long juegoId) {
        ListaDeseos lista = listaDeseosService.quitarJuego(usuarioId, juegoId);
        return ResponseEntity.ok(lista);
    }

    @PostMapping("/verificar-ofertas/{usuarioId}")
    public ResponseEntity<Map<String, Object>> verificarOfertas(@PathVariable Long usuarioId) {
        Map<String, Object> resultado = listaDeseosService.verificarOfertas(usuarioId);
        return ResponseEntity.ok(resultado);
    }
}
