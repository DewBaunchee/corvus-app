package by.varyvoda.corvus.app.service.injector;

import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class RestInjectorClient implements InjectorClient {

    private final RestTemplate rest;

    @Value("${injector.host}")
    private final String apiHost;

    @Override
    public InjectorResponse inject(InjectionRequest request) {
        return rest.postForObject(apiHost + "/inject", request, InjectorResponse.class);
    }
}
