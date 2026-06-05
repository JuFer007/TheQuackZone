package com.app.QuackZone.Repository;
import com.app.QuackZone.Model.ListaDeseos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface ListaDeseosRepository extends JpaRepository<ListaDeseos, Long> {
    Optional<ListaDeseos> findByUsuarioId(Long usuarioId);
}
