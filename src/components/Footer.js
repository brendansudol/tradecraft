import React from "react"
import { Link as RRLink } from "react-router-dom"
import { Box, Divider, Link } from "theme-ui"

export const Footer = React.memo(() => {
  return (
    <Box as="footer" mt={[4, 5]}>
      <Divider />
      <Box mx={-2} sx={{ display: [null, "flex"], alignItems: "baseline" }}>
        <Link variant="buttonLink" sx={{ fontSize: [2, 3] }} as={RRLink} to="/">
          tradecraft
        </Link>
        <Box sx={{ mx: "auto" }} />
        <Link
          variant="buttonLink"
          sx={{ fontSize: 0, fontWeight: "normal" }}
          target="_blank"
          href="https://twitter.com/brensudol"
        >
          Made by <strong>@brensudol</strong>
        </Link>
        <Link
          variant="buttonLink"
          sx={{ fontSize: 0, fontWeight: "normal" }}
          target="_blank"
          href="https://github.com/brendansudol/tradecraft"
        >
          Code on <strong>GitHub</strong>
        </Link>
      </Box>
    </Box>
  )
})
