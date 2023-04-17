package by.varyvoda.corvus.app.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class ConversionConfig {

    private final List<Converter<?, ?>> converters;

    public List<Converter<?, ?>> getConverters() {
        return converters;
    }
}
