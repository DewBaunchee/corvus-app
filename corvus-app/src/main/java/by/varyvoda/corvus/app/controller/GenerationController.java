package by.varyvoda.corvus.app.controller;

import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;
import by.varyvoda.corvus.app.config.WebConfig;
import by.varyvoda.corvus.app.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController(WebConfig.API_ROOT + "/generation")
public class GenerationController {

    private final ReportService reportService;

    @PostMapping("generate")
    public InjectorResponse generate(InjectionRequest request) {
        return reportService.generate(request);
    }
}
