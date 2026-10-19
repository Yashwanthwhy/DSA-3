package com.sih2026.generator;

import java.io.IOException;

/** Java replacement for gen_all_files.py. */
public final class GenAllFiles {
    private GenAllFiles() {
    }

    public static void write(String filePath, String content) throws IOException {
        FileGenerationSupport.writeText(filePath, content, "Wrote");
    }

    /** Preserves the function name used by gen_all_files.py. */
    public static void w(String filePath, String content) throws IOException {
        write(filePath, content);
    }
}
