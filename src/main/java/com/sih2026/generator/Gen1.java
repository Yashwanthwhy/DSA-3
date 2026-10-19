package com.sih2026.generator;

import java.io.IOException;

/** Java replacement for gen1.py. */
public final class Gen1 {
    private Gen1() {
    }

    public static void write(String filePath, String content) throws IOException {
        FileGenerationSupport.writeText(filePath, content, "Wrote");
    }

    /** Preserves the function name used by gen1.py. */
    public static void w(String filePath, String content) throws IOException {
        write(filePath, content);
    }
}
