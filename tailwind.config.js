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
          bright: "#E101FF",
          dark: "#870199"
        }
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