const fonts = {
  sans:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  serif: "athelas, georgia, serif",
  monospace: "courier, consolas, monaco, monospace",
}

export const theme = {
  colors: {
    text: "#000000",
    background: "#ffffff",
    primary: "#3333ee",
    secondary: "#111199",
    muted: "#f8f8f8",
    highlight: "#efeffe",
    lightgray: "#ddd",
    gray: "#777777",
    accent: "#660099",
    darken: "rgba(0, 0, 0, .0625)",

    // game colors
    white: "#ffffff",
    black: "#111111",
    red: "#fd5e53",
    blue: "#3273dc",
    bystander: "#f6eec9",
    assassin: "#111111",
  },
  fonts: {
    ...fonts,
    body: fonts.monospace,
    heading: fonts.monospace,
  },
  breakpoints: ["40em", "56em", "64em"],
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 48, 64],
  fontWeights: {
    body: 400,
    heading: 800,
    bold: 700,
    display: 800,
  },
  lineHeights: {
    body: 1.4,
    heading: 1.25,
  },
  sizes: {
    container: 750,
  },
  text: {
    heading: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    display: {
      variant: "text.heading",
      fontSize: [4, 5],
      fontWeight: "display",
      letterSpacing: "-0.03em",
    },
    caps: {
      fontFamily: "monospace",
      fontWeight: "bold",
      lineHeight: "heading",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    smScreen: {
      variant: "text.heading",
      "@media (min-width: 40em)": {
        display: "none",
      },
    },
    lgScreen: {
      variant: "text.heading",
      display: "none",
      "@media (min-width: 40em)": {
        display: "block",
      },
    },
    game: {
      fontSize: ["10px", 1, 2],
      fontWeight: "bold",
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  buttons: {
    primary: {
      color: "background",
      bg: "primary",
      fontWeight: "bold",
      fontFamily: "body",
      borderRadius: 8,
      "&:hover": {
        cursor: "pointer",
      },
    },
    secondary: {
      variant: "buttons.primary",
      color: "background",
      bg: "secondary",
    },
    black: {
      fontWeight: "bold",
      color: "background",
      bg: "text",
      "&:hover, &:focus": {
        bg: "primary",
      },
    },
    small: {
      variant: "buttons.primary",
      px: "12px",
      py: "6px",
      fontSize: [0, 1],
      lineHeight: 1,
      borderRadius: 8,
      bg: "transparent",
      color: "text",
      border: "1px solid",
      borderColor: "lightgray",
      "&:hover, &:focus": {
        bg: "darken",
      },
    },
    smallDark: {
      variant: "buttons.small",
      bg: "text",
      color: "background",
      border: "1px solid",
      borderColor: "transparent",
      "&:hover, &:focus": {
        bg: "text",
      },
    },
    icon: {
      width: 24,
      height: 24,
      p: 0,
      borderRadius: 8,
      "&:hover": {
        cursor: "pointer",
        bg: "darken",
      },
    },
    iconSmall: {
      variant: "buttons.icon",
      width: 20,
      height: 20,
      borderRadius: 4,
      color: "gray",
    },
  },
  links: {
    button: {
      display: "inline-block",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: 2,
      p: 3,
      color: "background",
      bg: "text",
      borderRadius: 8,
      "&:hover, &:focus": {
        color: "background",
        bg: "primary",
      },
    },
    buttonLink: {
      display: "inline-block",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: 2,
      px: 2,
      py: 1,
      color: "text",
      bg: "transparent",
      border: "1px solid",
      borderColor: "transparent",
      borderRadius: 8,
      "&:hover, &:focus": {
        textDecoration: "underline",
        borderColor: "darken",
      },
    },
    nav: {
      display: "block",
      mr: 2,
      px: 3,
      py: 1,
      color: "inherit",
      textAlign: "center",
      textDecoration: "none",
      fontSize: 1,
      fontWeight: "bold",
      bg: "muted",
      transitionProperty: "background-color",
      transitionTimingFunction: "ease-out",
      transitionDuration: ".2s",
      borderRadius: 8,
      "&:hover": {
        bg: "highlight",
      },
      "&.active": {
        color: "primary",
        bg: "highlight",
      },
    },
    basic: {
      color: "primary",
      fontSize: 1,
      fontWeight: "normal",
      textDecoration: "underline",
    },
  },
  badges: {
    primary: {
      color: "background",
    },
    highlight: {
      color: "text",
      bg: "highlight",
    },
    accent: {
      color: "background",
      bg: "accent",
    },
    outline: {
      color: "primary",
      bg: "transparent",
      boxShadow: "inset 0 0 0 1px",
    },
    circle: {
      height: 16,
      minWidth: 16,
      lineHeight: "16px",
      textAlign: "center",
      borderRadius: 9999,
    },
  },
  images: {
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 8,
    },
  },
  cards: {
    primary: {
      padding: [3, 4],
      bg: "muted",
      borderRadius: 10,
    },
    game: {
      variant: "cards.primary",
      padding: [1, 2, null],
      height: [64, 90, null],
      position: "relative",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  forms: {
    label: {
      fontSize: 1,
      fontWeight: "bold",
    },
    input: {
      fontFamily: "monospace",
      borderColor: "lightgray",
      borderRadius: 8,
      "&:focus": {
        borderColor: "primary",
        boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
        outline: "none",
      },
    },
    select: {
      fontFamily: "monospace",
      borderColor: "lightgray",
      borderRadius: 8,
      "&:focus": {
        borderColor: "primary",
        boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
        outline: "none",
      },
    },
    textarea: {
      fontFamily: "monospace",
      borderColor: "lightgray",
      borderRadius: 8,
      "&:focus": {
        borderColor: "primary",
        boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
        outline: "none",
      },
    },
    slider: {
      bg: "muted",
    },
  },
  alerts: {
    primary: {
      color: "background",
    },
    secondary: {
      color: "background",
      bg: "secondary",
    },
    accent: {
      color: "background",
      bg: "accent",
    },
    highlight: {
      color: "text",
      bg: "highlight",
    },
  },
  messages: {
    dark: {
      color: "text",
      borderLeftColor: "text",
      bg: "muted",
    },
    success: {
      color: "#257942",
      borderLeftColor: "#48c774",
      bg: "#effaf3",
    },
    danger: {
      color: "#cc0f35",
      borderLeftColor: "#f14668",
      bg: "#feecf0",
    },
  },
  layout: {
    container: {
      p: 3,
    },
  },
  styles: {
    root: {
      margin: 0,
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
    img: {
      maxWidth: "100%",
      height: "auto",
    },
    h1: {
      variant: "text.display",
    },
    h2: {
      variant: "text.heading",
      fontSize: 5,
    },
    h3: {
      variant: "text.heading",
      fontSize: 4,
    },
    h4: {
      variant: "text.heading",
      fontSize: 3,
    },
    h5: {
      variant: "text.heading",
      fontSize: 2,
    },
    h6: {
      variant: "text.heading",
      fontSize: 1,
    },
    a: {
      color: "text",
      fontWeight: "bold",
      textDecoration: "none",
    },
    pre: {
      fontFamily: "monospace",
      fontSize: 1,
      p: 3,
      color: "text",
      bg: "muted",
      overflow: "auto",
      code: {
        color: "inherit",
      },
      variant: "prism",
    },
    code: {
      fontFamily: "monospace",
      fontSize: 1,
    },
    inlineCode: {
      fontFamily: "monospace",
      color: "secondary",
      bg: "muted",
    },
    table: {
      width: "100%",
      my: 4,
      borderCollapse: "separate",
      borderSpacing: 0,
      [["th", "td"]]: {
        textAlign: "left",
        py: "4px",
        pr: "4px",
        pl: 0,
        borderColor: "muted",
        borderBottomStyle: "solid",
      },
    },
    th: {
      verticalAlign: "bottom",
      borderBottomWidth: "2px",
    },
    td: {
      verticalAlign: "top",
      borderBottomWidth: "1px",
    },
    hr: {
      border: 0,
      borderBottom: "2px solid",
      borderColor: "muted",
    },
    xray: {
      "*": {
        outline: "1px solid rgba(0, 192, 255, .25)",
      },
    },
    navlink: {
      display: "inline-block",
      fontWeight: "bold",
      color: "inherit",
      textDecoration: "none",
      ":hover,:focus": {
        color: "primary",
      },
    },
  },
}
