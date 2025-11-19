package com.app.QuackZone.Model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "juego")

public class Juego {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String titulo;

    @Column(nullable = false)
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
}
