package by.varyvoda.corvus.app.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.server.MimeMappings;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.util.unit.DataSize;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.MultipartConfigElement;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    public static final MimeMappings MIME_MAPPINGS = new MimeMappings(MimeMappings.DEFAULT);
    static  {
        MIME_MAPPINGS.add("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }

    private final ConversionConfig conversionConfig;

    public WebConfig(ConversionConfig conversionConfig) {
        this.conversionConfig = conversionConfig;
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        conversionConfig.getConverters().forEach(registry::addConverter);
    }
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }


    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.ofMegabytes(5));
        factory.setMaxRequestSize(DataSize.ofMegabytes(5));
        return factory.createMultipartConfig();
    }
}
