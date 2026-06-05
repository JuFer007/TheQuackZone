package com.app.QuackZone.Service;
import com.app.QuackZone.Model.Carrito;
import com.app.QuackZone.Model.Juego;
import com.app.QuackZone.Model.Usuario;
import com.app.QuackZone.Repository.CarritoRepository;
import com.app.QuackZone.Repository.JuegoRepository;
import com.app.QuackZone.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service

public class CarritoService {
    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final JuegoRepository juegoRepository;

    public CarritoService(CarritoRepository carritoRepository, UsuarioRepository usuarioRepository, JuegoRepository juegoRepository) {
        this.carritoRepository = carritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.juegoRepository = juegoRepository;
    }

    //Agregar al carrito
    public Carrito agregarAlCarrito(Long usuarioId, Long juegoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Juego juego = juegoRepository.findById(juegoId)
            .orElseGet(() -> juegoRepository.findByRawgId(juegoId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado")));

        Carrito carrito;
        if (usuario.getCarrito() == null || usuario.getCarrito().isEmpty()) {
            carrito = new Carrito();
            carrito.setUsuario(usuario);
            carrito.setJuegos(new ArrayList<>());
            carrito.setTotal(0.0);
            usuario.setCarrito(new ArrayList<>());
            usuario.getCarrito().add(carrito);
        } else {
            carrito = usuario.getCarrito().get(usuario.getCarrito().size() - 1);
        }

        if (!carrito.getJuegos().contains(juego)) {
            carrito.getJuegos().add(juego);
        }

        double total = carrito.getJuegos().stream().mapToDouble(Juego::getPrecio).sum();
        carrito.setTotal(total);

        return carritoRepository.save(carrito);
    }

    //Crear carrito
    public Carrito crearNuevoCarrito(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Carrito carrito = new Carrito();
        carrito.setUsuario(usuario);
        carrito.setJuegos(new ArrayList<>());
        carrito.setTotal(0.0);

        if (usuario.getCarrito() == null) {
            usuario.setCarrito(new ArrayList<>());
        }

        usuario.getCarrito().add(carrito);
        usuarioRepository.save(usuario);

        return carritoRepository.save(carrito);
    }

    public Carrito obtenerCarritoPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Carrito carrito = carritoRepository.findTopByUsuarioIdOrderByIdDesc(usuarioId);

        if (carrito == null) {
            carrito = new Carrito();
            carrito.setUsuario(usuario);
            carrito.setJuegos(new ArrayList<>());
            carrito.setTotal(0.0);
            carritoRepository.save(carrito);
        }
        return carrito;
    }

    public void vaciarCarrito(Long usuarioId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId);
        if (carrito != null) {
            carrito.getJuegos().clear();
            carritoRepository.save(carrito);
        }
    }
}
