import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#EDE9E3",
        sand: "#C8C2B8",
        olive: "#5F5B56",
        charcoal: "#171717",
        deepbrown: "#73808A",
        pureblack: "#171717",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        signature: ["var(--font-signature)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
