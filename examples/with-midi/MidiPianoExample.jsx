// examples/with-midi/MidiPianoExample.jsx
import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  MidiPanel, 
  useAudioEngine, 
  useMidiConnection, 
  usePianoNotes,
  GlobalStyles
} from 'react-piano-keyboard';

const MidiPianoExample = () => {
  // State for UI controls
  const [midiPanelOpen, setMidiPanelOpen] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  
  // Initialize piano state hooks
  const { 
    activeNotes, 
    activateNote, 
    deactivateNote, 
    highlightNote, 
    clearHighlights,
    highlightedNotes
  } = usePianoNotes();
  
  // Initialize audio engine
  const { 
    isLoaded, 
    playNote, 
    stopNote, 
    startAudio, 
    volume, 
    changeVolume,
    isSustainActive,
    setSustain
  } = useAudioEngine();
  
  // Handle MIDI messages
  const handleMidiMessage = (event) => {
    if (event.type === 'noteon') {
      activateNote(event.note, 'midi');
      playNote(event.note, event.velocity);
    } else if (event.type === 'noteoff') {
      deactivateNote(event.note, 'midi');
      if (!isSustainActive) {
        stopNote(event.note);
      }
    }
  };
  
  // Initialize MIDI connection
  const { 
    isEnabled, 
    inputs, 
    selectedInput, 
    error,
    isRefreshing, 
    debugInfo, 
    connectToDevice, 
    disconnect, 
    refreshDevices, 
    setDebugInfo
  } = useMidiConnection({
    onMidiMessage: handleMidiMessage,
    autoConnect: true,
    debug: true
  });
  
  // Handle mouse/touch input on keyboard
  const handleNoteOn = (note) => {
    activateNote(note, 'mouse');
    playNote(note);
  };
  
  const handleNoteOff = (note) => {
    deactivateNote(note, 'mouse');
    if (!isSustainActive) {
      stopNote(note);
    }
  };
  
  // Start audio engine
  const handleStartAudio = async () => {
    await startAudio();
    setAudioStarted(true);
  };
  
  // Toggle MIDI panel
  const toggleMidiPanel = () => {
    setMidiPanelOpen(!midiPanelOpen);
  };
  
  // Toggle sustain pedal
  const toggleSustain = () => {
    setSustain(!isSustainActive);
  };
  
  // Demonstrate note highlighting feature
  useEffect(() => {
    if (audioStarted && isLoaded) {
      // Highlight some notes for demonstration
      const timer = setTimeout(() => {
        clearHighlights();
        highlightNote('C4');
        highlightNote('E4');
        highlightNote('G4');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [audioStarted, isLoaded, highlightNote, clearHighlights]);
  
  return (
    <div className="midi-piano-example">
      <GlobalStyles />
      
      <h1>Advanced MIDI Piano Example</h1>
      
      <div className="controls-panel">
        {!audioStarted ? (
          <button className="start-button" onClick={handleStartAudio}>
            Start Audio
          </button>
        ) : (
          <>
            <div className="control-group">
              <label>Volume</label>
              <input 
                type="range" 
                min="-40" 
                max="0" 
                value={volume} 
                onChange={(e) => changeVolume(parseFloat(e.target.value))} 
              />
            </div>
            
            <div className="control-group">
              <label>Sustain</label>
              <button 
                className={`sustain-button ${isSustainActive ? 'active' : ''}`}
                onClick={toggleSustain}
              >
                {isSustainActive ? 'On' : 'Off'}
              </button>
            </div>
            
            <div className="control-group">
              <button 
                className={`midi-button ${midiPanelOpen ? 'active' : ''}`}
                onClick={toggleMidiPanel}
              >
                {selectedInput ? `MIDI: ${selectedInput.name}` : 'MIDI Settings'}
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* MIDI Panel */}
      <MidiPanel 
        isOpen={midiPanelOpen}
        midiInputs={inputs}
        selectedInput={selectedInput}
        onDeviceChange={connectToDevice}
        onRefreshDevices={refreshDevices}
        onDisconnect={disconnect}
        isRefreshing={isRefreshing}
        error={error}
        debugInfo={debugInfo}
        onClearDebug={() => setDebugInfo('')}
        showDebug={true}
      />
      
      <div className="keyboard-container">
        {audioStarted && (
          <Keyboard 
            activeNotes={activeNotes}
            highlightedNotes={highlightedNotes}
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
            keyRange={{ startNote: 'C3', endNote: 'B5' }}
            sustainEnabled={isSustainActive}
          />
        )}
      </div>
      
      <div className="info-panel">
        <p>
          <strong>Active Notes:</strong> {activeNotes.join(', ') || 'None'}
        </p>
        <p>
          <strong>MIDI Status:</strong> {isEnabled ? 'Enabled' : 'Disabled'} 
          {selectedInput && ` - Connected to ${selectedInput.name}`}
        </p>
      </div>
      
      <style jsx>{`
        .midi-piano-example {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        h1 {
          color: #333;
          margin-bottom: 1.5rem;
        }
        
        .controls-panel {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background-color: #f5f5f5;
          border-radius: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        label {
          font-size: 0.8rem;
          color: #666;
        }
        
        input[type="range"] {
          width: 150px;
        }
        
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: #4568dc;
          color: white;
          font-weight: 500;
        }
        
        .start-button {
          padding: 0.75rem 1.5rem;
          font-size: 1.1rem;
          background: linear-gradient(90deg, #4568dc, #b06ab3);
        }
        
        .sustain-button.active {
          background-color: #4CAF50;
        }
        
        .midi-button.active {
          background-color: #ff9800;
        }
        
        .keyboard-container {
          margin: 1.5rem 0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .info-panel {
          padding: 1rem;
          background-color: #f5f5f5;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default MidiPianoExample;