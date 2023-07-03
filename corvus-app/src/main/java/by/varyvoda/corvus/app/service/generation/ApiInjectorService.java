package by.varyvoda.corvus.app.service.generation;

import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;
import by.varyvoda.corvus.app.service.InjectorService;
import by.varyvoda.corvus.app.service.injector.InjectorClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApiInjectorService implements InjectorService {

    private final InjectorClient injectorClient;

    @Override
    public InjectorResponse validate(InjectionRequest request) {
        return injectorClient.validate(request);
    }

    @Override
    public InjectorResponse inject(InjectionRequest request) {
        return injectorClient.inject(request);
    }
}
