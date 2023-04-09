package by.varyvoda.corvus.app.service.generation;

import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;
import by.varyvoda.corvus.app.service.ReportService;
import by.varyvoda.corvus.app.service.injector.InjectorClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApiReportService implements ReportService {

    private final InjectorClient injectorClient;

    @Override
    public InjectorResponse generate(InjectionRequest request) {
        return injectorClient.inject(request);
    }
}
