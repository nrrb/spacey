import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as Tone from 'tone'

// Helper function to get random value within a range
const randomRange = (min, max) => min + Math.random() * (max - min)

// Helper function to randomly transpose notes
const transposeNotes = (notes, semitones) => {
  const noteMap = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  }
  const reverseNoteMap = Object.fromEntries(
    Object.entries(noteMap).map(([k, v]) => [v, k])
  )
  
  return notes.map(note => {
    const match = note.match(/([A-G]#?)(\d+)/)
    if (!match) return note
    
    const [_, noteName, octave] = match
    let noteValue = noteMap[noteName]
    let newOctave = parseInt(octave)
    
    noteValue += semitones
    while (noteValue >= 12) {
      noteValue -= 12
      newOctave++
    }
    while (noteValue < 0) {
      noteValue += 12
      newOctave--
    }
    
    return reverseNoteMap[noteValue] + newOctave
  })
}

// Utility functions for creating music
const createSynths = (echoAmount) => {
  // Randomize synth parameters
  const reverbDecay = randomRange(3, 7)
  const filterFreq = randomRange(1500, 2500)
  const filterQ = randomRange(3, 7)
  const lfoFreq = randomRange(0.05, 0.2)
  
  // Create a reverb effect
  const reverb = new Tone.Reverb({
    decay: reverbDecay,
    wet: randomRange(0.3, 0.6)
  }).toDestination()
  
  // Create a delay effect
  const delay = new Tone.FeedbackDelay({
    delayTime: randomRange(0.2, 0.4),
    feedback: echoAmount,
    wet: randomRange(0.2, 0.4)
  }).connect(reverb)

  // Create a filter for sweeping effects
  const filter = new Tone.Filter({
    type: "lowpass",
    frequency: filterFreq,
    Q: filterQ
  }).connect(delay)

  // Create main synth for arpeggios
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: ["square", "triangle", "sine"][Math.floor(Math.random() * 3)]
    },
    envelope: {
      attack: randomRange(0.01, 0.05),
      decay: randomRange(0.1, 0.3),
      sustain: randomRange(0.2, 0.4),
      release: randomRange(0.4, 0.8)
    }
  }).connect(filter)

  // Create bass synth
  const bassSynth = new Tone.Synth({
    oscillator: {
      type: ["triangle", "sine"][Math.floor(Math.random() * 2)]
    },
    envelope: {
      attack: randomRange(0.05, 0.1),
      decay: randomRange(0.2, 0.4),
      sustain: randomRange(0.6, 0.9),
      release: randomRange(0.8, 1.2)
    }
  }).connect(filter)

  // Set up a sweep LFO for the filter
  const filterLFO = new Tone.LFO({
    frequency: lfoFreq,
    min: randomRange(400, 600),
    max: randomRange(2500, 3500)
  }).connect(filter.frequency)
  filterLFO.start()

  return {
    synth,
    bassSynth,
    effects: { reverb, delay, filter, filterLFO }
  }
}

// Create arpeggio pattern
const createArpeggioPattern = (arpeggioSpeed, synth, isPlaying) => {
  // Base chord progression
  const baseChords = [
    ["C4", "E4", "G4", "B4"],
    ["A3", "C4", "E4", "G4"],
    ["F3", "A3", "C4", "E4"],
    ["G3", "B3", "D4", "F4"]
  ]
  
  // Randomly transpose the entire progression
  const transposition = Math.floor(randomRange(-3, 4)) // -3 to +3 semitones
  const chords = baseChords.map(chord => transposeNotes(chord, transposition))
  
  let notes = []
  const notesPerChord = arpeggioSpeed
  
  chords.forEach((chord, i) => {
    const startTime = i * notesPerChord * Tone.Time("8n").toSeconds()
    
    for (let j = 0; j < notesPerChord; j++) {
      // Vary the pattern to create interest
      const noteIndex = Math.random() < 0.8 ? j % 4 : Math.floor(Math.random() * 4)
      const octaveShift = Math.random() < 0.7 ? Math.floor(j / 4) % 2 : Math.floor(Math.random() * 2)
      const note = chord[noteIndex]
      
      // Randomly skip some notes for rhythmic variation
      if (Math.random() < 0.1) continue
      
      // Shift some notes up an octave
      const actualNote = octaveShift && note.includes("3") 
        ? note.replace("3", "4") 
        : octaveShift && note.includes("4") 
          ? note.replace("4", "5") 
          : note
          
      notes.push({
        time: startTime + j * Tone.Time("8n").toSeconds(),
        note: actualNote,
        velocity: 0.6 + Math.random() * 0.4
      })
    }
  })
  
  // Create pattern
  const part = new Tone.Part((time, value) => {
    synth.triggerAttackRelease(
      value.note, 
      randomRange(0.1, 0.2), // Randomize note duration
      time, 
      value.velocity
    )
  }, notes)
  
  part.loop = true
  part.loopStart = 0
  part.loopEnd = chords.length * notesPerChord * Tone.Time("8n").toSeconds()
  
  // Start pattern if already playing
  if (isPlaying) {
    part.start(0)
  }
  
  return { part, notes }
}

