package by.varyvoda.corvus.app.model.constraints;

import java.util.regex.Pattern;

public class Constraints {

    public static final Pattern VALID_EMAIL =
        Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    public static class Source {

        public static class Base64 {
            public static final int MAX_LENGTH = 2048;
        }

        public static class Url {
            public static final int MAX_LENGTH = 1024;
        }

        public static class Value {
            public static final int MAX_LENGTH = 2048;
        }
    }
}
