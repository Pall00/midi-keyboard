// src/hooks/useAudioEngine.js
import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';

/**
 * Hook for managing the audio synthesis engine
 *
 * Handles playing notes, controlling volume, sustain pedal,
 * and other audio-related functionality using Tone.js.
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Audio engine state and methods
 */
const useAudioEngine = ({
  initialVolume = -10,
  initialReverb = 0.2,
  initialRelease = 1,
  initialInstrument = 'piano',
} = {}) => {
  // Audio engine state
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [reverb, setReverb] = useState(initialReverb);
  const [isSustainActive, setIsSustainActive] = useState(false);
  //const [release, setRelease] = useState(initialRelease);
  const [instrument] = useState(initialInstrument);

  // Refs for Tone.js objects
  const synthRef = useRef(null);
  const volumeNodeRef = useRef(null);
  const reverbRef = useRef(null);
  const limiterRef = useRef(null);

  // Ref to track active notes for better sustain pedal handling
  const activeNotesRef = useRef(new Set());

  /**
   * Initialize the audio engine
   * Only creates the Tone.js objects but doesn't start audio context
   */
  useEffect(() => {
    // Don't auto-start the audio context
    // We'll only create objects here but start on user interaction
    const setupAudio = async () => {
      try {
        // Create a reverb effect
        const reverbEffect = new Tone.Reverb({
          decay: 1.5,
          wet: initialReverb,
        }).toDestination();
        reverbRef.current = reverbEffect;

        // Create a limiter to prevent clipping
        const limiter = new Tone.Limiter(-0.5).connect(reverbEffect);
        limiterRef.current = limiter;

        // Create a volume control
        const volumeNode = new Tone.Volume(initialVolume).connect(limiter);
        volumeNodeRef.current = volumeNode;

        // Create a polyphonic piano sampler
        const pianoSampler = new Tone.Sampler({
          urls: {
            A0: 'A0.mp3',
            C1: 'C1.mp3',
            'D#1': 'Ds1.mp3',
            'F#1': 'Fs1.mp3',
            A1: 'A1.mp3',
            C2: 'C2.mp3',
            'D#2': 'Ds2.mp3',
            'F#2': 'Fs2.mp3',
            A2: 'A2.mp3',
            C3: 'C3.mp3',
            'D#3': 'Ds3.mp3',
            'F#3': 'Fs3.mp3',
            A3: 'A3.mp3',
            C4: 'C4.mp3',
            'D#4': 'Ds4.mp3',
            'F#4': 'Fs4.mp3',
            A4: 'A4.mp3',
            C5: 'C5.mp3',
            'D#5': 'Ds5.mp3',
            'F#5': 'Fs5.mp3',
            A5: 'A5.mp3',
            C6: 'C6.mp3',
            'D#6': 'Ds6.mp3',
            'F#6': 'Fs6.mp3',
            A6: 'A6.mp3',
            C7: 'C7.mp3',
            'D#7': 'Ds7.mp3',
            'F#7': 'Fs7.mp3',
            A7: 'A7.mp3',
            C8: 'C8.mp3',
          },
          release: initialRelease,
          baseUrl: 'https://tonejs.github.io/audio/salamander/',
          onload: () => {
            setIsLoaded(true);
            console.log('Piano samples loaded!');
          },
        }).connect(volumeNode);

        synthRef.current = pianoSampler;
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing audio engine:', error);
      }
    };

    setupAudio();

    // Clean up function
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (volumeNodeRef.current) {
        volumeNodeRef.current.dispose();
      }
      if (limiterRef.current) {
        limiterRef.current.dispose();
      }
      if (reverbRef.current) {
        reverbRef.current.dispose();
      }
    };
  }, [initialVolume, initialReverb, initialRelease]);

  // Update volume when it changes
  useEffect(() => {
    if (volumeNodeRef.current) {
      volumeNodeRef.current.volume.value = volume;
    }
  }, [volume]);

  // Update reverb when it changes
  useEffect(() => {
    if (reverbRef.current) {
      reverbRef.current.wet.value = reverb;
    }
  }, [reverb]);

  /**
   * Start the audio context
   * Must be called after user interaction
   */
  const startAudio = useCallback(async () => {
    try {
      await Tone.start();
      console.log('Audio context started successfully');
      return true;
    } catch (error) {
      console.error('Error starting audio context:', error);
      return false;
    }
  }, []);

  /**
   * Helper function to normalize note format for Tone.js
   * @param {string} note - Note in standard format
   * @returns {string} Note in Tone.js format
   */
  const normalizeNote = useCallback(note => {
    // Extract the note and octave
    const match = note.match(/^([A-Ga-g][#b]?)(\d+)$/);
    if (!match) {
      console.error(`Invalid note format: ${note}`);
      return note; // Return original if format is invalid
    }

    const noteName = match[1].toUpperCase();
    const octave = match[2];

    return `${noteName}${octave}`;
  }, []);

  /**
   * Play a note
   * @param {string} note - The note to play (e.g., "C4")
   * @param {number} velocity - Note velocity (0-1)
   */
  const playNote = useCallback(
    (note, velocity = 0.7) => {
      if (!synthRef.current || !isLoaded || !isInitialized) return;

      try {
        const normalizedNote = normalizeNote(note);

        // For debugging
        console.log(`Playing note: ${note} (normalized: ${normalizedNote}, velocity: ${velocity})`);

        // Only play if not already active
        if (!activeNotesRef.current.has(normalizedNote)) {
          activeNotesRef.current.add(normalizedNote);
          synthRef.current.triggerAttack(normalizedNote, Tone.now(), velocity);
        }
      } catch (error) {
        console.error(`Error playing note ${note}:`, error);
      }
    },
    [isLoaded, isInitialized, normalizeNote]
  );

  /**
   * Stop a note
   * @param {string} note - The note to stop
   */
  const stopNote = useCallback(
    note => {
      if (!synthRef.current || !isLoaded || !isInitialized) return;

      try {
        const normalizedNote = normalizeNote(note);

        // Only stop if not in sustain mode
        if (!isSustainActive) {
          if (activeNotesRef.current.has(normalizedNote)) {
            activeNotesRef.current.delete(normalizedNote);
            synthRef.current.triggerRelease(normalizedNote);
          }
        }
      } catch (error) {
        console.error(`Error stopping note ${note}:`, error);
      }
    },
    [isLoaded, isInitialized, normalizeNote, isSustainActive]
  );

  /**
   * Stop all notes
   */
  const stopAllNotes = useCallback(() => {
    if (!synthRef.current || !isLoaded) return;

    synthRef.current.releaseAll();
    activeNotesRef.current.clear();
  }, [isLoaded]);

  /**
   * Toggle sustain pedal
   * @param {boolean} active - Whether sustain should be active
   */
  const setSustain = useCallback(
    active => {
      setIsSustainActive(active);

      // If turning sustain off, release all notes that are no longer actively pressed
      if (!active && synthRef.current) {
        // In a real implementation, we would keep track of keys that were released
        // while the sustain pedal was active, and only release those.
        // For simplicity, we're releasing all notes here.
        stopAllNotes();
      }
    },
    [stopAllNotes]
  );

  /**
   * Change the volume
   * @param {number} newVolume - New volume in dB
   */
  const changeVolume = useCallback(newVolume => {
    setVolume(newVolume);
  }, []);

  /**
   * Change the reverb amount
   * @param {number} amount - Reverb amount (0-1)
   */
  const changeReverb = useCallback(amount => {
    setReverb(amount);
  }, []);

  return {
    // State
    isInitialized,
    isLoaded,
    volume,
    reverb,
    isSustainActive,
    instrument,

    // Methods
    startAudio,
    playNote,
    stopNote,
    stopAllNotes,
    setSustain,
    changeVolume,
    changeReverb,

    // Get the array of active notes
    activeNotes: Array.from(activeNotesRef.current),
  };
};

export default useAudioEngine;
