package by.varyvoda.corvus.app.service;

import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;

public interface InjectorService {

    InjectorResponse validate(InjectionRequest request);

    InjectorResponse inject(InjectionRequest request);

}
