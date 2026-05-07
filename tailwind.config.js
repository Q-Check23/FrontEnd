// tailwind.config.js (ESM 기준. CJS면 module.exports로 바꾸시면 됩니다)
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 0) Pretendard 기본 폰트
      fontFamily: {
        sans: [
          "Pretendard",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },

      // 1) 색상 토큰
      colors: {
        ui: {
          grayC0: "#C0C0C0",
          gray80: "#808080",
          black: "#000000",
          white: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#9f00b4",
          bright: "#E101FF",
          dark: "#870199",
          container: "#c700e2",
          fixed: "#ffd6fc",
          "fixed-dim": "#fbaaff",
        },
        secondary: {
          DEFAULT: "#9b24ac",
          container: "#f278fe",
          fixed: "#ffd6fc",
          "fixed-dim": "#fcaaff",
        },
        tertiary: {
          DEFAULT: "#3c49d7",
          container: "#5764f1",
          fixed: "#e0e0ff",
          "fixed-dim": "#bec2ff",
        },
        surface: {
          DEFAULT: "#fcf9f8",
          dim: "#dcd9d9",
          bright: "#fcf9f8",
          container: "#f0eded",
          "container-low": "#f6f3f2",
          "container-high": "#eae7e7",
          "container-highest": "#e5e2e1",
          "container-lowest": "#ffffff",
          variant: "#e5e2e1",
        },
        "on-surface": {
          DEFAULT: "#1b1b1c",
          variant: "#544153",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
        },
        outline: {
          DEFAULT: "#867085",
          variant: "#d9bfd5",
        },
      },

      // 2) 라인하이트 토큰 (요구사항 그대로)
      lineHeight: {
        ui28: "28px",
      },

      // 3) 폰트 사이즈 토큰 (font-size + line-height를 함께 지정)
      fontSize: {
        ui14: ["14px", { lineHeight: "28px" }], // (2)
        ui16: ["16px", { lineHeight: "28px" }], // (1)(3)(4)(5)
        ui18: ["18px", { lineHeight: "28px", letterSpacing: "0" }], // (6)
        ui24: ["24px", { lineHeight: "28px", letterSpacing: "0" }], // (7)
      },

      // 4) 자주 쓰는 font-weight를 의미로 묶고 싶으면(선택)
      fontWeight: {
        ui500: "500",
        ui600: "600",
      },
    },
  },
  plugins: [],
};