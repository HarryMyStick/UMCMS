import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      custom: ["Montserrat", "sans-serif"],
    },
  },
  plugins: [],
} satisfies Config;
