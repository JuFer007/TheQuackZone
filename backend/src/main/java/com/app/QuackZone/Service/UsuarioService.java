package com.app.QuackZone.Service;
import com.app.QuackZone.Model.Carrito;
import com.app.QuackZone.Model.ListaDeseos;
import com.app.QuackZone.Model.Perfil;
import com.app.QuackZone.Model.Usuario;
import com.app.QuackZone.Repository.ListaDeseosRepository;
import com.app.QuackZone.Repository.PerfilRepository;
import com.app.QuackZone.Repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service

public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final ListaDeseosRepository listaDeseosRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PerfilRepository perfilRepository, ListaDeseosRepository listaDeseosRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.listaDeseosRepository = listaDeseosRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.findByCorreo(usuario.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya esta registrado");
        }

        usuario.setRol("CLIENTE");
        usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));
        usuario.setCarrito(new ArrayList<>());
        usuario = usuarioRepository.save(usuario);

        Perfil perfil = new Perfil();
        perfil.setImagenPerfil("https://i.pinimg.com/1200x/01/c0/c0/01c0c07a7e0cb74c3fd8ba16dc6fdb11.jpg");
        perfil.setImagenPortada("https://i.pinimg.com/1200x/9c/86/e5/9c86e55ffc702c8f5a57749387e239ea.jpg");
        perfilRepository.save(perfil);

        ListaDeseos listaDeseos = new ListaDeseos();
        listaDeseos.setJuegos(new ArrayList<>());
        listaDeseos.setUsuario(usuario);
        listaDeseosRepository.save(listaDeseos);

        Carrito carrito = new Carrito();
        carrito.setJuegos(new ArrayList<>());
        carrito.setTotal(0.0);
        carrito.setUsuario(usuario);

        usuario.setPerfil(perfil);
        usuario.setListaDeseos(listaDeseos);
        usuario.getCarrito().add(carrito);

        usuario = usuarioRepository.save(usuario);
        emailService.enviarBienvenida(usuario);
        return usuario;
    }

    public Usuario login(String correo, String contraseña) {
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String stored = usuario.getContraseña();

        if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
            if (!passwordEncoder.matches(contraseña, stored)) {
                throw new RuntimeException("Contraseña incorrecta");
            }
        } else {
            if (!stored.equals(contraseña)) {
                throw new RuntimeException("Contraseña incorrecta");
            }
            usuario.setContraseña(passwordEncoder.encode(contraseña));
            usuarioRepository.save(usuario);
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
