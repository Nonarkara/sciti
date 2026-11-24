import { defineConfig } from "@playwright/test";

const port = 41973;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30000,
  webServer: {
    command: `env -u GITHUB_ACTIONS npm run build && env -u GITHUB_ACTIONS npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    port,
    reuseExistingServer: false,
    timeout: 120000,
  },
  use: { baseURL: `http://127.0.0.1:${port}` },
});
