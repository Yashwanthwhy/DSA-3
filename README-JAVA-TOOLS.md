# Java generator tools

The former Python project-generation helpers have been converted to Java and
are located in `src/main/java/com/sih2026/generator`. Their original helper
names (`w` and `write_file`) are retained as Java static methods.

Compile them without third-party dependencies:

```powershell
javac -d out (Get-ChildItem -Recurse src/main/java -Filter *.java | ForEach-Object FullName)
```

Run the base64 writer:

```powershell
java -cp out com.sih2026.generator.Writer <output-path> <base64-content>
```

`Builder`, `Gen1`, `GenAllFiles`, `MakeCode`, and `CreateCargoroute` expose
static file-writing methods for use from Java code.
