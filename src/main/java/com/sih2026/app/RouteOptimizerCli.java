package com.sih2026.app;

import java.text.NumberFormat;
import java.util.Locale;

/** Command-line entry point for the Java min-cost max-flow DSA implementation. */
public final class RouteOptimizerCli {
    private RouteOptimizerCli() { }

    public static void main(String[] args) {
        String origin = args.length > 0 ? args[0] : "Hyderabad";
        String destination = args.length > 1 ? args[1] : "Delhi";
        double weightTons;
        try {
            weightTons = args.length > 2 ? Double.parseDouble(args[2]) : 8.5;
        } catch (NumberFormatException e) {
            usage("Cargo weight must be a number."); return;
        }
        String mode = args.length > 3 ? args[3] : "Multimodal";
        if (args.length > 4) { usage("Too many arguments."); return; }
        try {
            LogisticsNetwork.Plan plan = LogisticsNetwork.optimize(origin, destination, weightTons, mode);
            System.out.println("CargoRoute Java · Min-Cost Max-Flow");
            System.out.printf("Request: %s → %s · %.3f tonnes · %s%n", origin, destination, weightTons, mode);
            System.out.printf("Delivered: %.3f / %.3f tonnes%n", plan.deliveredKg() / 1000.0, plan.requestedKg() / 1000.0);
            System.out.printf("Minimum cost: %s%n", money(plan.result().cost() / 100_000.0));
            if (plan.result().usedEdges().isEmpty()) {
                System.out.println("No feasible route for the selected mode and hubs.");
                return;
            }
            System.out.println("Allocated service legs:");
            for (MinCostMaxFlow.Edge edge : plan.result().usedEdges()) {
                if (edge.label.equals("source") || edge.label.equals("sink") || edge.label.equals("residual")) continue;
                System.out.printf("  %-62s  flow %7.3f t / capacity %7.3f t%n",
                        edge.label, edge.flow / 1000.0, edge.capacity / 1000.0);
            }
        } catch (IllegalArgumentException e) {
            usage(e.getMessage());
        }
    }

    private static String money(double amount) {
        return NumberFormat.getCurrencyInstance(Locale.forLanguageTag("en-IN")).format(amount);
    }

    private static void usage(String message) {
        System.err.println("Error: " + message);
        System.err.println("Usage: java -cp out com.sih2026.app.RouteOptimizerCli [origin] [destination] [weight-tonnes] [Multimodal|Truck|Train|Flight]");
        System.err.println("Available hubs: " + String.join(", ", LogisticsNetwork.HUBS));
    }
}
