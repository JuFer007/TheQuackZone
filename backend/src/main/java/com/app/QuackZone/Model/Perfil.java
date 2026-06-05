package com.app.QuackZone.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "perfil")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Perfil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String imagenPerfil;
    private String imagenPortada;

    @OneToOne(mappedBy = "perfil")
    @JsonIgnore
    private Usuario usuario;
}
