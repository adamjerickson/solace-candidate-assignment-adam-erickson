import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        white: '#fff',
        black: '#000000',
        grey: {
          100: '#e9e9e9',
          500: '#9a9a9a',
          700: '#5a5a5a',
          900: '#101010',
        },
        green: {
          100: '#f4f8f7',
          300: '#347866',
          500: '#285e50',
          600: '#254f45',
          700: '#214e42',
          900: '#1d4339',
        },
        gold: {
          100: '#f4e1b1',
          300: '#e9cc95',
          500: '#d7a13b',
        },
        opal: {
          100: '#d4e2dd',
          300: '#d4e2dd8e',
          600: '#d4e2dd4d',
          900: '#d4e2dd1f',
        },


        // Additional UI Colors
        bodyFontDark: '#6d6d6d',
        headingDark: '#150438',
        linearColorThree: '#e0ecff',
        buttonBackgroundDark: '#131218',
        themeColor: '#116df8',
        gray600: '#475467',
      },
    },
  },
  plugins: [],
};
export default config;