// Create bass pattern
const createBassPattern = (bassSpeed, bassSynth, isPlaying) => {
  // Base bass notes
  const baseBassNotes = ["C2", "A1", "F1", "G1"]
  
  // Transpose to match the arpeggio pattern
  const transposition = Math.floor(randomRange(-3, 4))
  const bassNotes = transposeNotes(baseBassNotes, transposition)
  
  let bassPattern = []
  const notesPerBass = bassSpeed
  
  bassNotes.forEach((note, i) => {
    const startTime = i * notesPerBass * Tone.Time("2n").toSeconds()
    
    for (let j = 0; j < notesPerBass; j++) {
      // More varied rhythmic patterns
      if (Math.random() < 0.3) continue
      
      bassPattern.push({
        time: startTime + j * Tone.Time("2n").toSeconds(),
        note: note,
        velocity: 0.7 + Math.random() * 0.3
      })
    }
  })
  
  // Create pattern
  const bassPart = new Tone.Part((time, value) => {
    bassSynth.triggerAttackRelease(
      value.note, 
      Tone.Time("2n").toSeconds() * randomRange(0.8, 1.2), // Slightly randomize duration
      time, 
      value.velocity
    )
  }, bassPattern)
  
  bassPart.loop = true
  bassPart.loopStart = 0
  bassPart.loopEnd = bassNotes.length * notesPerBass * Tone.Time("2n").toSeconds()
  
  // Start pattern if already playing
  if (isPlaying) {
    bassPart.start(0)
  }
  
  return { bassPart, bassPattern }
}

export const useMusicStore = defineStore('music', () => {
  const isPlaying = ref(false)
  let synths = null
  let arpPart = null
  let bassPart = null

  function initializeMusic() {
    const echoAmount = randomRange(0.3, 0.5)
    const arpeggioSpeed = Math.floor(randomRange(6, 10))
    const bassSpeed = Math.floor(randomRange(1, 3))
    
    // Set a random tempo
    Tone.Transport.bpm.value = Math.floor(randomRange(100, 140))
    
    // Create synths and effects
    synths = createSynths(echoAmount)
    
    // Create patterns
    const arpPattern = createArpeggioPattern(arpeggioSpeed, synths.synth, false)
    const bassPattern = createBassPattern(bassSpeed, synths.bassSynth, false)
    
    arpPart = arpPattern.part
    bassPart = bassPattern.bassPart
  }

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
    if (arpPart && bassPart) {
      Tone.Transport.stop()
      arpPart.stop()
      bassPart.stop()
      isPlaying.value = false
    }
  }

  function cleanup() {
    if (synths) {
      stop()
      arpPart.dispose()
      bassPart.dispose()
      synths.synth.dispose()
      synths.bassSynth.dispose()
      synths.effects.reverb.dispose()
      synths.effects.delay.dispose()
      synths.effects.filter.dispose()
      synths.effects.filterLFO.dispose()
      synths = null
      arpPart = null
      bassPart = null
    }
  }

  return {
    isPlaying,
    start,
    stop,
    cleanup
  }
})
