package com.app.QuackZone.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "usuario")

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String correo;

    @Column(nullable = false, length = 9)
    private String numeroTelefono;

    @Column(nullable = false)
    private String contraseña;

    @Column(nullable = false, columnDefinition = "VARCHAR(50) DEFAULT 'CLIENTE'")
    private String rol;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Carrito> carrito;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Venta> ventas;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "lista_deseos_id")
    private ListaDeseos listaDeseos;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "perfil_id")
    private Perfil perfil;
}
