package com.app.QuackZone.Service;
import com.app.QuackZone.Model.Juego;
import com.app.QuackZone.Repository.JuegoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor

public class JuegoService {
    private final JuegoRepository juegoRepository;

    public List<Juego> listarTodos() {
        return juegoRepository.findAll();
    }

    public Juego guardarJuego(Juego juego) {
        return juegoRepository.save(juego);
    }

    public Juego obtenerPorID(Long id) {
        return juegoRepository.findById(id).orElseThrow(() -> new RuntimeException("Juego no encontrado"));
    }

    public List<Juego> listarPorSeccion(String seccion) {
        return juegoRepository.findBySeccion(seccion);
    }
}
