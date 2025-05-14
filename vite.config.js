import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // o 'localhost' o tu IP
    port: 13000, // el puerto que quieras
  },
});
