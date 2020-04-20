import React from "react"
import { useLocation } from "react-router-dom"
import { Alert, Box } from "theme-ui"

export const Lobby = React.memo(() => {
  const location = useLocation()
  const { fromInvalidGame } = location.state ?? {}

  return (
    <Box sx={{ p: 3, mx: "auto", maxWidth: 700 }}>
      {fromInvalidGame && (
        <Alert>Whoops! Invalid game ID. Please try again.</Alert>
      )}
      <h2>Lobby - stay tuned!!</h2>
    </Box>
  )
})
