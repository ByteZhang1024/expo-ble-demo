const {
  colors,
  boxShadow,
  screens,
  borderRadius,
  fontFamily,
} = require("./src/util/tailwindcss");

module.exports = {
  prefix: "okd-",
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors,
      screens,
      fontFamily,
    },
    borderRadius,
    boxShadow,
  },
  variants: {
    extend: {
      // ...
      //  gap: ['hover', 'focus'],
      //  order: ['hover', 'focus'],
      //  flex: ['hover', 'focus'],
      gridAutoColumns: ["responsive", "hover", "focus"],
      gridAutoFlow: ["responsive", "hover", "focus"],
      gridAutoRows: ["responsive", "hover", "focus"],
      gridColumn: ["responsive", "hover", "focus"],
      gridColumnEnd: ["responsive", "hover", "focus"],
      gridColumnStart: ["responsive", "hover", "focus"],
      gridRow: ["responsive", "hover", "focus"],
      gridRowEnd: ["responsive", "hover", "focus"],
      gridRowStart: ["responsive", "hover", "focus"],
      gridTemplateColumns: ["responsive", "hover", "focus"],
      gridTemplateRows: ["responsive", "hover", "focus"],
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};
