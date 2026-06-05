package com.app.QuackZone.Service;
import com.app.QuackZone.Model.Juego;
import com.app.QuackZone.Repository.JuegoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service

public class JuegoService {
    private final JuegoRepository juegoRepository;

    public JuegoService(JuegoRepository juegoRepository) {
        this.juegoRepository = juegoRepository;
    }

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

    public List<Juego> buscarPorTitulo(String query) {
        return juegoRepository.buscarPorTitulo(query);
    }

    public List<Juego> listarPorCategoria(String categoria) {
        return juegoRepository.findByCategoria(categoria);
    }

    public java.util.Optional<Juego> obtenerPorRawgId(Long rawgId) {
        return juegoRepository.findByRawgId(rawgId);
    }

    public java.util.List<Juego> obtenerPorRawgIds(java.util.List<Long> rawgIds) {
        return juegoRepository.findByRawgIdIn(rawgIds);
    }
}
