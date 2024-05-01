import { type Config } from "tailwindcss";

const ratio = 1.618;

const spacing = ["xxs", "xs", "s", "m", "l", "xl", "xxl"] as const;

const remIndex = 3;

const spacingTokens = Object.fromEntries(
  spacing.map((
    value,
    index,
  ) => [
    value,
    `${
      Math.round(
        (ratio ** (index - remIndex)) * 1000,
      ) / 1000
    }em`,
  ]),
);

export default {
  theme: {
    extend: {
      spacing: spacingTokens,
      fontSize: {
        display1: ["4.235em", {
          fontWeight: 700,
          lineHeight: "1.129",
          letterSpacing: "-0.022",
        }],
        display2: ["2.618em", {
          fontWeight: 700,
          lineHeight: "1.272",
          letterSpacing: "-0.022",
        }],
        titleA: ["2.058em", {
          fontWeight: 700,
          lineHeight: "1.272",
          letterSpacing: "-0.022",
        }],
        titleB: ["1.618em", {
          fontWeight: 600,
          lineHeight: "1.272",
          letterSpacing: "-0.02",
        }],
        titleC: ["1.272em", {
          fontWeight: 600,
          lineHeight: "1.272",
          letterSpacing: "-0.017",
        }],
        heading: ["1.129em", {
          fontWeight: 700,
          lineHeight: "1.272",
          letterSpacing: "-0.014",
        }],
        subheading: ["0.885em", {
          fontWeight: 600,
          lineHeight: "1.272",
          letterSpacing: "-0.007",
        }],
        body: ["1em", {
          fontWeight: 600,
          lineHeight: "1.618",
          letterSpacing: "-0.011",
        }],
        callout: ["0.943em", {
          fontWeight: 600,
          lineHeight: "1.272",
          letterSpacing: "-0.009",
        }],
        label: ["0.835em", {
          fontWeight: 700,
          lineHeight: "1.272",
          letterSpacing: "-0.004",
        }],
        caption: ["0.786em", {
          fontWeight: 600,
          lineHeight: "1.272",
          letterSpacing: "-0.007",
        }],
        overline: ["0.786em", {
          fontWeight: 600,
          lineHeight: "1.272",
          letterSpacing: "0.0618",
        }],
        "display1-light": ["4.235em", {
          fontWeight: 400,
          lineHeight: "1.129",
          letterSpacing: "-0.022",
        }],
        "display2-light": ["2.618em", {
          fontWeight: 400,
          lineHeight: "1.272",
          letterSpacing: "-0.022",
        }],
        "titleA-light": ["2.058em", {
          fontWeight: 400,
          lineHeight: "1.272",
          letterSpacing: "-0.022",
        }],
        "titleB-light": ["1.618em", {
          fontWeight: 400,
          lineHeight: "1.272",
          letterSpacing: "-0.02",
        }],
        "titleC-light": ["1.272em", {
          fontWeight: 400,
          lineHeight: "1.272",
          letterSpacing: "-0.017",
        }],
        "heading-light": ["1.129em", {
          fontWeight: 600,
          lineHeight: "1.272",
          letterSpacing: "-0.014",
        }],
        "subheading-light": ["0.885em", {
          fontWeight: 400,
          lineHeight: "1.272",
          letterSpacing: "-0.007",
        }],
        "body-light": ["1em", {
          fontWeight: 400,
          lineHeight: "1.618",
          letterSpacing: "-0.011",
        }],
        "callout-light": ["0.943em", {
          fontWeight: 400,
          lineHeight: "1.272",
          letterSpacing: "-0.009",
        }],
        "label-light": ["0.835em", {
          fontWeight: 500,
          lineHeight: "1.272",
          letterSpacing: "-0.004",
        }],
        "caption-light": ["0.786em", {
          fontWeight: 400,
          lineHeight: "1.272",
          letterSpacing: "-0.007",
        }],
        "overline-light": ["0.786em", {
          fontWeight: 400,
          lineHeight: "1.272",
          letterSpacing: "0.0618",
        }],
      },
    },
  },
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
} satisfies Config;
