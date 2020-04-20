import React, { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { Box, Card, Flex, Grid, Heading, Text } from "theme-ui"
import { db } from "../utils/db"
import { generateGame, nextPlayer } from "../utils/game"
import { Banner } from "./Banner"
import { Loading } from "./Loading"

export function Game() {
  const [game, setGame] = useState(null)
  const [mode, setMode] = useState("GUESSER")

  const history = useHistory()
  const { id: gameId } = useParams()
  const { cards, currentPlayer } = game ?? {}

  useEffect(() => {
    // db.update({ [GAME_ID]: newGame() })

    db.child(`/${gameId}`).on("value", (snapshot) => {
      const game = snapshot.val()

      if (game == null) {
        return history.push("/", { fromInvalidGame: true })
      }

      console.log("game update!", game)
      setGame(game)
    })

    // eslint-disable-next-line
  }, [])

  const handleRefresh = () => {
    db.update({ [gameId]: generateGame() })
  }

  const handleToggleMode = () => {
    setMode((prev) => (prev === "GUESSER" ? "SPY" : "GUESSER"))
  }

  const handleEndTurn = async () => {
    await db.child(`/${gameId}`).update({
      currentPlayer: nextPlayer(game.currentPlayer),
    })
  }

  const handleClick = (idx) => async () => {
    const card = cards[idx]

    if (card.selected) return

    const shouldEndTurn = card.label !== currentPlayer
    await db.child(`/${gameId}`).update({
      [`/cards/${idx}/selected`]: true,
      ...(shouldEndTurn && { "/currentPlayer": nextPlayer(currentPlayer) }),
    })
  }

  if (!game) return <Loading />

  return (
    <Box>
      <Banner />
      <Box p={3} sx={{ maxWidth: 700, mx: "auto" }}>
        <Heading mb={3} variant="display" sx={{ textAlign: "center" }}>
          tradecraft
        </Heading>
        <Flex
          mb={2}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Flex sx={{ alignItems: "center" }}>
            <Text mr={2} sx={{ fontSize: 1 }}>
              Current turn: {game.currentPlayer}
            </Text>
            <button onClick={handleEndTurn}>end turn</button>
          </Flex>
          <Box>Score: TODO</Box>
        </Flex>
        <Grid mb={2} gap={2} columns={5} sx={{ fontSize: [1, 2, 3] }}>
          {game.cards.map((card, i) =>
            mode === "GUESSER" ? (
              <Card
                key={card.word}
                variant="game"
                sx={{
                  ...(card.selected && {
                    ...colorMap[card.label],
                    "&:hover": { cursor: "default" },
                  }),
                }}
                onClick={handleClick(i)}
              >
                <Text variant="game">{card.word}</Text>
                <Text sx={{ fontSize: 10 }}>{card.label}</Text>
              </Card>
            ) : (
              <Card key={card.word} variant="game" sx={colorMap[card.label]}>
                <Text variant="game">{card.word}</Text>
              </Card>
            )
          )}
        </Grid>
        <Flex
          mb={2}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Flex sx={{ alignItems: "center" }}>
            <Text mr={2} sx={{ fontSize: 1 }}>
              Toggle mode
            </Text>
            <button onClick={handleToggleMode}>{mode}</button>
          </Flex>
          <Box>
            <button onClick={handleRefresh}>new game</button>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

const colorMap = {
  RED: { bg: "#fd5e53", color: "#ffffff" },
  BLUE: { bg: "#3273dc", color: "#ffffff" },
  WHITE: { bg: "#f6eec9", color: "#111111" },
  BLACK: { bg: "#111111", color: "#ffffff" },
}

// const BG_COLOR_MAP = {
//   RED: "#FF4136",
//   BLUE: "#0074D9",
//   WHITE: "#DDDDDD",
//   BLACK: "#111111",
// }
