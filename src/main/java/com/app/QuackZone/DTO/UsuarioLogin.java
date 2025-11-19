package com.app.QuackZone.DTO;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class UsuarioLogin {
    private String correo;
    private String contraseña;
}
