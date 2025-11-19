package com.app.QuackZone.Model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "carrito")

public class Carrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToMany
    @JoinTable(name = "carrito_videojuego",
    joinColumns = @JoinColumn(name = "carrito_id"),
    inverseJoinColumns = @JoinColumn(name = "videojuego_id"))
    private List<Juego> juegos;
    private Double total;
}
