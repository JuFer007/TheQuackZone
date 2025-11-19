package com.app.QuackZone.Repository;
import com.app.QuackZone.Model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Carrito findTopByUsuarioIdOrderByIdDesc(Long usuarioId);
    Carrito findByUsuarioId(Long usuarioId);
}

