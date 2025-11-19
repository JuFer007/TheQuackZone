package com.app.QuackZone.Repository;
import com.app.QuackZone.Model.Juego;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository

public interface JuegoRepository extends JpaRepository<Juego, Long> {
    @Query(value = "SELECT * FROM juego WHERE seccion = :seccion", nativeQuery = true)
    List<Juego> findBySeccion(@Param("seccion") String seccion);
}
