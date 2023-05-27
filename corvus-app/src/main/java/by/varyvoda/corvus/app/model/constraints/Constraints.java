package by.varyvoda.corvus.app.model.constraints;

public class Constraints {

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
