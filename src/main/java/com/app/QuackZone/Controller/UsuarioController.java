package com.app.QuackZone.Controller;
import com.app.QuackZone.DTO.UsuarioLogin;
import com.app.QuackZone.Model.Usuario;
import com.app.QuackZone.Service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
@AllArgsConstructor
@CrossOrigin(origins = "*")

public class UsuarioController {
    private final UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody UsuarioLogin request) {
        Usuario usuario = usuarioService.login(request.getCorreo(), request.getContraseña());
        return ResponseEntity.ok(usuario);
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
            usuarioExistente.setContraseña(nuevosDatos.getContraseña());
        }
        usuarioService.guardar(usuarioExistente);
        return ResponseEntity.ok(usuarioExistente);
    }
}
