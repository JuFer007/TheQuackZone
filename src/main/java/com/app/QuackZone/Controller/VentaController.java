package com.app.QuackZone.Controller;
import com.app.QuackZone.Model.Venta;
import com.app.QuackZone.Service.VentaService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/venta")
@AllArgsConstructor

public class VentaController {
    private VentaService ventaService;

    @PostMapping("/comprar")
    public ResponseEntity<Venta> comprar(@RequestParam Long usuarioId) {
        Venta venta = ventaService.generarVenta(usuarioId);
        return ResponseEntity.ok(venta);
    }

    @GetMapping("/historial/{usuarioId}")
    public ResponseEntity<List<Venta>> obtenerHistorial(@PathVariable Long usuarioId) {
        List<Venta> historial = ventaService.obtenerHistorialPorUsuario(usuarioId);
        return ResponseEntity.ok(historial);
    }

    @GetMapping("/estadisticas/{usuarioId}")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas(@PathVariable Long usuarioId) {
        Map<String, Object> estadisticas = ventaService.obtenerEstadisticasDeUsuario(usuarioId);
        return ResponseEntity.ok(estadisticas);
    }
}
