package by.varyvoda.corvus.app.service.injector;

import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;

public interface InjectorClient {

    InjectorResponse inject(InjectionRequest request);
}
