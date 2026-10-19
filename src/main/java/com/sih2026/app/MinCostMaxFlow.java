package com.sih2026.app;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Successive shortest augmenting paths with Bellman-Ford on the residual graph.
 * Capacities are integral; costs are non-negative on original arcs. */
public final class MinCostMaxFlow {
    private static final long INF = Long.MAX_VALUE / 4;

    public static final class Edge {
        public final int from, to;
        public final long capacity, unitCost;
        public long flow;
        public final String label;
        private Edge reverse;
        private long residual;

        private Edge(int from, int to, long capacity, long unitCost, String label) {
            this.from = from; this.to = to; this.capacity = capacity;
            this.unitCost = unitCost; this.label = label; this.residual = capacity;
        }
    }

    public record Result(long flow, long cost, List<Edge> usedEdges) { }
    private final List<List<Edge>> graph;

    public MinCostMaxFlow(int vertices) {
        if (vertices < 2) throw new IllegalArgumentException("At least two vertices are required.");
        graph = new ArrayList<>(vertices);
        for (int i = 0; i < vertices; i++) graph.add(new ArrayList<>());
    }

    public Edge addEdge(int from, int to, long capacity, long cost, String label) {
        if (from < 0 || from >= graph.size() || to < 0 || to >= graph.size() || from == to)
            throw new IllegalArgumentException("Invalid edge endpoints.");
        if (capacity < 0 || cost < 0) throw new IllegalArgumentException("Capacity and cost must be non-negative.");
        Edge forward = new Edge(from, to, capacity, cost, label);
        Edge reverse = new Edge(to, from, 0, -cost, "residual");
        forward.reverse = reverse; reverse.reverse = forward;
        graph.get(from).add(forward); graph.get(to).add(reverse);
        return forward;
    }

    /** Sends as much of the requested flow as possible while minimizing total cost. */
    public Result solve(int source, int sink, long demand) {
        if (source < 0 || sink < 0 || source >= graph.size() || sink >= graph.size() || source == sink)
            throw new IllegalArgumentException("Invalid source or sink.");
        if (demand < 0) throw new IllegalArgumentException("Demand must be non-negative.");
        long totalFlow = 0, totalCost = 0;
        int n = graph.size();
        while (totalFlow < demand) {
            long[] dist = new long[n]; Arrays.fill(dist, INF); dist[source] = 0;
            Edge[] previous = new Edge[n];
            boolean changed = true;
            for (int pass = 0; pass < n - 1 && changed; pass++) {
                changed = false;
                for (int u = 0; u < n; u++) {
                    if (dist[u] == INF) continue;
                    for (Edge e : graph.get(u)) {
                        if (e.residual <= 0) continue;
                        long candidate = dist[u] + e.unitCost;
                        if (candidate < dist[e.to]) {
                            dist[e.to] = candidate; previous[e.to] = e; changed = true;
                        }
                    }
                }
            }
            if (previous[sink] == null) break;
            long amount = demand - totalFlow;
            for (int v = sink; v != source; v = previous[v].from)
                amount = Math.min(amount, previous[v].residual);
            for (int v = sink; v != source; v = previous[v].from) {
                Edge e = previous[v]; e.residual -= amount; e.reverse.residual += amount;
                e.flow += amount; e.reverse.flow -= amount;
            }
            totalFlow += amount;
            totalCost += amount * dist[sink];
        }
        List<Edge> used = new ArrayList<>();
        for (List<Edge> edges : graph) for (Edge e : edges)
            if (!"residual".equals(e.label) && e.capacity > 0 && e.flow > 0) used.add(e);
        return new Result(totalFlow, totalCost, List.copyOf(used));
    }
}
