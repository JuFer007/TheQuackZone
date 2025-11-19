package com.app.QuackZone.Service;
import com.app.QuackZone.Model.Carrito;
import com.app.QuackZone.Model.Usuario;
import com.app.QuackZone.Model.Venta;
import com.app.QuackZone.Repository.CarritoRepository;
import com.app.QuackZone.Repository.UsuarioRepository;
import com.app.QuackZone.Repository.VentaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@AllArgsConstructor

public class VentaService {
    private final VentaRepository ventaRepository;
    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;

    //Generar venta
    public Venta generarVenta(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getCarrito() == null || usuario.getCarrito().isEmpty()) {
            throw new RuntimeException("No hay carritos para este usuario");
        }

        Carrito carrito = usuario.getCarrito().get(usuario.getCarrito().size() - 1);

        if (carrito.getJuegos() == null || carrito.getJuegos().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setVideojuegos(new ArrayList<>(carrito.getJuegos()));
        venta.setFecha(LocalDate.now());

        double total = carrito.getJuegos().stream().mapToDouble(j -> j.getPrecio() != null ? j.getPrecio() : 0.0).sum();
        venta.setTotal(total);

        Venta ventaGuardada = ventaRepository.save(venta);

        carrito.getJuegos().clear();
        carrito.setTotal(0.0);
        carritoRepository.save(carrito);

        return ventaGuardada;
    }

    //Generar venta para un carrito
    public Venta generarVentaPorCarrito(Long carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        if (carrito.getJuegos() == null || carrito.getJuegos().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        Venta venta = new Venta();
        venta.setUsuario(carrito.getUsuario());
        venta.setVideojuegos(new ArrayList<>(carrito.getJuegos()));
        venta.setFecha(LocalDate.now());

        double total = carrito.getJuegos().stream().mapToDouble(j -> j.getPrecio() != null ? j.getPrecio() : 0.0).sum();
        venta.setTotal(total);

        Venta ventaGuardada = ventaRepository.save(venta);

        carrito.getJuegos().clear();
        carrito.setTotal(0.0);
        carritoRepository.save(carrito);

        return ventaGuardada;
    }

    //Obtener historial de un usuario
    public List<Venta> obtenerHistorialPorUsuario(Long idUsuario) {
        return ventaRepository.findByUsuarioId(idUsuario);
    }

    //Calcular estadisticas mejoradas
    public Map<String, Object> obtenerEstadisticasDeUsuario(Long idUsuario) {
        List<Venta> ventas = ventaRepository.findByUsuarioId(idUsuario);
        Map<String, Object> estadisticas = new HashMap<>();

        if (ventas.isEmpty()) {
            estadisticas.put("totalGastado", 0.0);
            estadisticas.put("totalCompras", 0);
            estadisticas.put("juegosComprados", 0);
            estadisticas.put("ultimaCompra", null);
            estadisticas.put("promedioCompra", 0.0);
            return estadisticas;
        }

        double totalGastado = ventas.stream()
                .mapToDouble(Venta::getTotal)
                .sum();

        int totalCompras = ventas.size();

        int juegosComprados = ventas.stream().mapToInt(v -> v.getVideojuegos() != null ? v.getVideojuegos().size() : 0).sum();

        ventas.sort(Comparator.comparing(Venta::getFecha).reversed());
        LocalDate ultimaFecha = ventas.get(0).getFecha();

        // Formato de fecha más legible
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String ultimaCompra = ultimaFecha.format(formatter);

        double promedioCompra = totalGastado / totalCompras;

        estadisticas.put("totalGastado", Math.round(totalGastado * 100.0) / 100.0);
        estadisticas.put("totalCompras", totalCompras);
        estadisticas.put("juegosComprados", juegosComprados);
        estadisticas.put("ultimaCompra", ultimaCompra);
        estadisticas.put("promedioCompra", Math.round(promedioCompra * 100.0) / 100.0);

        return estadisticas;
    }
}
