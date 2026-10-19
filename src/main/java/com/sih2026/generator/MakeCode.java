package com.sih2026.generator;

import java.io.IOException;

/** Java replacement for make_code.py. */
public final class MakeCode {
    private MakeCode() {
    }

    public static void write(String filePath, String content) throws IOException {
        FileGenerationSupport.writeText(filePath, content, "OK");
    }

    /** Preserves the function name used by make_code.py. */
    public static void w(String filePath, String content) throws IOException {
        write(filePath, content);
    }
}
