import React from "react"
import { Link as RRLink } from "react-router-dom"
import { Box, Link, Text } from "theme-ui"
import { morph } from "../utils/morphText"

const TITLE = "tradecraft"

export const Header = React.memo(({ showSubtitle }) => {
  const handleTextMorph = (el) => {
    if (el) morph(el, TITLE)
  }

  return (
    <Box mb={[3, 4]} sx={{ textAlign: "center" }}>
      <Link
        ref={handleTextMorph}
        variant="buttonLink"
        sx={{ py: 0, fontSize: [4, 5], fontWeight: "display" }}
        as={RRLink}
        to="/"
      >
        {TITLE}
      </Link>
      {showSubtitle === true && <Text>a clandestine word game</Text>}
    </Box>
  )
})
