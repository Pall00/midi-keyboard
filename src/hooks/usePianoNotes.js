// src/hooks/usePianoNotes.js
import { useState, useCallback } from 'react';

/**
 * Hook for managing piano notes state
 *
 * Handles active notes, highlighted notes, and provides
 * methods to control notes from different input sources.
 *
 * @param {Object} options - Configuration options
 * @returns {Object} State and methods for piano notes
 */
const usePianoNotes = ({ initialActiveNotes = [], initialHighlightedNotes = [] } = {}) => {
  // State for currently active notes (keys being pressed)
  const [activeNotes, setActiveNotes] = useState(initialActiveNotes);

  // State for highlighted notes (e.g., for learning)
  const [highlightedNotes, setHighlightedNotes] = useState(initialHighlightedNotes);

  // State to track notes by their source (computer keyboard, MIDI, etc.)
  const [notesBySource, setNotesBySource] = useState({
    keyboard: new Set(), // Computer keyboard input
    mouse: new Set(), // Mouse/touch input
    midi: new Set(), // MIDI device input
    program: new Set(), // Programmatically activated notes
  });

  /**
   * Activate a note from a specific source
   * @param {string} note - The note to activate (e.g., "C4")
   * @param {string} source - The input source (keyboard, mouse, midi, program)
   */
  const activateNote = useCallback((note, source = 'program') => {
    if (!note) return;

    setNotesBySource(prev => {
      const newNotesBySource = { ...prev };
      newNotesBySource[source] = new Set(prev[source]);
      newNotesBySource[source].add(note);

      // Generate comprehensive active notes list from all sources
      const allActiveNotes = new Set();
      Object.values(newNotesBySource).forEach(sourceNotes => {
        sourceNotes.forEach(n => allActiveNotes.add(n));
      });

      // Update the main active notes array
      setActiveNotes(Array.from(allActiveNotes));

      return newNotesBySource;
    });
  }, []);

  /**
   * Deactivate a note from a specific source
   * @param {string} note - The note to deactivate
   * @param {string} source - The input source
   */
  const deactivateNote = useCallback((note, source = 'program') => {
    if (!note) return;

    setNotesBySource(prev => {
      const newNotesBySource = { ...prev };
      newNotesBySource[source] = new Set(prev[source]);
      newNotesBySource[source].delete(note);

      // Generate comprehensive active notes list from all sources
      const allActiveNotes = new Set();
      Object.values(newNotesBySource).forEach(sourceNotes => {
        sourceNotes.forEach(n => allActiveNotes.add(n));
      });

      // Update the main active notes array
      setActiveNotes(Array.from(allActiveNotes));

      return newNotesBySource;
    });
  }, []);

  /**
   * Clear all notes from a specific source
   * @param {string} source - The input source to clear
   */
  const clearSource = useCallback((source = 'program') => {
    setNotesBySource(prev => {
      const newNotesBySource = { ...prev };
      newNotesBySource[source] = new Set();

      // Generate comprehensive active notes list from all sources
      const allActiveNotes = new Set();
      Object.values(newNotesBySource).forEach(sourceNotes => {
        sourceNotes.forEach(n => allActiveNotes.add(n));
      });

      // Update the main active notes array
      setActiveNotes(Array.from(allActiveNotes));

      return newNotesBySource;
    });
  }, []);

  /**
   * Clear all active notes from all sources
   */
  const clearAllNotes = useCallback(() => {
    setActiveNotes([]);
    setNotesBySource({
      keyboard: new Set(),
      mouse: new Set(),
      midi: new Set(),
      program: new Set(),
    });
  }, []);

  /**
   * Add a note to the highlighted notes
   * @param {string} note - The note to highlight
   */
  const highlightNote = useCallback(note => {
    if (!note) return;

    setHighlightedNotes(prev => {
      if (prev.includes(note)) return prev;
      return [...prev, note];
    });
  }, []);

  /**
   * Remove a note from the highlighted notes
   * @param {string} note - The note to unhighlight
   */
  const unhighlightNote = useCallback(note => {
    if (!note) return;

    setHighlightedNotes(prev => prev.filter(n => n !== note));
  }, []);

  /**
   * Set the highlighted notes
   * @param {Array} notes - Array of notes to highlight
   */
  const setHighlights = useCallback(notes => {
    setHighlightedNotes(notes);
  }, []);

  /**
   * Clear all highlighted notes
   */
  const clearHighlights = useCallback(() => {
    setHighlightedNotes([]);
  }, []);

  /**
   * Check if a note is currently active
   * @param {string} note - The note to check
   * @returns {boolean} Whether the note is active
   */
  const isNoteActive = useCallback(
    note => {
      return activeNotes.includes(note);
    },
    [activeNotes]
  );

  /**
   * Check if a note is currently highlighted
   * @param {string} note - The note to check
   * @returns {boolean} Whether the note is highlighted
   */
  const isNoteHighlighted = useCallback(
    note => {
      return highlightedNotes.includes(note);
    },
    [highlightedNotes]
  );

  return {
    // State
    activeNotes,
    highlightedNotes,
    notesBySource,

    // Methods for active notes
    activateNote,
    deactivateNote,
    clearSource,
    clearAllNotes,
    isNoteActive,

    // Methods for highlighted notes
    highlightNote,
    unhighlightNote,
    setHighlights,
    clearHighlights,
    isNoteHighlighted,
  };
};

export default usePianoNotes;
