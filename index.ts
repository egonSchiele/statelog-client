import { StatelogClient } from "./lib/index.js";

const client = new StatelogClient({
  host: "http://localhost:1065",
  debugMode: true,
  apiKey: process.env.STATELOG_API_KEY || "",
  projectId: "agency-lang",
});

client.debug("Test debug message", { foo: "bar" });
