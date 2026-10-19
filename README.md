# CargoRoute

The existing React + TypeScript website remains the user interface. The former Python project-generation scripts have Java equivalents under `src/main/java/com/sih2026/generator`, and the route-planning implementation is in `src/main/java/com/sih2026/app`.

## Run the dashboard

```powershell
npm install
npm run dev
```

The live tracking page uses OpenStreetMap road tiles and does not need an API key. Truck and aircraft positions use simulated demo telemetry refreshed every second. The map displays OpenStreetMap attribution as required by its tile usage policy.

## Run the Java route optimizer

Requires JDK 17 or later. Compile and run with no third-party dependencies:

```powershell
javac -encoding UTF-8 -d out (Get-ChildItem -Recurse src/main/java -Filter *.java | ForEach-Object FullName)
java -cp out com.sih2026.app.RouteOptimizerCli Hyderabad Delhi 8.5 Multimodal
```

Arguments are optional; defaults are `Hyderabad Delhi 8.5 Multimodal`. Supported modes are `Multimodal`, `Truck`, `Train`, and `Flight`. The available hubs are printed when the command is run with invalid input.

## Algorithm

The Java planner models scheduled freight services as capacity-limited directed edges. It uses successive shortest augmenting paths with Bellman–Ford over the residual graph to maximize delivered flow and minimize total cost. Cargo and capacity are represented in integer kilograms; edge costs use milli-paise per kilogram. Service schedules, capacities, and rates are illustrative demo data, not live carrier quotes.

## Java replacements for the Python helpers

The file-writing helpers accept a destination path and content, create parent directories, write UTF-8 text with surrounding whitespace removed, append a newline, and print a status message. `Writer` writes decoded base64 bytes. Compile all Java sources with the command above; the helper classes are in `com.sih2026.generator`.

## Project layout

- `src/` — existing React dashboard, plus Java DSA implementation.
- `src/main/java/com/sih2026/app/MinCostMaxFlow.java` — residual graph and min-cost max-flow solver.
- `src/main/java/com/sih2026/app/LogisticsNetwork.java` — hub/service graph and optimizer input model.
- `src/main/java/com/sih2026/app/RouteOptimizerCli.java` — command-line runner for the Java optimizer.
- `src/main/java/com/sih2026/generator/` — Java versions of the former Python file-generation helpers.
