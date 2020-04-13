const GLYPHS = [
  "█",
  "▓",
  "▒",
  "░",
  "█",
  "▓",
  "▒",
  "░",
  "█",
  "▓",
  "▒",
  "░",
  "<",
  ">",
  "/",
]

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sample(arr) {
  return arr[rand(0, arr.length - 1)]
}

function includes(collection, value) {
  return collection.indexOf(value) > -1
}

function nonsense(n) {
  return Array(n)
    .fill(0)
    .map(() => sample(GLYPHS))
    .join("")
}

function tick(current, output) {
  const curr = current.split("")
  const out = output.split("")

  if (curr.length > out.length) curr.pop()
  if (curr.length < out.length) curr.push(sample(GLYPHS))

  const hits = curr
    .map((d, i) => (includes(GLYPHS, d) ? i : -1))
    .filter((d) => d > -1)

  if (curr.length === out.length) {
    const i = rand(0, hits.length - 1)
    const j = hits[i]
    curr[j] = out[j]
    hits.splice(i, 1)
  }

  for (let i = 0; i < hits.length; i++) {
    curr[hits[i]] = sample(GLYPHS)
  }

  return curr.join("")
}

function update(el, output) {
  const curr = el.textContent
  if (curr === output) return
  el.textContent = tick(curr, output)
  setTimeout(() => update(el, output), 100)
}

export function morph(el, output) {
  el.textContent = nonsense(output.length)
  update(el, output)
}
