import Haikunator from "haikunator"
import React, { useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { Alert, Box, Button, Card, Flex, Grid, Input, Text } from "theme-ui"
import { db } from "../utils/db"
import { generateGame } from "../utils/game"
import { Header } from "./Header"

const haikunator = new Haikunator()
const getRandomId = () => haikunator.haikunate()

export const Lobby = React.memo(() => {
  const [query, setQuery] = useState("")

  const history = useHistory()
  const location = useLocation()
  const { invalidGameId } = location.state ?? {}

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.length) history.push(`/game/${query.toLowerCase()}`)
  }

  const handleNewGame = async () => {
    const randomId = getRandomId()
    await db.update({ [randomId]: generateGame() })
    history.push(`/game/${randomId}`)
  }

  return (
    <Box>
      <Header showSubtitle={true} />
      {invalidGameId && (
        <Alert
          sx={{
            display: "block",
            bg: "text",
            fontSize: [0, 1],
            textAlign: "center",
          }}
        >
          Invalid game ID. Please try again.
        </Alert>
      )}
      <Grid pt={3} gap={3} columns={[1, 2, null]}>
        <Card>
          <Text variant="heading" sx={{ mb: 3, fontSize: [2, 3] }}>
            Join existing game
          </Text>
          <Box mb={3} as="form" onSubmit={handleSubmit}>
            <Flex mx={-1} sx={{ alignItems: "center" }}>
              <Box px={1} sx={{ flex: "1 1 auto" }}>
                <Input
                  id="gameId"
                  name="gameId"
                  placeholder="Enter game id..."
                  sx={{ bg: "background" }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Box>
              <Box px={1}>
                <Button type="submit">Join</Button>
              </Box>
            </Flex>
          </Box>
          <Text sx={{ fontSize: 1 }}>
            For example, <strong>fancy-cherry</strong> in{" "}
            <Text sx={{ textDecoration: "underline", wordBreak: "break-all" }}>
              tradecraft.fun/game/fancy-cherry
            </Text>
          </Text>
        </Card>
        <Card>
          <Text variant="heading" sx={{ mb: 3, fontSize: [2, 3] }}>
            Start new game
          </Text>
          <Button mb={3} sx={{ width: "100%" }} onClick={handleNewGame}>
            Start game
          </Button>
          <Text sx={{ fontSize: 1 }}>
            You’ll get a unique link that you can share with friends
          </Text>
        </Card>
      </Grid>
    </Box>
  )
})
