package by.varyvoda.corvus.app.service;

import by.varyvoda.corvus.api.format.DocumentFormat;
import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;
import by.varyvoda.corvus.api.template.Template;
import by.varyvoda.corvus.api.value.ValueDescriptor;

public interface ReportService {

    default InjectorResponse generate(Template template, ValueDescriptor data, DocumentFormat outputFormat) {
        return generate(
            InjectionRequest.builder()
                .data(data)
                .template(template)
                .outputFormat(outputFormat)
                .build()
        );
    }

    InjectorResponse generate(InjectionRequest request);

}
