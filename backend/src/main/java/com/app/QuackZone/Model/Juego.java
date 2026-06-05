package com.app.QuackZone.Model;
import jakarta.persistence.*;
import java.util.Date;
import lombok.*;

@Entity
@Table(name = "juego")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Juego {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String titulo;

    private String seccion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date fechaLanzamiento;

    @Column(nullable = false)
    private String categoria;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(name = "portada_url", length = 500)
    private String portadaUrl;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private String plataforma;

    private String requisitos;

    @Column(name = "disponibilidad", columnDefinition = "VARCHAR(500) DEFAULT 'disponible'")
    private String disponibilidad;

    @Column(name = "rawg_id")
    private Long rawgId;
}
