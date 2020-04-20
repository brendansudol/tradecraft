import { sampleSize, shuffle } from "lodash-es"
import { WORDS } from "./words"

export function generateGame(corpus = WORDS) {
  const words = sampleSize(corpus, 25)
  const player1 = Math.random() < 0.5 ? "RED" : "BLUE"
  const player2 = nextPlayer(player1)

  const cards = words.map((word, i) => {
    let label
    if (i === 0) label = "BLACK"
    else if (i < 10) label = player1
    else if (i < 18) label = player2
    else label = "WHITE"
    return { word, label, selected: false }
  })

  return {
    cards: shuffle(cards),
    currentPlayer: player1,
  }
}

export function nextPlayer(current) {
  return current === "RED" ? "BLUE" : "RED"
}
