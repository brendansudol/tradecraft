import React, { useEffect, useMemo, useState } from "react"
import { GoCheck as CheckIcon } from "react-icons/go"
import { useParams, useHistory } from "react-router-dom"
import { Box, Button, Card, Flex, Grid, Text } from "theme-ui"
import { db } from "../utils/db"
import { CARD_TYPE, generateGame, nextPlayer } from "../utils/game"
import { Header } from "./Header"
import { Loading } from "./Loading"
import { Modal } from "./Modal"

export function Game() {
  const [game, setGame] = useState(null)
  const [mode, setMode] = useState("GUESSER")
  const [isModeModalOpen, setIsModeModalOpen] = useState(false)
  const [isRefreshModalOpen, setIsRefreshModalOpen] = useState(false)

  const history = useHistory()
  const { id: gameId } = useParams()

  const cards = game?.cards ?? []
  const currentPlayer = game?.currentPlayer

  useEffect(() => {
    function onValue(snapshot) {
      const game = snapshot.val()
      if (game == null) return history.push("/", { invalidGameId: true })
      setGame(game)
    }

    const ref = db.child(`/${gameId}`)
    ref.on("value", onValue)

    return () => ref.off("value", onValue)
    // eslint-disable-next-line
  }, [])

  const handleRefresh = () => {
    const lastWords = cards.map((card) => card.word)
    db.update({ [gameId]: generateGame({ exclude: lastWords }) })
    setMode("GUESSER")
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

  const isSpy = useMemo(() => mode === "SPY", [mode])

  if (!game) return <Loading />

  return (
    <Box sx={{ p: [2, 3], mx: "auto", maxWidth: 750 }}>
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
        {game.cards.map((card, i) => (
          <GameCard
            key={card.word}
            card={card}
            isSpy={isSpy}
            onClick={isSpy ? undefined : handleClick(i)}
          />
        ))}
      </Grid>
      <Flex
        mb={2}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Box>
          <Button
            variant="small"
            onClick={isSpy ? handleToggleMode : () => setIsModeModalOpen(true)}
          >
            Toggle spymaster view
          </Button>
          <Modal
            isOpen={isModeModalOpen}
            onClose={() => setIsModeModalOpen(false)}
          >
            <Box p={1}>
              <Box mb={2}>Are you the spymaster?</Box>
              <Box>
                <Button
                  variant="smallDark"
                  onClick={() => {
                    handleToggleMode()
                    setIsModeModalOpen(false)
                  }}
                >
                  Yes, proceed
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
        <Box>
          <Button variant="small" onClick={() => setIsRefreshModalOpen(true)}>
            New game
          </Button>
          <Modal
            isOpen={isRefreshModalOpen}
            onClose={() => setIsRefreshModalOpen(false)}
          >
            <Box p={1}>
              <Box mb={2}>Are you sure?</Box>
              <Box>
                <Button
                  variant="smallDark"
                  onClick={() => {
                    handleRefresh()
                    setIsRefreshModalOpen(false)
                  }}
                >
                  Yes, start a new game
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Flex>
    </Box>
  )
}

export const GameCard = React.memo(({ card, isSpy, onClick }) => {
  const { label, selected, word } = card
  const showLabel = isSpy || selected
  const showCheck = isSpy && selected

  return (
    <Card
      variant="game"
      onClick={onClick}
      sx={{
        ...(showLabel && {
          bg: label,
          color: label === CARD_TYPE.BYSTANDER ? "black" : "white",
          "&:hover": { cursor: "default" },
        }),
      }}
    >
      <Text variant="game">{word}</Text>
      {showCheck && (
        <Box m={1} sx={{ position: "absolute", top: 0, right: 0 }}>
          <CheckIcon size={18} className="icon" />
        </Box>
      )}
    </Card>
  )
})
