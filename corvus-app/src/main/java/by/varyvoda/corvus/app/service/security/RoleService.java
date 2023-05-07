package by.varyvoda.corvus.app.service.security;

import by.varyvoda.corvus.app.model.user.Role;
import by.varyvoda.corvus.app.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@Transactional
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    @PostConstruct
    public void syncRoles() {
        List<Role.Key> roleKeys = Arrays.asList(Role.Key.values());
        List<Role.Key> storedRoleKeys =
            roleRepository.findAll().stream()
                .map(Role::getKey)
                .collect(toList());

        boolean hasDifference =
            storedRoleKeys.size() != roleKeys.size()
                || roleKeys.stream().anyMatch(roleKey -> !storedRoleKeys.contains(roleKey));

        if (hasDifference) store(roleKeys);
    }

    private void store(List<Role.Key> roleKeys) {
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

    public Role getRole(Role.Key key) {
        return roleRepository.getById(key);
    }
}
