// examples/context-example/ContextPianoExample.jsx
import React from 'react';
import {
  PianoProvider,
  usePianoContext,
  Keyboard,
  KeyboardControls,
  MidiPanel,
  GlobalStyles
} from 'react-piano-keyboard';

/**
 * Piano wrapper component using context
 */
const Piano = () => {
  // Access piano context
  const {
    audioStarted,
    startAudio,
    activeNotes,
    highlightedNotes,
    handleNoteOn,
    handleNoteOff,
    volume,
    changeVolume,
    isSustainActive,
    setSustain,
    settings,
  } = usePianoContext();
  
  // Define keyboard range from settings
  const keyRange = settings.keyRange || { startNote: 'C3', endNote: 'B5' };
  
  if (!audioStarted) {
    return (
      <div className="start-container">
        <button className="start-button" onClick={startAudio}>
          Start Piano
        </button>
      </div>
    );
  }
  
  return (
    <div className="piano-container">
      <KeyboardControls
        isOpen={true}
        volume={volume}
        changeVolume={changeVolume}
        sustainActive={isSustainActive}
        toggleSustain={() => setSustain(!isSustainActive)}
      />
      
      <Keyboard
        activeNotes={activeNotes}
        highlightedNotes={highlightedNotes}
        onNoteOn={handleNoteOn}
        onNoteOff={handleNoteOff}
        keyRange={keyRange}
        sustainEnabled={isSustainActive}
      />
    </div>
  );
};

/**
 * MIDI panel component using context
 */
const MidiControls = () => {
  // Access piano context for MIDI-specific properties
  const {
    midiEnabled,
    midiInputs,
    selectedMidiInput,
    midiError,
    midiDebugInfo,
    connectMidiDevice,
    disconnectMidiDevice,
    refreshMidiDevices,
    clearMidiDebug
  } = usePianoContext();
  
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="midi-controls">
      <button
        className={`midi-toggle ${selectedMidiInput ? 'connected' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedMidiInput ? `MIDI: ${selectedMidiInput.name}` : 'MIDI Setup'}
      </button>
      
      <MidiPanel
        isOpen={isOpen}
        midiInputs={midiInputs}
        selectedInput={selectedMidiInput}
        onDeviceChange={connectMidiDevice}
        onRefreshDevices={refreshMidiDevices}
        onDisconnect={disconnectMidiDevice}
        error={midiError}
        debugInfo={midiDebugInfo}
        onClearDebug={clearMidiDebug}
        showDebug={true}
      />
    </div>
  );
};

/**
 * Note display component using context
 */
const NoteDisplay = () => {
  const { activeNotes } = usePianoContext();
  
  return (
    <div className="note-display">
      <h3>Active Notes</h3>
      <div className="notes">
        {activeNotes.length === 0 ? (
          <span className="no-notes">No notes currently active</span>
        ) : (
          activeNotes.map(note => (
            <span key={note} className="note">{note}</span>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Main example component that wraps everything with the provider
 */
const ContextPianoExample = () => {
  // Initial settings for the piano
  const initialSettings = {
    showKeyLabels: true,
    showKeyboardShortcuts: true,
    keyRange: { startNote: 'C3', endNote: 'B5' },
    volume: -15,
    reverb: 0.3,
    autoConnectMidi: true,
    midiDebug: true,
  };
  
  // Custom theme (optional)
  const customTheme = {
    colors: {
      whiteKey: '#FFFFFF',
      blackKey: '#222222',
      activeWhiteKey: '#E0E8FF',
      activeBlackKey: '#555555',
      highlightKey: '#FF5252',
    },
  };
  
  return (
    <PianoProvider initialSettings={initialSettings} customTheme={customTheme}>
      <div className="context-example">
        <GlobalStyles />
        
        <h1>Piano with Context API</h1>
        <p className="description">
          This example demonstrates using the PianoContext to manage state across components.
        </p>
        
        <div className="layout">
          <div className="main-section">
            <Piano />
          </div>
          
          <div className="side-section">
            <MidiControls />
            <NoteDisplay />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .context-example {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        h1 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .description {
          color: #666;
          margin-bottom: 2rem;
        }
        
        .layout {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        
        .main-section {
          flex: 1;
          min-width: 600px;
        }
        
        .side-section {
          width: 300px;
        }
        
        .start-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .start-button {
          padding: 1rem 2rem;
          background: linear-gradient(90deg, #4568dc, #b06ab3);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.2rem;
          cursor: pointer;
        }
        
        .piano-container {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .midi-controls {
          margin-bottom: 2rem;
        }
        
        .midi-toggle {
          width: 100%;
          padding: 0.75rem;
          background-color: #333;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 0.5rem;
        }
        
        .midi-toggle.connected {
          background-color: #4CAF50;
        }
        
        .note-display {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 1rem;
        }
        
        .note-display h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          color: #333;
        }
        
        .notes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .note {
          background-color: #4568dc;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .no-notes {
          color: #999;
          font-style: italic;
        }
      `}</style>
    </PianoProvider>
  );
};

export default ContextPianoExample;