package com.app.QuackZone.Config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration

public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/caratulas/**")
        .addResourceLocations("file:caratulas/");

        registry.addResourceHandler("/portadas/**")
        .addResourceLocations("file:portadas/");
    }
}
