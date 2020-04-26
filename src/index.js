import React from "react"
import { render } from "react-dom"
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom"
import { Box, Container, ThemeProvider } from "theme-ui"
import { Footer } from "./components/Footer"
import { Lobby } from "./components/Lobby"
import { Game } from "./components/Game"
import { theme } from "./utils/theme"

import "./index.css"

const Root = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Container
        p={[2, 3]}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Box as="main" sx={{ width: "100%", flex: "1 1 auto" }}>
          <Switch>
            <Route exact path="/">
              <Lobby />
            </Route>
            <Route exact path="/game/:id">
              <Game />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Box>
        <Footer />
      </Container>
    </BrowserRouter>
  </ThemeProvider>
)

render(<Root />, document.getElementById("root"))
