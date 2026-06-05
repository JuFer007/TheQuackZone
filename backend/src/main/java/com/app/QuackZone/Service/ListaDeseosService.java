package com.app.QuackZone.Service;

import com.app.QuackZone.Model.Juego;
import com.app.QuackZone.Model.ListaDeseos;
import com.app.QuackZone.Model.Usuario;
import com.app.QuackZone.Repository.JuegoRepository;
import com.app.QuackZone.Repository.ListaDeseosRepository;
import com.app.QuackZone.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ListaDeseosService {

    private final ListaDeseosRepository listaDeseosRepository;
    private final JuegoRepository juegoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${node-service.url}")
    private String nodeServiceUrl;

    public ListaDeseosService(ListaDeseosRepository listaDeseosRepository, JuegoRepository juegoRepository, UsuarioRepository usuarioRepository, EmailService emailService) {
        this.listaDeseosRepository = listaDeseosRepository;
        this.juegoRepository = juegoRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    public ListaDeseos obtenerLista(Long usuarioId) {
        return listaDeseosRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Lista de deseos no encontrada"));
    }

    public ListaDeseos agregarJuego(Long usuarioId, Long juegoId) {
        ListaDeseos lista = listaDeseosRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Lista de deseos no encontrada"));

        Juego juego = juegoRepository.findById(juegoId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        if (lista.getJuegos() == null) {
            lista.setJuegos(new ArrayList<>());
        }

        if (!lista.getJuegos().contains(juego)) {
            lista.getJuegos().add(juego);
        }

        return listaDeseosRepository.save(lista);
    }

    public ListaDeseos quitarJuego(Long usuarioId, Long juegoId) {
        ListaDeseos lista = listaDeseosRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Lista de deseos no encontrada"));

        Juego juego = juegoRepository.findById(juegoId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        lista.getJuegos().remove(juego);
        return listaDeseosRepository.save(lista);
    }

    public Map<String, Object> verificarOfertas(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        ListaDeseos lista = obtenerLista(usuarioId);

        if (lista.getJuegos() == null || lista.getJuegos().isEmpty()) {
            return Map.of("mensaje", "La lista de deseos esta vacia", "ofertas", 0);
        }

        List<Juego> juegos = lista.getJuegos();
        Map<Long, Double> ofertasMap = new HashMap<>();

        try {
            List<String> titulos = juegos.stream().map(Juego::getTitulo).collect(Collectors.toList());
            Map<String, Object> response = restTemplate.postForObject(
                nodeServiceUrl + "/api/cheapshark/batch",
                Map.of("titles", titulos),
                Map.class
            );

            if (response != null) {
                for (Juego j : juegos) {
                    Object dealObj = response.get(j.getTitulo());
                    if (dealObj instanceof Map) {
                        Map<String, Object> deal = (Map<String, Object>) dealObj;
                        Object priceObj = deal.get("price");
                        if (priceObj != null) {
                            double salePrice = Double.parseDouble(priceObj.toString());
                            double originalPrice = j.getPrecio() != null ? j.getPrecio() : 0.0;
                            if (salePrice < originalPrice) {
                                ofertasMap.put(j.getId(), salePrice);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[ListaDeseosService] Error al verificar ofertas: " + e.getMessage());
            return Map.of("mensaje", "Error al consultar ofertas", "error", e.getMessage(), "ofertas", 0);
        }

        if (ofertasMap.isEmpty()) {
            return Map.of("mensaje", "No hay ofertas para los juegos de tu lista", "ofertas", 0);
        }

        List<Juego> juegosEnOferta = juegos.stream()
                .filter(j -> ofertasMap.containsKey(j.getId()))
                .collect(Collectors.toList());

        emailService.enviarOfertasListaDeseos(usuario, juegosEnOferta, ofertasMap);

        return Map.of("mensaje", "Se encontraron " + ofertasMap.size() + " ofertas", "ofertas", ofertasMap.size(), "juegos", juegosEnOferta.stream().map(Juego::getTitulo).collect(Collectors.toList()));
    }
}
