import React from "react"
import { render } from "react-dom"
import { Box, ThemeProvider } from "theme-ui"
import { App } from "./App"
import { theme } from "./theme"

import "./index.css"

const Root = () => (
  <ThemeProvider theme={theme}>
    <Box p={3}>
      <App />
    </Box>
  </ThemeProvider>
)

render(<Root />, document.getElementById("root"))
