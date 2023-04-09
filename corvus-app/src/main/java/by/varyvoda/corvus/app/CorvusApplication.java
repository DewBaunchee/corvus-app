package by.varyvoda.corvus.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("by.varyvoda.corvus.app.*")
public class CorvusApplication {

    public static void main(String[] args) {
        SpringApplication.run(CorvusApplication.class, args);
    }
}
