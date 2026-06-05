package com.app.QuackZone.Controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class HomeController {
    @GetMapping("/sesion")
    public String devolverInicioSesion() {
        return "forward:/vue/index.html";
    }

    @GetMapping("/")
    public String inicio() {
        return "forward:/vue/index.html";
    }

    @GetMapping("/perfil")
    public String vistaPerfil() {
        return "forward:/vue/index.html";
    }

    @GetMapping("/lista-deseos")
    public String vistaListaDeseos() {
        return "forward:/vue/index.html";
    }

    //SPA catch-all: sirve Vue para rutas que no sean API
    @GetMapping("/{path:[^\\.]*}")
    public String spaFallback() {
        return "forward:/vue/index.html";
    }

    @GetMapping("/{prefix:[^\\.]*}/{path:[^\\.]*}")
    public String spaFallbackDeep() {
        return "forward:/vue/index.html";
    }
}
