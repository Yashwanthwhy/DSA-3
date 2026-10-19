package com.sih2026.generator;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

/** Shared, dependency-free file generation operations for the project tools. */
final class FileGenerationSupport {
    private FileGenerationSupport() {
    }

    static void writeText(String filePath, String content, String action) throws IOException {
        Path target = Path.of(filePath);
        Path parent = target.getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }

        Files.writeString(target, content.strip() + System.lineSeparator(), StandardCharsets.UTF_8);
        System.out.println(action + ": " + target);
    }

    static void writeBase64(String filePath, String encodedContent) throws IOException {
        Path target = Path.of(filePath);
        Path parent = target.getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }

        Files.write(target, Base64.getDecoder().decode(encodedContent));
        System.out.println("Wrote: " + target);
    }
}
