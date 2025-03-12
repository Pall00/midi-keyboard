// examples/basic/BasicPianoExample.jsx
import React, { useState } from 'react';
import { Piano, GlobalStyles } from 'react-piano-keyboard';

const BasicPianoExample = () => {
  const [lastNote, setLastNote] = useState(null);
  
  const handleNoteOn = (note) => {
    console.log(`Note played: ${note}`);
    setLastNote(`${note} (on)`);
  };
  
  const handleNoteOff = (note) => {
    console.log(`Note released: ${note}`);
    setLastNote(`${note} (off)`);
  };
  
  return (
    <div className="piano-example">
      <GlobalStyles />
      
      <h1>Basic Piano Example</h1>
      
      <div className="info-panel">
        <p>Use your mouse to click piano keys, or use your computer keyboard:</p>
        <p>Keys A-L correspond to white keys, and keys W-P correspond to black keys.</p>
        <p>Press the space bar to toggle the sustain pedal.</p>
        
        {lastNote && (
          <div className="note-display">
            Last note: <strong>{lastNote}</strong>
          </div>
        )}
      </div>
      
      <div className="piano-container">
        <Piano 
          keyRange={{ startNote: 'C3', endNote: 'B4' }}
          onNoteOn={handleNoteOn}
          onNoteOff={handleNoteOff}
          showControls={true}
          enableKeyboard={true}
          showInstructions={true}
        />
      </div>
      
      <style jsx>{`
        .piano-example {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        h1 {
          color: #333;
          margin-bottom: 1.5rem;
        }
        
        .info-panel {
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        
        .note-display {
          margin-top: 1rem;
          padding: 0.5rem;
          background-color: #e0e8ff;
          border-radius: 4px;
          font-size: 1.1rem;
        }
        
        .piano-container {
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BasicPianoExample;