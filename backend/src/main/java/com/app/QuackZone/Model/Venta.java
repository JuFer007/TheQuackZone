package com.app.QuackZone.Model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "venta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate fecha;
    private Double total;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToMany
    @JoinTable(
    name = "venta_juego",
    joinColumns = @JoinColumn(name = "venta_id"),
    inverseJoinColumns = @JoinColumn(name = "juego_id"))
    private List<Juego> videojuegos;
}
