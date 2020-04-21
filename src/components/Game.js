import React, { useEffect, useMemo, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { Box, Button, Card, Flex, Grid, Text } from "theme-ui"
import { db } from "../utils/db"
import { CARD_TYPE, generateGame, nextPlayer } from "../utils/game"
import { Header } from "./Header"
import { Loading } from "./Loading"

export function Game() {
  const [game, setGame] = useState(null)
  const [mode, setMode] = useState("GUESSER")

  const history = useHistory()
  const { id: gameId } = useParams()

  const cards = game?.cards ?? []
  const currentPlayer = game?.currentPlayer

  useEffect(() => {
    db.child(`/${gameId}`).on("value", (snapshot) => {
      const game = snapshot.val()
      if (game == null) {
        return history.push("/", { invalidGameId: true })
      }
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

  const score = useMemo(() => {
    let [red, blue] = [0, 0]
    for (const card of cards) {
      if (card.selected) continue
      if (card.label === CARD_TYPE.RED) red++
      else if (card.label === CARD_TYPE.BLUE) blue++
    }
    return { red, blue }
  }, [cards])

  if (!game) return <Loading />

  return (
    <Box sx={{ p: [2, 3], mx: "auto", maxWidth: 700 }}>
      <Header animate={Math.floor((score.red + score.blue) / 6)} />
      <Flex
        mb={3}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Flex>
          <Text mr={1}>Score:</Text>
          <Text sx={{ color: "red", fontWeight: "bold" }}>{score.red}</Text>
          <Text mx={1}>-</Text>
          <Text sx={{ color: "blue", fontWeight: "bold" }}>{score.blue}</Text>
          <Text mx={2}>/</Text>
          <Text mr={1}>Turn:</Text>
          <Text sx={{ color: currentPlayer, fontWeight: "bold" }}>
            {currentPlayer.toUpperCase()}
          </Text>
        </Flex>
        <Button variant="small" onClick={handleEndTurn}>
          End turn
        </Button>
      </Flex>
      <Grid mb={3} gap={2} columns={5} sx={{ fontSize: [1, 2, 3] }}>
        {game.cards.map((card, i) =>
          mode === "GUESSER" ? (
            <Card
              key={card.word}
              variant="game"
              sx={{
                ...(card.selected && {
                  ...getCardColors(card.label),
                  "&:hover": { cursor: "default" },
                }),
              }}
              onClick={handleClick(i)}
            >
              <Text variant="game">{card.word}</Text>
            </Card>
          ) : (
            <Card key={card.word} variant="game" sx={getCardColors(card.label)}>
              <Text variant="game">{card.word}</Text>
            </Card>
          )
        )}
      </Grid>
      <Flex
        mb={2}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Button variant="small" onClick={handleToggleMode}>
          Toggle Spymaster
        </Button>
        <Button variant="small" onClick={handleRefresh}>
          New game
        </Button>
      </Flex>
    </Box>
  )
}

function getCardColors(cardType) {
  return {
    bg: cardType,
    color: cardType === CARD_TYPE.BYSTANDER ? "black" : "white",
  }
}
