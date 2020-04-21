import { sampleSize, shuffle } from "lodash-es"
import { WORDS } from "./words"

export const CARD_TYPE = {
  RED: "red",
  BLUE: "blue",
  BYSTANDER: "bystander",
  ASSASSIN: "assassin",
}

export function generateGame(corpus = WORDS) {
  const words = sampleSize(corpus, 25)
  const player1 = Math.random() < 0.5 ? CARD_TYPE.RED : CARD_TYPE.BLUE
  const player2 = nextPlayer(player1)

  const cards = words.map((word, i) => {
    let label
    if (i === 0) label = CARD_TYPE.ASSASSIN
    else if (i < 10) label = player1
    else if (i < 18) label = player2
    else label = CARD_TYPE.BYSTANDER
    return { word, label, selected: false }
  })

  return {
    cards: shuffle(cards),
    currentPlayer: player1,
  }
}

export function nextPlayer(current) {
  return current === CARD_TYPE.RED ? CARD_TYPE.BLUE : CARD_TYPE.RED
}
