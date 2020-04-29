import Tippy from "@tippyjs/react"
import React, { useEffect, useState } from "react"
import { IoIosAlarm as AlarmIcon } from "react-icons/io"
import { Box, Button, Text } from "theme-ui"
import { useTimer } from "use-timer"

export const TimerButton = React.memo(({ seconds = 60 }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)

  const { time, start, isRunning } = useTimer({
    initialTime: seconds,
    endTime: 0,
    timerType: "DECREMENTAL",
    onTimeOver: () => setIsPopoverVisible(true),
  })

  useEffect(() => {
    if (isPopoverVisible) {
      const timer = setTimeout(() => setIsPopoverVisible(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isPopoverVisible])

  const handleClick = () => {
    if (!isRunning) start()
  }

  return (
    <Box>
      <Tippy interactive={true} visible={isPopoverVisible} content="Time’s up!">
        <Button
          variant="outline"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={handleClick}
        >
          <AlarmIcon size={16} />
          {isRunning && <Text ml={1}>{String(time).padStart(3, "0")}</Text>}
        </Button>
      </Tippy>
    </Box>
  )
})
