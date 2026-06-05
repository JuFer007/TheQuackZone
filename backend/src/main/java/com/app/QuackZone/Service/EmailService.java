package com.app.QuackZone.Service;
import com.app.QuackZone.Model.Juego;
import com.app.QuackZone.Model.Usuario;
import com.app.QuackZone.Model.Venta;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor

public class EmailService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final SpringTemplateEngine templateEngine;

    @Value("${node-service.url}")
    private String nodeServiceUrl;

    public void enviarBienvenida(Usuario usuario) {
        Context ctx = new Context();
        ctx.setVariable("nombre", usuario.getNombre());
        ctx.setVariable("frontendUrl", frontendUrl());
        String html = templateEngine.process("emails/bienvenida", ctx);
        enviar(usuario.getCorreo(), "¡Bienvenido a TheQuackZone!", html);
    }

    public void enviarConfirmacionCompra(Usuario usuario, Venta venta, List<Juego> juegos, Map<Long, Double> preciosMap) {
        Context ctx = new Context();
        ctx.setVariable("nombre", usuario.getNombre());
        ctx.setVariable("juegos", juegos);
        ctx.setVariable("total", venta.getTotal());
        ctx.setVariable("fecha", venta.getFecha());
        ctx.setVariable("frontendUrl", frontendUrl());
        ctx.setVariable("preciosMap", preciosMap);
        String html = templateEngine.process("emails/compra", ctx);
        enviar(usuario.getCorreo(), "Compra confirmada - TheQuackZone ✓", html);
    }

    public void enviarPerfilActualizado(Usuario usuario) {
        Context ctx = new Context();
        ctx.setVariable("nombre", usuario.getNombre());
        ctx.setVariable("frontendUrl", frontendUrl());
        String html = templateEngine.process("emails/perfil-actualizado", ctx);
        enviar(usuario.getCorreo(), "Perfil actualizado - TheQuackZone", html);
    }

    public void enviarOfertasListaDeseos(Usuario usuario, List<Juego> juegos, Map<Long, Double> ofertasMap) {
        Context ctx = new Context();
        ctx.setVariable("nombre", usuario.getNombre());
        ctx.setVariable("juegos", juegos);
        ctx.setVariable("ofertasMap", ofertasMap);
        ctx.setVariable("frontendUrl", frontendUrl());
        String html = templateEngine.process("emails/ofertas", ctx);
        enviar(usuario.getCorreo(), "Ofertas en tu lista de deseos - TheQuackZone", html);
    }

    private void enviar(String to, String subject, String html) {
        try {
            restTemplate.postForEntity(
                nodeServiceUrl + "/api/email/send",
                Map.of("to", to, "subject", subject, "html", html),
                Void.class
            );
        } catch (Exception e) {
            System.err.println("[EmailService] Error al enviar email a " + to + ": " + e.getMessage());
        }
    }

    private String frontendUrl() {
        return System.getenv().getOrDefault("VITE_API_BASE_URL", "http://localhost:8080");
    }
}
