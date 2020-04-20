import React from "react"
import { render } from "react-dom"
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom"
import { ThemeProvider } from "theme-ui"
import { Lobby } from "./components/Lobby"
import { Game } from "./components/Game"
import { theme } from "./utils/theme"

import "./index.css"

const Root = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
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
    </BrowserRouter>
  </ThemeProvider>
)

render(<Root />, document.getElementById("root"))
