package by.varyvoda.corvus.app.model.source;

import lombok.*;

import javax.persistence.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "file_source")
//@DiscriminatorValue("FILE")
public class FileSource extends Source {

    {
        setType(Type.FILE);
    }

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "data")
    private byte[] data;

    public String getExtension() {
        int dotIndex = name.lastIndexOf(".");
        if (dotIndex == -1) return "";
        return name.substring(dotIndex + 1);
    }
}
