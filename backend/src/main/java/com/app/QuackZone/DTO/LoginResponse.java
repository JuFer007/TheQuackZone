package com.app.QuackZone.DTO;

import com.app.QuackZone.Model.Usuario;
import lombok.*;

@Data @AllArgsConstructor
public class LoginResponse {
    private String token;
    private Usuario usuario;
}
