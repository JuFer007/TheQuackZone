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

    @Query(value = "SELECT * FROM juego WHERE LOWER(titulo) LIKE LOWER(CONCAT('%', :query, '%'))", nativeQuery = true)
    List<Juego> buscarPorTitulo(@Param("query") String query);

    @Query(value = "SELECT * FROM juego WHERE LOWER(categoria) = LOWER(:categoria)", nativeQuery = true)
    List<Juego> findByCategoria(@Param("categoria") String categoria);

    @Query(value = "SELECT * FROM juego WHERE rawg_id = :rawgId LIMIT 1", nativeQuery = true)
    java.util.Optional<Juego> findByRawgId(@Param("rawgId") Long rawgId);

    @Query(value = "SELECT * FROM juego WHERE rawg_id IN :rawgIds", nativeQuery = true)
    java.util.List<Juego> findByRawgIdIn(@Param("rawgIds") java.util.List<Long> rawgIds);
}
