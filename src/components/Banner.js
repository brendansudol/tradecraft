import React from "react"
import { Flex } from "theme-ui"

export const Banner = React.memo(() => {
  return (
    <Flex
      mb={2}
      sx={{
        bg: "black",
        color: "white",
        height: 24,
        fontSize: 12,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Work in Progress!
    </Flex>
  )
})
