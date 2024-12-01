const { nextui } = require("@nextui-org/theme");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // "./node_modules/@nextui-org/theme/dist/components/(button|card|input|listbox|navbar|select|ripple|spinner|divider|popover|scroll-shadow).js",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
  plugins: [nextui(), require("@tailwindcss/typography")],
};
