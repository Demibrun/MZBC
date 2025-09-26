import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors:{
        "mz-primary":"var(--mz-primary-blue)",
        "mz-sky":"var(--mz-sky-blue)",
        "mz-deep":"var(--mz-deep-blue)",
        "mz-gold":"var(--mz-gold)",
        "mz-green":"var(--mz-green)",
        "mz-dark":"var(--mz-dark)",
        "mz-light":"var(--mz-light)",
      },
      boxShadow:{
        brand:"var(--shadow)"
      }
    }
  },
  plugins: [],
};
export default config;
