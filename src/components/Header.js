import React from "react"
import { Heading } from "theme-ui"
import { morph } from "../utils/morphText"

const TITLE = "tradecraft"

export const Header = React.memo(() => {
  const handleTextMorph = (el) => {
    if (el) morph(el, TITLE)
  }

  return (
    <Heading
      mb={3}
      variant="display"
      sx={{ textAlign: "center" }}
      ref={handleTextMorph}
    >
      {TITLE}
    </Heading>
  )
})
