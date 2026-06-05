package com.app.QuackZone.Repository;

import com.app.QuackZone.Model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByJuegoIdOrderByFechaDesc(Long juegoId);
    List<Resena> findByUsuarioId(Long usuarioId);
}
