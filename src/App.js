import { sampleSize, shuffle } from "lodash-es"
import React, { useState } from "react"
import { Box, Card, Grid, Text } from "theme-ui"
import { WORDS } from "./words"

export function App() {
  const [game, setGame] = useState(newGame())
  const handleClick = () => setGame(newGame())
  const { current, cards } = game

  return (
    <Box>
      <button onClick={handleClick}>refresh</button>
      <Box my={2}>Turn: {current}</Box>
      <Grid gap={2} columns={[2, null, 5]}>
        {cards.map((card, i) => (
          <Card key={i} p={4} sx={{ textAlign: "center" }}>
            <Text>{card.word}</Text>
            <Text sx={{ fontSize: 10 }}>{card.label}</Text>
          </Card>
        ))}
      </Grid>
    </Box>
  )
}

function newGame(corpus = WORDS) {
  const words = sampleSize(corpus, 25)
  const first = Math.random() < 0.5 ? "RED" : "BLUE"
  const second = first === "RED" ? "BLUE" : "RED"

  const cards = words.map((word, i) => {
    let label
    if (i === 0) label = "BLACK"
    else if (i < 10) label = first
    else if (i < 18) label = second
    else label = "WHITE"
    return { word, label }
  })

  return {
    cards: shuffle(cards),
    current: first,
    turns: [],
  }
}
