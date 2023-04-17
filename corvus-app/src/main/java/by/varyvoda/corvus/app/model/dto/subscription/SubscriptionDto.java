package by.varyvoda.corvus.app.model.dto.subscription;

import by.varyvoda.corvus.app.model.dto.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDto {
    private Integer id;
    private LocalDateTime activeUntil;
    private String apiKey;
    private SubscriptionLevelDto level;
    private UserDto user;
}
