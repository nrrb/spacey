import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

// Utility functions for creating music
export const createSynths = (echoAmount) => {
  // Create a reverb effect
  const reverb = new Tone.Reverb({
    decay: 5,
    wet: 0.5
  }).toDestination();
  
  // Create a delay effect
  const delay = new Tone.FeedbackDelay({
    delayTime: 0.3,
    feedback: echoAmount,
    wet: 0.3
  }).connect(reverb);

  // Create a filter for sweeping effects
  const filter = new Tone.Filter({
    type: "lowpass",
    frequency: 2000,
    Q: 5
  }).connect(delay);

  // Create main synth for arpeggios
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "square"
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: 0.5
    }
  }).connect(filter);

  // Create bass synth
  const bassSynth = new Tone.Synth({
    oscillator: {
      type: "triangle"
    },
    envelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.8,
      release: 1
    }
  }).connect(filter);

  // Set up a sweep LFO for the filter
  const filterLFO = new Tone.LFO({
    frequency: 0.1,
    min: 500,
    max: 3000
  }).connect(filter.frequency);
  filterLFO.start();

  return {
    synth,
    bassSynth,
    effects: { reverb, delay, filter, filterLFO }
  };
};

// Create arpeggio pattern
export const createArpeggioPattern = (arpeggioSpeed, synthRef, isPlaying) => {
  // Spacey chord progression
  const chords = [
    ["C4", "E4", "G4", "B4"],
    ["A3", "C4", "E4", "G4"],
    ["F3", "A3", "C4", "E4"],
    ["G3", "B3", "D4", "F4"]
  ];
  
  let notes = [];
  const notesPerChord = arpeggioSpeed;
  
  chords.forEach((chord, i) => {
    const startTime = i * notesPerChord * Tone.Time("8n").toSeconds();
    
    for (let j = 0; j < notesPerChord; j++) {
      // Vary the pattern to create interest
      const noteIndex = j % 4;
      const octaveShift = Math.floor(j / 4) % 2 === 0 ? 0 : 1;
      const note = chord[noteIndex];
      
      // Shift some notes up an octave
      const actualNote = octaveShift && note.includes("3") 
        ? note.replace("3", "4") 
        : octaveShift && note.includes("4") 
          ? note.replace("4", "5") 
          : note;
          
      notes.push({
        time: startTime + j * Tone.Time("8n").toSeconds(),
        note: actualNote,
        velocity: 0.7 + Math.random() * 0.3 // Random velocity for more organic feel
      });
    }
  });
  
  // Create pattern
  const part = new Tone.Part((time, value) => {
    synthRef.current.triggerAttackRelease(
      value.note, 
      "16n", 
      time, 
      value.velocity
    );
  }, notes);
  
  part.loop = true;
  part.loopStart = 0;
  part.loopEnd = chords.length * notesPerChord * Tone.Time("8n").toSeconds();
  
  // Start pattern if already playing
  if (isPlaying) {
    part.start(0);
  }
  
  return { part, notes };
};

// Create bass pattern
export const createBassPattern = (bassSpeed, bassSynthRef, isPlaying) => {
  // Bass notes corresponding to the chord progression
  const bassNotes = ["C2", "A1", "F1", "G1"];
  
  let bassPattern = [];
  const notesPerBass = bassSpeed;
  
  bassNotes.forEach((note, i) => {
    const startTime = i * notesPerBass * Tone.Time("2n").toSeconds();
    
    for (let j = 0; j < notesPerBass; j++) {
      // Skip some notes to create a rhythmic pattern
      if (j === 1 && Math.random() > 0.5) continue;
      
      bassPattern.push({
        time: startTime + j * Tone.Time("2n").toSeconds(),
        note: note,
        velocity: 0.8
      });
    }
  });
  
  // Create pattern
  const bassPart = new Tone.Part((time, value) => {
    bassSynthRef.current.triggerAttackRelease(
      value.note, 
      "2n", 
      time, 
      value.velocity
    );
  }, bassPattern);
  
  bassPart.loop = true;
  bassPart.loopStart = 0;
  bassPart.loopEnd = bassNotes.length * notesPerBass * Tone.Time("2n").toSeconds();
  
  // Start pattern if already playing
  if (isPlaying) {
    bassPart.start(0);
  }
  
  return { bassPart, bassPattern };
};

// Create and initialize all music components
export const initializeMusic = () => {
  const echoAmount = 0.4;
  const arpeggioSpeed = 8;
  const bassSpeed = 2;
  
  // Create synths and effects
  const { synth, bassSynth, effects } = createSynths(echoAmount);
  
  // Create patterns
  const { part } = createArpeggioPattern(arpeggioSpeed, { current: synth }, false);
  const { bassPart } = createBassPattern(bassSpeed, { current: bassSynth }, false);
  
  // Return everything needed to control the music
  return {
    start: async () => {
      await Tone.start();
      Tone.Transport.stop();
      Tone.Transport.position = 0;
      part.start(0);
      bassPart.start(0);
      Tone.Transport.start();
    },
    stop: () => {
      Tone.Transport.stop();
      part.stop();
      bassPart.stop();
    },
    cleanup: () => {
      part.dispose();
      bassPart.dispose();
      synth.dispose();
      bassSynth.dispose();
      effects.reverb.dispose();
      effects.delay.dispose();
      effects.filter.dispose();
      effects.filterLFO.dispose();
    }
  };
};