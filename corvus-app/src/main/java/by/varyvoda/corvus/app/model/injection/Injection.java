package by.varyvoda.corvus.app.model.injection;

import by.varyvoda.corvus.app.model.source.FileSource;
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

    @Column(name = "orderId")
    private Integer orderId;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private InjectionStatus status = InjectionStatus.EMPTY;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "data_source")
    private FileSource dataSource;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "template_source")
    private FileSource templateSource;

    @Column(name = "preferred_result_name")
    private String preferredResultName = "Document.docx";

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "result_source")
    private FileSource resultSource;

}
