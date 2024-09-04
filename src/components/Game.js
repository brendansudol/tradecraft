import Tippy from "@tippyjs/react"
import { capitalize } from "lodash-es"
import React, { useEffect, useMemo, useReducer } from "react"
import { GoCheck as CheckIcon } from "react-icons/go"
import { IoSparkles as SparklesIcon } from "react-icons/io5"
import { useParams, useHistory } from "react-router-dom"
import { Box, Button, Card, Flex, Grid, Text } from "theme-ui"
import { db } from "../utils/db"
import { CARD_TYPE, generateGame, nextPlayer } from "../utils/game"
import { useHash } from "../utils/hooks"
import { Header } from "./Header"
import { Loading } from "./Loading"
import { Modal } from "./Modal"
import { ShareButton } from "./ShareButton"
import { TimerButton } from "./TimerButton"

export function Game() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const { game, hint, isSpy, isSpyConfirmOpen, isNewGameConfirmOpen } = state
  const { currentPlayer, hitAssassin, timerStartedAt, dictionary } = game ?? {}
  const cards = game?.cards ?? []
  const isEmojiGame = dictionary === "emoji"

  const history = useHistory()
  const { id: gameId } = useParams()
  const hash = useHash()

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

  useEffect(() => {
    function update(snapshot) {
      const game = snapshot.val()
      if (game == null) return history.push("/", { invalidGameId: true })
      dispatch({ type: "UPDATE_GAME", game })
    }

    const ref = db.child(`/${gameId}`)
    ref.on("value", update)

    return () => ref.off("value", update)
    // eslint-disable-next-line
  }, [])

  const handleRefresh = () => {
    db.update({
      [gameId]: generateGame({
        exclude: cards.map((card) => card.word),
        useEmojis: hash === "✨",
      }),
    })
  }

  const handleEndTurn = async () => {
    await db.child(`/${gameId}`).update({
      currentPlayer: nextPlayer(currentPlayer),
      timerStartedAt: 0,
    })
  }

  const handleClickCard = (idx) => async () => {
    const card = cards[idx]
    if (card.selected) return

    const endTurn = card.label !== currentPlayer
    const hitAssassin = card.label === CARD_TYPE.ASSASSIN

    await db.child(`/${gameId}`).update({
      [`cards/${idx}/selected`]: true,
      ...(hitAssassin && { hitAssassin: currentPlayer }),
      ...(endTurn && {
        currentPlayer: nextPlayer(currentPlayer),
        timerStartedAt: 0,
      }),
    })
  }

  const handleStartTimer = async () => {
    await db.child(`/${gameId}`).update({
      timerStartedAt: Date.now(),
    })
  }

  const handleOpenNewGameConfirm = (shouldOpen) => {
    dispatch({ type: "NEW_GAME", shouldOpen })
  }

  const handleGetHint = async () => {
    const game = { turn: currentPlayer, board: cards }
    const setHint = (hint) => dispatch({ type: "UPDATE_HINT", hint })

    try {
      setHint({ type: "LOADING" })
      const response = await fetch("https://zigzagzig.vercel.app/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game }),
      })
      const data = await response.json()
      setHint({ type: "LOADED", value: data.result })
    } catch (error) {
      console.warn(error)
      setHint({ type: "FAILED" })
    }
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
            <Text mr={1}>, Turn:</Text>
            <Text sx={{ color: currentPlayer, fontWeight: "bold" }}>
              {capitalize(currentPlayer)}
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
            isEmoji={isEmojiGame}
            isSpy={isSpy}
            onClick={isSpy ? undefined : handleClickCard(i)}
          />
        ))}
      </Grid>

      <Flex sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Flex sx={{ alignItems: "center" }}>
          <Button variant="outline" onClick={handleEndTurn}>
            End turn
          </Button>
        </Flex>
        <Flex sx={{ alignItems: "center", gap: 2 }}>
          <Box>
            <HintButton hint={hint} onClick={handleGetHint} />
          </Box>
          <Box>
            <TimerButton timerStartedAt={timerStartedAt} onClick={handleStartTimer} />
          </Box>
          <Box>
            <Button variant="outline" onClick={() => dispatch({ type: "SPY_CLICK" })}>
              Spymaster
            </Button>
            <Modal
              isOpen={isSpyConfirmOpen}
              onClose={() => dispatch({ type: "SPY_CONFIRM", value: false })}
            >
              <Box p={2}>
                <Text variant="heading" mb={3}>
                  Are you the spymaster?
                </Text>
                <Box>
                  <Button onClick={() => dispatch({ type: "SPY_CONFIRM", value: true })}>
                    Yes, proceed
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
          <Box>
            <Button variant="outline" onClick={() => handleOpenNewGameConfirm(true)}>
              New game
            </Button>
            <Modal isOpen={isNewGameConfirmOpen} onClose={() => handleOpenNewGameConfirm(false)}>
              <Box p={2}>
                <Text variant="heading" mb={3}>
                  Are you sure?
                </Text>
                <Box>
                  <Button
                    onClick={() => {
                      handleRefresh()
                      handleOpenNewGameConfirm(false)
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

export const GameCard = React.memo(({ card, isEmoji, isSpy, onClick }) => {
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
      <Text variant={isEmoji ? "emoji" : "game"}>{word}</Text>
      {showCheck && (
        <Box m={1} sx={{ position: "absolute", top: 0, right: 0 }}>
          <CheckIcon size={18} className="icon" />
        </Box>
      )}
    </Card>
  )
})

export const HintButton = React.memo(({ hint, onClick }) => {
  const isLoading = hint.type === "LOADING"
  const isReady = hint.type === "FAILED" || hint.type === "LOADED"

  return (
    <Tippy
      content={
        <Box px={1} py={2} sx={{ width: 300, maxHeight: 300 }}>
          <Text variant="heading" sx={{ mb: 1, fontSize: 2 }}>
            Need some help?
          </Text>
          <Text mb={2}>Get an AI-generated clue suggestion for the current turn.</Text>
          <Button onClick={onClick} disabled={isLoading}>
            {isLoading ? "Loading..." : "Get clue"}
          </Button>
          {isReady && (
            <Box sx={{ whiteSpace: "pre-wrap", mt: 2 }}>
              {hint.value ??
                "Sorry! There was a problem generating a suggestion. Please try again soon."}
            </Box>
          )}
        </Box>
      }
      interactive={true}
      theme="light"
      trigger="click"
    >
      <Button variant="outline">
        <SparklesIcon size={16} />
      </Button>
    </Tippy>
  )
})

const INITIAL_STATE = {
  game: null,
  hint: { type: "NOT_STARTED" },
  isSpy: false,
  isSpyConfirmOpen: false,
  isNewGameConfirmOpen: false,
}

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_GAME":
      const isNew = state.game?.startedAt !== action.game?.startedAt
      return {
        ...state,
        game: action.game,
        hint: isNew ? INITIAL_STATE.hint : state.hint,
        isSpy: isNew ? INITIAL_STATE.isSpy : state.isSpy,
      }
    case "UPDATE_HINT":
      return {
        ...state,
        hint: action.hint,
      }
    case "NEW_GAME":
      return {
        ...state,
        isNewGameConfirmOpen: action.shouldOpen,
      }
    case "SPY_CLICK":
      if (state.isSpy) return { ...state, isSpy: false }
      else return { ...state, isSpyConfirmOpen: true }
    case "SPY_CONFIRM":
      return {
        ...state,
        isSpy: action.value,
        isSpyConfirmOpen: false,
      }
    default:
      return state
  }
}
