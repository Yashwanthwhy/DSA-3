package com.sih2026.app;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Demo multimodal services. Cost is in milli-paise per kg, capacity in kg. */
public final class LogisticsNetwork {
    public record Service(String from, String to, String mode, int distanceKm,
                          int hours, int capacityTons, int rateMilliPaisePerKgKm,
                          String serviceName) { }
    public record Plan(MinCostMaxFlow.Result result, List<Service> services,
                       long requestedKg, long deliveredKg) { }

    public static final List<String> HUBS = List.of("Hyderabad", "Nagpur", "Bhopal", "Delhi", "Mumbai",
            "Pune", "Bengaluru", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Varanasi", "Surat", "Belagavi");

    private static final List<Service> SERVICES = List.of(
        s("Hyderabad","Nagpur","Truck",500,10,18,850,"Deccan Express • TS09AB1234"),
        s("Nagpur","Delhi","Train",1050,19,80,300,"CONCOR Freight Express • DFC-207"),
        s("Hyderabad","Bhopal","Train",850,18,65,300,"South Central Freight • SC-84"),
        s("Bhopal","Delhi","Train",780,15,65,300,"Central India Cargo • CI-19"),
        s("Hyderabad","Mumbai","Truck",710,15,22,850,"Deccan Road Service • MH12KL5678"),
        s("Mumbai","Pune","Truck",150,4,16,850,"West Hub Feeder • MH14TR2201"),
        s("Pune","Ahmedabad","Train",660,13,65,300,"Western Cargo Link • WC-33"),
        s("Mumbai","Ahmedabad","Train",490,11,70,300,"Western Dedicated Freight • WDFC-12"),
        s("Pune","Bengaluru","Truck",840,18,18,850,"Southern Multi-axle • KA01GH2345"),
        s("Bengaluru","Chennai","Truck",350,8,16,850,"Chennai Corridor • TN02MN7788"),
        s("Bengaluru","Belagavi","Truck",500,11,14,850,"Karnataka Cargo • KA05BR2208"),
        s("Belagavi","Mumbai","Truck",490,11,16,850,"Konkan Connector • MH04CV3900"),
        s("Chennai","Kolkata","Train",1660,32,70,300,"East Coast Freight • ECF-08"),
        s("Kolkata","Varanasi","Train",680,14,70,300,"Eastern Cargo Express • EC-71"),
        s("Varanasi","Delhi","Train",780,16,75,300,"Northbound Freight • NB-55"),
        s("Delhi","Jaipur","Truck",280,6,16,850,"Rajasthan Feeder • DL01PQ9012"),
        s("Jaipur","Ahmedabad","Truck",670,14,16,850,"Desert Road Link • RJ14GD4871"),
        s("Ahmedabad","Surat","Truck",265,6,12,850,"Gujarat Hub Shuttle • GJ01XY3344"),
        s("Surat","Mumbai","Truck",280,7,15,850,"Coastal Road Link • MH03AL1188"),
        s("Delhi","Mumbai","Flight",1150,5,22,2400,"Cargo Air Connect • CRX-721"),
        s("Hyderabad","Chennai","Flight",520,3,18,2400,"Southern Cargo Air • CRX-116"),
        s("Delhi","Kolkata","Flight",1310,4,20,2400,"Eastern Cargo Air • CRX-204")
    );

    private static Service s(String a, String b, String mode, int km, int hours, int tons, int rate, String name) {
        return new Service(a,b,mode,km,hours,tons,rate,name);
    }

    public static Plan optimize(String origin, String destination, double weightTons, String modePreference) {
        if (!HUBS.contains(origin) || !HUBS.contains(destination) || origin.equals(destination))
            throw new IllegalArgumentException("Choose two different hubs from the list.");
        if (!Double.isFinite(weightTons) || weightTons <= 0 || weightTons > 120)
            throw new IllegalArgumentException("Cargo weight must be between 0 and 120 tonnes.");
        Map<String,Integer> node = new LinkedHashMap<>();
        for (String city : HUBS) node.put(city, node.size());
        int source = node.size(), sink = source + 1;
        MinCostMaxFlow flow = new MinCostMaxFlow(node.size() + 2);
        long requestedKg = Math.round(weightTons * 1000);
        flow.addEdge(source, node.get(origin), requestedKg, 0, "source");
        flow.addEdge(node.get(destination), sink, requestedKg, 0, "sink");
        List<Service> included = new ArrayList<>();
        for (Service service : SERVICES) {
            if (!"Multimodal".equals(modePreference) && !service.mode.equals(modePreference)) continue;
            included.add(service);
            long capacityKg = service.capacityTons * 1000L;
            long unitCost = (long) service.rateMilliPaisePerKgKm * service.distanceKm;
            String label = service.from + " → " + service.to + " · " + service.mode;
            flow.addEdge(node.get(service.from), node.get(service.to), capacityKg, unitCost, label);
            flow.addEdge(node.get(service.to), node.get(service.from), capacityKg, unitCost, label + " (reverse)");
        }
        MinCostMaxFlow.Result result = flow.solve(source, sink, requestedKg);
        return new Plan(result, List.copyOf(included), requestedKg, result.flow());
    }

    private LogisticsNetwork() { }
}
