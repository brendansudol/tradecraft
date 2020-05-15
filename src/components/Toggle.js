import React from "react"
import styles from "./Toggle.module.css"

export const Toggle = React.memo(({ checked = false }) => {
  return (
    <div className={styles.toggle}>
      <input
        type="checkbox"
        className={styles.toggleInput}
        id="switch"
        checked={checked}
        readOnly={true}
      />
      <label className={styles.toggleLabel} htmlFor="switch" />
    </div>
  )
})
