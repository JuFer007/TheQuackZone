package com.app.QuackZone.Service;
import com.app.QuackZone.Model.Perfil;
import com.app.QuackZone.Model.Usuario;
import com.app.QuackZone.Repository.PerfilRepository;
import com.app.QuackZone.Repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor

public class PerfilService {
    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;

    public Perfil actualizarImagenes(Long idUsuario, String imagenPerfilUrl, String imagenPortadaUrl) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Perfil perfil = usuario.getPerfil();
        if (perfil == null) {
            perfil = new Perfil();
        }

        if (imagenPerfilUrl != null && !imagenPerfilUrl.isEmpty()) {
            perfil.setImagenPerfil(imagenPerfilUrl);
        }

        if (imagenPortadaUrl != null && !imagenPortadaUrl.isEmpty()) {
            perfil.setImagenPortada(imagenPortadaUrl);
        }

        perfilRepository.save(perfil);

        if (usuario.getPerfil() == null) {
            usuario.setPerfil(perfil);
            usuarioRepository.save(usuario);
        }
        return perfil;
    }

    public Perfil obtenerPerfilUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        Perfil perfil = usuario.getPerfil();

        if (perfil == null) {
            perfil = new Perfil();
            perfil.setImagenPerfil("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop");
            perfil.setImagenPortada("https://i.pinimg.com/1200x/9c/86/e5/9c86e55ffc702c8f5a57749387e239ea.jpg");
            perfilRepository.save(perfil);
            usuario.setPerfil(perfil);
            usuarioRepository.save(usuario);
        }

        return perfil;
    }
}
