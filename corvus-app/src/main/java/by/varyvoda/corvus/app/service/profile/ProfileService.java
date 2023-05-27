package by.varyvoda.corvus.app.service.profile;

import by.varyvoda.corvus.app.model.dto.security.FormResult;
import by.varyvoda.corvus.app.model.user.User;

public interface ProfileService {

    FormResult setEmail(User user, String email);
}
