import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3007/v1",
    defaultCommandTimeout: 10000,
  },
});
