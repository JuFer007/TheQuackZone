package com.app.QuackZone.Model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "lista_deseos")

public class ListaDeseos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToMany
    @JoinTable(
    name = "lista_deseos_juego",
    joinColumns = @JoinColumn(name = "lista_deseos_id"),
    inverseJoinColumns = @JoinColumn(name = "juego_id"))
    private List<Juego> juegos;
}
