package by.varyvoda.corvus.app.model.injection;

import by.varyvoda.corvus.app.model.source.Source;
import lombok.*;

import javax.persistence.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "injection")
public class Injection {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "queue")
    @ToString.Exclude
    private InjectionQueue queue;

    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private InjectionStatus status = InjectionStatus.EMPTY;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "data_source")
    private Source dataSource;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "template_source")
    private Source templateSource;

    @Column(name = "preferred_result_name")
    private String preferredResultName = "Document.docx";

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "result_source")
    private Source resultSource;

}
