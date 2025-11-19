package com.app.QuackZone.Repository;
import com.app.QuackZone.Model.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface PerfilRepository extends JpaRepository<Perfil, Long> {
}
