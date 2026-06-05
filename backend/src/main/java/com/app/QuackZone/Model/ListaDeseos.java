package com.app.QuackZone.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "lista_deseos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ListaDeseos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnore
    private Usuario usuario;

    @ManyToMany
    @JoinTable(
    name = "lista_deseos_juego",
    joinColumns = @JoinColumn(name = "lista_deseos_id"),
    inverseJoinColumns = @JoinColumn(name = "juego_id"))
    private List<Juego> juegos;
}
