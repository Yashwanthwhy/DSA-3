package com.sih2026.app;

/** Backwards-compatible Java application entry point. */
public final class CargoRouteApp {
    private CargoRouteApp() { }

    public static void main(String[] args) {
        RouteOptimizerCli.main(args);
    }
}
