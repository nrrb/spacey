import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as Tone from 'tone'

export const useMusicStore = defineStore('music', () => {
  const isPlaying = ref(false)
  let synth = null
  let pattern = null

  function initializeMusic() {
    synth = new Tone.PolySynth().toDestination()
    
    // Define the melody pattern
    pattern = new Tone.Sequence((time, note) => {
      synth.triggerAttackRelease(note, '8n', time)
    }, ['C4', 'E4', 'G4', 'B4'], '4n')
    
    Tone.Transport.bpm.value = 120
  }

  async function start() {
    if (!synth) initializeMusic()
    await Tone.start()
    pattern.start(0)
    Tone.Transport.start()
    isPlaying.value = true
  }

  function stop() {
    if (pattern) {
      pattern.stop()
      Tone.Transport.stop()
      isPlaying.value = false
    }
  }

  function cleanup() {
    if (synth) {
      stop()
      synth.dispose()
      pattern.dispose()
      synth = null
      pattern = null
    }
  }

  return {
    isPlaying,
    start,
    stop,
    cleanup
  }
})
