package com.app.QuackZone.Repository;
import com.app.QuackZone.Model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByUsuarioId(Long idUsuario);
}
