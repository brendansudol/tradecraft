import Tippy from "@tippyjs/react"
import React, { useEffect, useState } from "react"
import useCopyToClipboard from "react-use/lib/useCopyToClipboard"
import { Box, Button, Text } from "theme-ui"

export const ShareButton = React.memo(() => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const [_, copy] = useCopyToClipboard() // eslint-disable-line no-unused-vars

  useEffect(() => {
    if (isPopoverVisible) {
      const timer = setTimeout(() => setIsPopoverVisible(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isPopoverVisible])

  const handleClick = () => {
    copy(decodeURIComponent(window.location.href))
    setIsPopoverVisible(true)
  }

  return (
    <Box>
      <Tippy interactive={true} visible={isPopoverVisible} content="Copied!">
        <Button variant="outline" onClick={handleClick}>
          <Text variant="smScreen">Share game</Text>
          <Text variant="lgScreen">Share game link</Text>
        </Button>
      </Tippy>
    </Box>
  )
})
