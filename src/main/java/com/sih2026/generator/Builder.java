package com.sih2026.generator;

import java.io.IOException;

/** Java replacement for builder.py. */
public final class Builder {
    private Builder() {
    }

    public static void write(String filePath, String content) throws IOException {
        FileGenerationSupport.writeText(filePath, content, "Created");
    }

    /** Preserves the function name used by builder.py. */
    public static void w(String filePath, String content) throws IOException {
        write(filePath, content);
    }
}
