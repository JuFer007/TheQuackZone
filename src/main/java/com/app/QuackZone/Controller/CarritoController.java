package com.app.QuackZone.Controller;
import com.app.QuackZone.Model.Carrito;
import com.app.QuackZone.Service.CarritoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carrito")
@AllArgsConstructor

public class CarritoController {
    private final CarritoService carritoService;

    @PostMapping("/agregar")
    public ResponseEntity<Carrito> agregarJuego(@RequestParam Long usuarioId, @RequestParam Long juegoId) {
        Carrito carrito = carritoService.agregarAlCarrito(usuarioId, juegoId);
        return ResponseEntity.ok(carrito);
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<Carrito> obtenerCarrito(@PathVariable Long usuarioId) {
        try {
            Carrito carrito = carritoService.obtenerCarritoPorUsuario(usuarioId);
            return ResponseEntity.ok(carrito);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/vaciar/{usuarioId}")
    public ResponseEntity<String> vaciarCarrito(@PathVariable Long usuarioId) {
        carritoService.vaciarCarrito(usuarioId);
        return ResponseEntity.ok("Carrito vaciado correctamente");
    }
}
