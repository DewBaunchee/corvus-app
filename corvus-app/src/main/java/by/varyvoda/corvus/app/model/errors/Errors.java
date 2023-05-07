package by.varyvoda.corvus.app.model.errors;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Errors {

    private final Map<String, List<String>> map = new HashMap<>();

    private Errors() {

    }

    public static Errors empty() {
        return new Errors();
    }

    @JsonValue
    public Map<String, List<String>> toMap() {
        if (isEmpty()) return null;
        return map;
    }

    public Errors addError(String key, String value) {
        map.compute(key, (k, list) -> {
            if (list == null) list = new ArrayList<>();
            list.add(value);
            return list;
        });
        return this;
    }

    public int errorCount() {
        return map.size();
    }

    public boolean isNotEmpty() {
        return errorCount() > 0;
    }

    public boolean isEmpty() {
        return errorCount() == 0;
    }
}
