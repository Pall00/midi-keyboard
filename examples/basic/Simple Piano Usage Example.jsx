// Example: Simple piano without theme customization

import React from 'react';
import { Piano } from 'react-piano-keyboard';

const SimplePianoExample = () => {
  // Handle played notes (optional)
  const handleNoteOn = (note) => {
    console.log(`Note played: ${note}`);
  };
  
  const handleNoteOff = (note) => {
    console.log(`Note released: ${note}`);
  };
  
  return (
    <div className="piano-wrapper">
      <h2>Interactive Piano</h2>
      
      <Piano 
        keyRange={{ startNote: 'C3', endNote: 'B5' }}
        showControls={true}
        enableKeyboard={true}
        enableMidi={true}
        onNoteOn={handleNoteOn}
        onNoteOff={handleNoteOff}
      />
      
      <div className="description" style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>
          Use your computer keyboard to play the piano. Click "Settings" to adjust volume and sustain.
          Connect a MIDI device to play with your MIDI keyboard.
        </p>
      </div>
    </div>
  );
};

export default SimplePianoExample;