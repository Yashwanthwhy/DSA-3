package com.sih2026.generator;

import java.io.IOException;

/** Java replacement for create_cargoroute.py. */
public final class CreateCargoroute {
    private CreateCargoroute() {
    }

    public static void writeFile(String filePath, String content) throws IOException {
        FileGenerationSupport.writeText(filePath, content, "Generated");
    }

    public static void main(String[] args) {
        System.out.println("Builder ready");
    }
}
