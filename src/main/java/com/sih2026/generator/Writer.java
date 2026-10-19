package com.sih2026.generator;

import java.io.IOException;

/** Java replacement for the former base64 file writer script. */
public final class Writer {
    private Writer() {
    }

    public static void write(String filePath, String base64Content) throws IOException {
        FileGenerationSupport.writeBase64(filePath, base64Content);
    }

    public static void main(String[] args) throws IOException {
        if (args.length != 2) {
            throw new IllegalArgumentException("Usage: Writer <output-path> <base64-content>");
        }
        write(args[0], args[1]);
    }
}
