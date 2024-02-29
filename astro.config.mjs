import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  output: "hybrid",
  // This is a workaround for a bug in the Vercel adapter. Hope to remove this soon.
  adapter: vercel(),
  vite: {
    optimizeDeps: {
      exclude: ["oslo"],
    },
  },
});
