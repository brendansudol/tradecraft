import React, { useEffect, useMemo, useState } from "react"
import { GoCheck as CheckIcon } from "react-icons/go"
import { useParams, useHistory } from "react-router-dom"
import { Box, Button, Card, Flex, Grid, Text } from "theme-ui"
import { db } from "../utils/db"
import { CARD_TYPE, generateGame, nextPlayer } from "../utils/game"
import { Header } from "./Header"
import { Loading } from "./Loading"
import { Modal } from "./Modal"
import { ShareButton } from "./ShareButton"
import { TimerButton } from "./TimerButton"

export function Game() {
  const [game, setGame] = useState(null)
  const [mode, setMode] = useState("GUESSER")
  const [isModeModalOpen, setIsModeModalOpen] = useState(false)
  const [isRefreshModalOpen, setIsRefreshModalOpen] = useState(false)

  const history = useHistory()
  const { id: gameId } = useParams()

  const cards = game?.cards ?? []
  const { currentPlayer, hitAssassin, timerStarted } = game ?? {}

  useEffect(() => {
    function update(snapshot) {
      const game = snapshot.val()
      if (game == null) return history.push("/", { invalidGameId: true })
      setGame(game)
    }

    const ref = db.child(`/${gameId}`)
    ref.on("value", update)

    return () => ref.off("value", update)
    // eslint-disable-next-line
  }, [])

  const score = useMemo(() => {
    let [red, blue] = [0, 0]
    for (const card of cards) {
      if (card.selected) continue
      if (card.label === CARD_TYPE.RED) red++
      else if (card.label === CARD_TYPE.BLUE) blue++
    }
    return { red, blue }
  }, [cards])

  const winner = useMemo(() => {
    if (hitAssassin) return nextPlayer(hitAssassin)
    if (score.red === 0) return CARD_TYPE.RED
    if (score.blue === 0) return CARD_TYPE.BLUE
  }, [hitAssassin, score])

  const isSpy = useMemo(() => mode === "SPY", [mode])

  const handleRefresh = () => {
    const lastWords = cards.map((card) => card.word)
    db.update({ [gameId]: generateGame({ exclude: lastWords }) })
    setMode("GUESSER")
  }

  const handleToggleMode = () => {
    setMode((prev) => (prev === "GUESSER" ? "SPY" : "GUESSER"))
  }

  const handleStartTimer = async () => {
    await db.child(`/${gameId}`).update({ timerStarted: Date.now() })
  }

  const handleEndTurn = async () => {
    await db.child(`/${gameId}`).update({
      currentPlayer: nextPlayer(currentPlayer),
      timerStarted: 0,
    })
  }

  const handleClick = (idx) => async () => {
    const card = cards[idx]

    if (card.selected) return

    const endTurn = card.label !== currentPlayer
    const hitAssassin = card.label === CARD_TYPE.ASSASSIN

    await db.child(`/${gameId}`).update({
      [`cards/${idx}/selected`]: true,
      ...(hitAssassin && { hitAssassin: currentPlayer }),
      ...(endTurn && {
        currentPlayer: nextPlayer(currentPlayer),
        timerStarted: 0,
      }),
    })
  }

  if (!game) return <Loading />

  return (
    <Box>
      <Header animate={Math.floor((score.red + score.blue) / 6)} />

      <Flex
        mb={3}
        sx={{
          alignItems: "flex-end",
          justifyContent: "space-between",
          fontSize: [1, 2],
        }}
      >
        {winner ? (
          <Text sx={{ color: winner, fontWeight: "bold" }}>
            {`${winner} team wins!`.toUpperCase()}
          </Text>
        ) : (
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
        )}
        <ShareButton />
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

      <Flex sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Flex sx={{ alignItems: "center" }}>
          <Button mr={2} variant="outline" onClick={handleEndTurn}>
            End turn
          </Button>
          <TimerButton timerStarted={timerStarted} onClick={handleStartTimer} />
        </Flex>
        <Flex sx={{ alignItems: "center" }}>
          <Box mr={2}>
            <Button
              variant="outline"
              onClick={
                isSpy ? handleToggleMode : () => setIsModeModalOpen(true)
              }
            >
              <Text variant="smScreen">Spymaster</Text>
              <Text variant="lgScreen">Toggle spymaster</Text>
            </Button>
            <Modal
              isOpen={isModeModalOpen}
              onClose={() => setIsModeModalOpen(false)}
            >
              <Box p={2}>
                <Text variant="heading" mb={3}>
                  Are you the spymaster?
                </Text>
                <Box>
                  <Button
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
            <Button
              variant="outline"
              onClick={() => setIsRefreshModalOpen(true)}
            >
              New game
            </Button>
            <Modal
              isOpen={isRefreshModalOpen}
              onClose={() => setIsRefreshModalOpen(false)}
            >
              <Box p={2}>
                <Text variant="heading" mb={3}>
                  Are you sure?
                </Text>
                <Box>
                  <Button
                    onClick={() => {
                      handleRefresh()
                      setIsRefreshModalOpen(false)
                    }}
                  >
                    Yes, start new game
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        </Flex>
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
