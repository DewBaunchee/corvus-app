package by.varyvoda.corvus.app.model.injection;

import by.varyvoda.corvus.app.model.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "injection_queue")
public class InjectionQueue {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InjectionStatus status = InjectionStatus.EMPTY;

    @ManyToOne
    @JoinColumn(name = "\"user\"", nullable = false)
    private User user;

    @OneToMany(mappedBy = "queue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Injection> injections = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Change {
        private Integer queueId;
        private String name;
        private InjectionStatus status;
        private List<Injection> injections;
        private List<Injection> addedInjections;
        private List<Injection> removedInjections;
        private List<Injection> updatedInjections;

        public static Change.ChangeBuilder startBuilding(InjectionQueue queue) {
            return builder()
                .queueId(queue.getId())
                .status(queue.getStatus());
        }

        public static Change empty() {
            return new Change();
        }
    }
}
