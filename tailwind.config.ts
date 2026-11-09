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
        ivory: "#F4F2ED",
        sand: "#D8D5CD",
        olive: "#8C8980",
        charcoal: "#373632",
        deepbrown: "#B7A28B",
        pureblack: "#171715",
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
