import { sampleSize, shuffle } from "lodash-es"
import React, { useState } from "react"
import { Box, Card, Flex, Grid, Heading, Text } from "theme-ui"
import { WORDS } from "../words"
import { morph } from "../utils/morphText"

const BG_COLOR_MAP = {
  RED: "tomato",
  BLUE: "blue",
  WHITE: "tan",
  BLACK: "black",
}

const HEADING = "codenamez"

export function App() {
  const [game, setGame] = useState(newGame())
  const [mode, setMode] = useState("GUESSER")

  // TODO (improve this logic)
  const handleTextMorph = (el) => {
    if (el) morph(el, HEADING)
  }

  const handleRefresh = () => setGame(newGame())

  const handleToggleMode = () => {
    setMode((prev) => (prev === "GUESSER" ? "SPY" : "GUESSER"))
  }

  const handleEndTurn = () => {
    setGame((prev) => ({
      ...prev,
      currentPlayer: nextPlayer(prev.currentPlayer),
    }))
  }

  const handleClick = (idx) => {
    setGame((prev) => {
      const { cards, currentPlayer, turns } = prev
      return {
        ...prev,
        cards: cards.map((c, i) =>
          i !== idx ? c : { ...c, clicked: currentPlayer }
        ),
        turns: [...turns, { player: currentPlayer, clicked: idx }],
      }
    })
  }

  return (
    <Box>
      <Wip />
      <Box p={3} sx={{ maxWidth: 700, mx: "auto" }}>
        <Heading
          mb={3}
          variant="display"
          sx={{ textAlign: "center" }}
          ref={handleTextMorph}
        >
          {HEADING}
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
                key={i}
                variant="game"
                sx={{
                  ...(card.clicked != null && {
                    bg: BG_COLOR_MAP[card.label],
                    color: "white",
                  }),
                }}
                onClick={() => handleClick(i)}
              >
                <Text variant="game">{card.word}</Text>
                <Text sx={{ fontSize: 10 }}>
                  {card.label} ({card.clicked ?? "--"})
                </Text>
              </Card>
            ) : (
              <Card
                key={i}
                variant="game"
                sx={{ bg: BG_COLOR_MAP[card.label], color: "white" }}
              >
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

function newGame(corpus = WORDS) {
  const words = sampleSize(corpus, 25)
  const player1 = Math.random() < 0.5 ? "RED" : "BLUE"
  const player2 = nextPlayer(player1)

  const cards = words.map((word, i) => {
    let label
    if (i === 0) label = "BLACK"
    else if (i < 10) label = player1
    else if (i < 18) label = player2
    else label = "WHITE"
    return { word, label, clicked: null }
  })

  return {
    cards: shuffle(cards),
    currentPlayer: player1,
    turns: [],
  }
}

function nextPlayer(current) {
  return current === "RED" ? "BLUE" : "RED"
}

const Wip = () => (
  <Flex
    mb={2}
    sx={{
      bg: "black",
      color: "white",
      height: 24,
      fontSize: 12,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Work in Progress!
  </Flex>
)
