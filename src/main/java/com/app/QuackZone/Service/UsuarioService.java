package com.app.QuackZone.Service;
import com.app.QuackZone.Model.Carrito;
import com.app.QuackZone.Model.Perfil;
import com.app.QuackZone.Model.Usuario;
import com.app.QuackZone.Repository.PerfilRepository;
import com.app.QuackZone.Repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
@AllArgsConstructor

public class UsuarioService {
    private UsuarioRepository usuarioRepository;
    private PerfilRepository perfilRepository;

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.findByCorreo(usuario.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya esta registrado");
        }

        Perfil perfil = new Perfil();
        perfil.setImagenPerfil("https://i.pinimg.com/1200x/01/c0/c0/01c0c07a7e0cb74c3fd8ba16dc6fdb11.jpg");
        perfil.setImagenPortada("https://i.pinimg.com/1200x/9c/86/e5/9c86e55ffc702c8f5a57749387e239ea.jpg");
        perfilRepository.save(perfil);

        usuario.setPerfil(perfil);
        usuario.setCarrito(new ArrayList<>());
        usuario.setRol("CLIENTE");

        Carrito carrito = new Carrito();
        carrito.setJuegos(new ArrayList<>());
        carrito.setTotal(0.0);
        carrito.setUsuario(usuario);

        usuario.getCarrito().add(carrito);

        return usuarioRepository.save(usuario);
    }

    public Usuario login(String correo, String contraseña) {
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getContraseña().equals(contraseña)) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return usuario;
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}
