# SPACEY

A Vue app that plays some randomized spacey music, shows a starfield, and has a profile card.

The starfield is implemented with HTML canvas, and the music is implemented with [Tone.js](https://tonejs.github.io/). Read on for more details.

Get started:

```bash
cd spacey
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

## Starfield Animation

The starfield animation is done with this code:

```js
  // Create stars
  const stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 3 + 1
  }))
  
  // Animation function
  function animate() {
    ctx.fillStyle = 'rgba(24,24,36,0.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    stars.forEach(star => {
      star.x = (star.x + star.speed) % canvas.width
      ctx.fillStyle = 'white'
      ctx.fillRect(star.x, star.y, 2, 2)
    })
    
    requestAnimationFrame(animate)
```

## Spacey Chiptune Generator

First off, I'm not claiming this is the definitive guide to procedural audio. It's just what I know after tinkering with this stuff. And I get it, when you're starting out, getting bombarded with a million different options is overwhelming. Been there.

### How I Got Started with This

Back in the day, I was messing around with some visual animations and thought, "Man, this starfield would be so much cooler with the right soundtrack." I didn't want to just slap on some random MP3, I wanted something that would feel unique each time.

### The Building Blocks

This is how I make my spacey tunes, from easiest to hardest.

### Tone.js: Your New Best Friend

If you're trying to make audio in the browser, [Tone.js](https://tonejs.github.io/) is built to be simple. And I prefer simple!

```javascript
import * as Tone from 'tone'

// This gets you a basic square wave - that classic 8-bit sound
const synth = new Tone.Synth({
  oscillator: { type: "square" },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.5
  }
}).toDestination()

// Play a single note - that's it!
synth.triggerAttackRelease("C4", "8n")
```

Even with just this, you'd be surprised what you can make. But it's when you start adding effects that things get interesting.

### Effects Chain: Space-ifying Your Sound

To get that floaty, ethereal vibe, I stack up a few effects ([reverb](https://tonejs.github.io/docs/r13/Reverb), [delay](https://tonejs.github.io/docs/r13/FeedbackDelay), [filter](https://tonejs.github.io/docs/r13/Filter), [synth](https://tonejs.github.io/docs/r13/Synth)):

```javascript
// Reverb makes everything sound like it's in a massive cave
const reverb = new Tone.Reverb({
  decay: 5,
  wet: 0.5
}).toDestination()

// Delay gives you those echo repeats
const delay = new Tone.FeedbackDelay({
  delayTime: 0.3,
  feedback: 0.4,
  wet: 0.3
}).connect(reverb)

// A filter lets you shape the tone
const filter = new Tone.Filter({
  type: "lowpass",
  frequency: 2000,
  Q: 5
}).connect(delay)

// Hook your synth to this chain
const synth = new Tone.Synth({
  oscillator: { type: "square" }
}).connect(filter)
```

The real magic happens when you add an [LFO (Low Frequency Oscillator)](https://tonejs.github.io/docs/r13/LFO) to slowly sweep the filter:

```javascript
// This makes the sound wah-wah very slowly
const filterLFO = new Tone.LFO({
  frequency: 0.1,  // Super slow
  min: 500,
  max: 3000
}).connect(filter.frequency)
filterLFO.start()
```

Trust me, once you hear this in action, you'll get why it feels so spacey.

### Randomization: The Secret Sauce

Here's where it gets fun. Instead of hardcoding values, I let the computer pick random stuff:

```javascript
// Helper to get random numbers
const randomRange = (min, max) => min + Math.random() * (max - min)

// Now your synth is different every time!
const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    // Maybe square wave, maybe triangle, who knows?
    type: ["square", "triangle", "sine"][Math.floor(Math.random() * 3)]
  },
  envelope: {
    attack: randomRange(0.01, 0.05),
    decay: randomRange(0.1, 0.3),
    sustain: randomRange(0.2, 0.4),
    release: randomRange(0.4, 0.8)
  }
})
```

This is how you get a slightly different sound each time you fire it up. It keeps things fresh!

### The Musical Structure

I start with a basic [chord progression](https://en.wikipedia.org/wiki/Chord_progression):

```javascript
// This progression just feels spacey
const baseChords = [
  ["C4", "E4", "G4", "B4"],  // CMaj7
  ["A3", "C4", "E4", "G4"],  // Am7
  ["F3", "A3", "C4", "E4"],  // FMaj7
  ["G3", "B3", "D4", "F4"]   // G7
]
```

But to make it interesting, I don't just play the chords - I break them up into patterns:

```javascript
chords.forEach((chord, i) => {
  for (let j = 0; j < notesPerChord; j++) {
    // Sometimes skip notes
    if (Math.random() < 0.1) continue
    
    // Pick notes from the chord in different ways
    const noteIndex = Math.random() < 0.8 ? j % 4 : Math.floor(Math.random() * 4)
    
    // Sometimes bump notes up an octave
    const octaveShift = Math.random() < 0.7 ? Math.floor(j / 4) % 2 : Math.floor(Math.random() * 2)
    
    // And now you've got a melody that's never the same twice
  }
})
```

### Putting It All Together with Vue

I'm using Vue with Pinia for state management because it makes my life easier:

```javascript
export const useMusicStore = defineStore('music', () => {
  const isPlaying = ref(false)
  let synths = null
  let arpPart = null
  let bassPart = null

  async function start() {
    if (!synths) initializeMusic()
    await Tone.start()
    Tone.Transport.stop()
    Tone.Transport.position = 0
    arpPart.start(0)
    bassPart.start(0)
    Tone.Transport.start()
    isPlaying.value = true
  }

  function stop() {
    // You get the idea
  }

  return {
    isPlaying,
    start,
    stop,
    cleanup
  }
})
```

Then in my starfield component, I just hook it up:

```javascript
const togglePlay = async () => {
  if (!musicStore.isPlaying) {
    await musicStore.start()
  } else {
    musicStore.stop()
  }
}
```

That's it! Click a button, get instant space vibes.

### What I Learned

The best part about all this? You never hear the exact same tune twice. Every time someone clicks that play button, they get their own unique cosmic soundtrack. It has unexpected bass that rocks my car, I didn't even hear this while developing it until I played it on my phone and turned up the volume.

What started as "this would be cool" turned into a rabbit hole of Web Audio API, music theory, and Vue state management. But honestly, isn't that how all the best projects start?

If you build something with this approach, let me know! I'm always curious what kind of weird and wonderful audio people create.