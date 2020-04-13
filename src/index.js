import React from "react"
import { render } from "react-dom"
import { ThemeProvider } from "theme-ui"
import { App } from "./components/App"
import { theme } from "./theme"

import "./index.css"

const Root = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)

render(<Root />, document.getElementById("root"))
