package com.app.QuackZone.Controller;
import com.app.QuackZone.DTO.LoginResponse;
import com.app.QuackZone.DTO.UsuarioLogin;
import com.app.QuackZone.Model.Usuario;
import com.app.QuackZone.Security.JwtUtil;
import com.app.QuackZone.Service.EmailService;
import com.app.QuackZone.Service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")

public class UsuarioController {
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioService usuarioService, JwtUtil jwtUtil, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody UsuarioLogin request) {
        Usuario usuario = usuarioService.login(request.getCorreo(), request.getContraseña());
        String token = jwtUtil.generateToken(usuario.getCorreo(), usuario.getId());
        return ResponseEntity.ok(new LoginResponse(token, usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/actualizar/{id}")
    public ResponseEntity<?> editarUsuario(@PathVariable Long id, @RequestBody Usuario nuevosDatos) {
        Usuario usuarioExistente = usuarioService.obtenerPorId(id);
        if (usuarioExistente == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        if (nuevosDatos.getNombre() != null && !nuevosDatos.getNombre().isEmpty()) {
            usuarioExistente.setNombre(nuevosDatos.getNombre());
        }
        if (nuevosDatos.getCorreo() != null && !nuevosDatos.getCorreo().isEmpty()) {
            usuarioExistente.setCorreo(nuevosDatos.getCorreo());
        }
        if (nuevosDatos.getNumeroTelefono() != null && !nuevosDatos.getNumeroTelefono().isEmpty()) {
            usuarioExistente.setNumeroTelefono(nuevosDatos.getNumeroTelefono());
        }
        if (nuevosDatos.getContraseña() != null && !nuevosDatos.getContraseña().isEmpty()) {
            usuarioExistente.setContraseña(passwordEncoder.encode(nuevosDatos.getContraseña()));
        }
        usuarioService.guardar(usuarioExistente);
        emailService.enviarPerfilActualizado(usuarioExistente);
        return ResponseEntity.ok(usuarioExistente);
    }
}
