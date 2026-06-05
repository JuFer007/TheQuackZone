package com.app.QuackZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})

public class QuackZoneApplication {
	public static void main(String[] args) {
		SpringApplication.run(QuackZoneApplication.class, args);
	}
}
