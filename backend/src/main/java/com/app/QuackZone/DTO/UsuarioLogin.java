package com.app.QuackZone.DTO;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class UsuarioLogin {
    private String correo;
    private String contraseña;
}
