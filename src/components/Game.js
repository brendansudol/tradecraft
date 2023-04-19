import Tippy from "@tippyjs/react"
import { capitalize } from "lodash-es"
import React, { useEffect, useMemo, useReducer } from "react"
import { GoCheck as CheckIcon } from "react-icons/go"
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
import { Toggle } from "./Toggle"

const initialState = {
  game: null,
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
        isSpy: isNew ? false : state.isSpy,
      }
    case "TOGGLE_IS_SPY":
      return {
        ...state,
        isSpy: !state.isSpy,
      }
    case "SPY_CONFIRM":
      return {
        ...state,
        isSpyConfirmOpen: action.isOpen,
      }
    case "NEW_GAME_CONFIRM":
      return {
        ...state,
        isNewGameConfirmOpen: action.isOpen,
      }
    default:
      return state
  }
}

export function Game() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { game, isSpy, isSpyConfirmOpen, isNewGameConfirmOpen } = state
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
    const lastWords = cards.map((card) => card.word)

    db.update({
      [gameId]: generateGame({
        exclude: lastWords,
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

  const handleCardClick = (idx) => async () => {
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
    await db.child(`/${gameId}`).update({ timerStartedAt: Date.now() })
  }

  const toggleIsSpy = () => dispatch({ type: "TOGGLE_IS_SPY" })
  const setSpyConfirm = (isOpen) => dispatch({ type: "SPY_CONFIRM", isOpen })
  const openSpyConfirm = () => setSpyConfirm(true)
  const closeSpyConfirm = () => setSpyConfirm(false)
  const confirmSpyConfirm = () => {
    toggleIsSpy()
    closeSpyConfirm()
  }

  const setNewGameConfirm = (isOpen) => dispatch({ type: "NEW_GAME_CONFIRM", isOpen })
  const openNewGameConfirm = () => setNewGameConfirm(true)
  const closeNewGameConfirm = () => setNewGameConfirm(false)
  const confirmNewGameConfirm = () => {
    handleRefresh()
    closeNewGameConfirm()
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
            onClick={isSpy ? undefined : handleCardClick(i)}
          />
        ))}
      </Grid>

      <Flex sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Flex sx={{ alignItems: "center" }}>
          <Box mr={2}>
            {winner == null ? (
              <Tippy content={`Current turn: ${currentPlayer.toUpperCase()}`}>
                <span>
                  <Toggle checked={currentPlayer === CARD_TYPE.BLUE} />
                </span>
              </Tippy>
            ) : (
              <Toggle disabled={true} />
            )}
          </Box>
          <Button variant="outline" onClick={handleEndTurn}>
            End turn
          </Button>
        </Flex>
        <Flex sx={{ alignItems: "center" }}>
          <Box mr={2}>
            <TimerButton timerStartedAt={timerStartedAt} onClick={handleStartTimer} />
          </Box>
          <Box mr={2}>
            <Button variant="outline" onClick={isSpy ? toggleIsSpy : openSpyConfirm}>
              Spymaster
            </Button>
            <Modal isOpen={isSpyConfirmOpen} onClose={closeSpyConfirm}>
              <Box p={2}>
                <Text variant="heading" mb={3}>
                  Are you the spymaster?
                </Text>
                <Box>
                  <Button onClick={confirmSpyConfirm}>Yes, proceed</Button>
                </Box>
              </Box>
            </Modal>
          </Box>
          <Box>
            <Button variant="outline" onClick={openNewGameConfirm}>
              New game
            </Button>
            <Modal isOpen={isNewGameConfirmOpen} onClose={closeNewGameConfirm}>
              <Box p={2}>
                <Text variant="heading" mb={3}>
                  Are you sure?
                </Text>
                <Box>
                  <Button onClick={confirmNewGameConfirm}>Yes, start new game</Button>
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
