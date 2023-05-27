package by.varyvoda.corvus.app.service.security;

import by.varyvoda.corvus.app.model.user.Role;
import by.varyvoda.corvus.app.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.util.Set;

import static by.varyvoda.corvus.app.model.user.Role.Keys.ALL;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

@Service
@Transactional
@RequiredArgsConstructor
public class RepositoryRoleService implements RoleService {

    private final RoleRepository roleRepository;

    @PostConstruct
    public void syncRoles() {
        Set<String> roleKeys = ALL;
        Set<String> storedRoleKeys =
            roleRepository.findAll().stream()
                .map(Role::getKey)
                .collect(toSet());

        boolean hasDifference = !roleKeys.equals(storedRoleKeys);

        if (hasDifference) store(roleKeys);
    }

    private void store(Set<String> roleKeys) {
        roleRepository.deleteAll();
        roleRepository.saveAll(
            roleKeys.stream()
                .map(roleKey -> {
                    Role role = new Role();
                    role.setKey(roleKey);
                    return role;
                })
                .collect(toList())
        );
    }

    @Override
    public Role getRole(String key) {
        return roleRepository.getById(key);
    }
}
