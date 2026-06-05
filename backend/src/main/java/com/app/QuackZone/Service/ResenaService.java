package com.app.QuackZone.Service;

import com.app.QuackZone.Model.Resena;
import com.app.QuackZone.Repository.ResenaRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ResenaService {

    private final ResenaRepository resenaRepository;

    public ResenaService(ResenaRepository resenaRepository) {
        this.resenaRepository = resenaRepository;
    }

    public List<Resena> obtenerPorJuego(Long juegoId) {
        return resenaRepository.findByJuegoIdOrderByFechaDesc(juegoId);
    }

    public Resena crear(Resena resena) {
        resena.setFecha(LocalDate.now());
        return resenaRepository.save(resena);
    }

    public double obtenerPromedio(Long juegoId) {
        List<Resena> resenas = resenaRepository.findByJuegoIdOrderByFechaDesc(juegoId);
        if (resenas.isEmpty()) return 0;
        return resenas.stream().mapToInt(Resena::getPuntuacion).average().orElse(0);
    }
}
