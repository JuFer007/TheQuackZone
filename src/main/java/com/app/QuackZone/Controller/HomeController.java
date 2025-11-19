package com.app.QuackZone.Controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class HomeController {
    @GetMapping("/sesion")
    public String devolverInicioSesion() {
        return "sesion";
    }

    @GetMapping("/")
    public String inicio() {
        return "index";
    }

    @GetMapping("/perfil")
    public String vistaPerfil() {
        return "perfil";
    }
}
