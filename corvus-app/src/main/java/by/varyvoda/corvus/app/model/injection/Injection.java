package by.varyvoda.corvus.app.model.injection;

import by.varyvoda.corvus.api.format.DocumentFormat;
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
    @JoinColumn(name = "queue", nullable = false)
    @ToString.Exclude
    private InjectionQueue queue;

    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private InjectionStatus status = InjectionStatus.EMPTY;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "data_source")
    private Source dataSource;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "template_source")
    private Source templateSource;

    @Column(name = "output_format", nullable = false)
    @Enumerated(EnumType.STRING)
    private DocumentFormat outputFormat = DocumentFormat.DOCX;

    @Column(name = "preferred_result_name", nullable = false)
    private String preferredResultName = "Document";

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "result_source")
    private Source resultSource;

}
