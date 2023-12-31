package by.varyvoda.corvus.app.service.injector;

import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;

public interface InjectorClient {

    InjectorResponse validate(InjectionRequest request);

    InjectorResponse inject(InjectionRequest request);
}
