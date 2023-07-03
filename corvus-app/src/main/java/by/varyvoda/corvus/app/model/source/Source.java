package by.varyvoda.corvus.app.model.source;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Source {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name = "name")
    private String name;

    @Column(name = "extension")
    private String extension;

    public void guessExtension() {
        int dotIndex = name.lastIndexOf(".");
        if (dotIndex == -1) {
            this.extension = "";
            return;
        }
        this.extension = name.substring(dotIndex + 1);
    }

    public enum Type {
        FILE, URL, VALUE, BASE64
    }
}
