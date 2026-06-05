package com.app.QuackZone.Controller;
import com.app.QuackZone.Model.Perfil;
import com.app.QuackZone.Service.PerfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perfil")

public class PerfilController {
    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @PutMapping("/actualizar/{usuarioId}")
    public ResponseEntity<Perfil> actualizarImagenes(@PathVariable Long usuarioId,
        @RequestParam(required = false) String imagenPerfilUrl, @RequestParam(required = false) String imagenPortadaUrl) {
        Perfil perfil = perfilService.actualizarImagenes(usuarioId,imagenPerfilUrl, imagenPortadaUrl);
        return ResponseEntity.ok(perfil);
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<Perfil> obtenerPerfil(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(perfilService.obtenerPerfilUsuario(usuarioId));
    }
}
