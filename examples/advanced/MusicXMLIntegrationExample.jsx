// examples/advanced/MusicXMLIntegrationExample.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Piano, 
  GlobalStyles,
  // New utilities
  extractNotesFromMusicXML,
  compareMidiWithExpected,
  createMidiRecorder,
  createNoteMatchingListener,
  createTimingAnalyzer
} from 'react-piano-keyboard';

const MusicXMLIntegrationExample = () => {
  // State
  const [xmlData, setXmlData] = useState(null);
  const [expectedNotes, setExpectedNotes] = useState([]);
  const [activeNotes, setActiveNotes] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  
  // Refs
  const pianoRef = useRef(null);
  const recorderRef = useRef(null);
  const noteMatcherRef = useRef(null);
  const timingAnalyzerRef = useRef(null);
  
  // Initialize utilities
  useEffect(() => {
    // Create MIDI recorder
    recorderRef.current = createMidiRecorder();
    
    // Create note matcher
    noteMatcherRef.current = createNoteMatchingListener(
      // On match
      (note, noteNum) => {
        console.log(`Matched note: ${note}`);
        setMatchResults(prev => [...prev, { note, matched: true, time: Date.now() }]);
      },
      // On mismatch
      (note, noteNum) => {
        console.log(`Mismatched note: ${note}`);
        setMatchResults(prev => [...prev, { note, matched: false, time: Date.now() }]);
      }
    );
    
    // Create timing analyzer
    timingAnalyzerRef.current = createTimingAnalyzer();
    timingAnalyzerRef.current.setTempo(120); // Set tempo to 120 BPM
  }, []);
  
  // Function to load MusicXML file
  const loadMusicXML = async (file) => {
    try {
      const text = await file.text();
      setXmlData(text);
      
      // Extract notes
      const notes = extractNotesFromMusicXML(text);
      setExpectedNotes(notes);
      
      // Set expected notes in note matcher
      if (noteMatcherRef.current) {
        noteMatcherRef.current.setExpectedNotes(
          notes.filter(note => !note.isRest).map(note => note.midiNumber)
        );
      }
      
      console.log('Loaded MusicXML with', notes.length, 'notes');
    } catch (error) {
      console.error('Error loading MusicXML file:', error);
    }
  };
  
  // Handle MIDI messages
  const handleMidiMessage = (message) => {
    // Handle note activation/deactivation
    if (message.type === 'noteon' && message.velocity > 0) {
      setActiveNotes(prev => [...prev, message.note]);
    } else if (message.type === 'noteoff' || (message.type === 'noteon' && message.velocity === 0)) {
      setActiveNotes(prev => prev.filter(note => note !== message.note));
    }
    
    // Process with recorder
    if (recorderRef.current && recorderRef.current.isRecording()) {
      recorderRef.current.processMidiMessage(message);
    }
    
    // Process with note matcher
    if (noteMatcherRef.current) {
      noteMatcherRef.current.handleMidiMessage(message);
    }
    
    // Process with timing analyzer
    if (timingAnalyzerRef.current) {
      timingAnalyzerRef.current.handleMidiMessage(message);
    }
    
    // Compare with expected notes from MusicXML
    if (expectedNotes.length > 0 && message.type === 'noteon' && message.velocity > 0) {
      const result = compareMidiWithExpected(message, expectedNotes);
      console.log('Note comparison result:', result);
    }
  };
  
  // Start recording
  const startRecording = () => {
    if (!recorderRef.current) return;
    
    recorderRef.current.startRecording();
    setRecordingStatus('recording');
    setMatchResults([]);
    
    // Reset timing analyzer
    if (timingAnalyzerRef.current) {
      timingAnalyzerRef.current.clear();
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (!recorderRef.current) return;
    
    recorderRef.current.stopRecording();
    setRecordingStatus('stopped');
    
    // Get timing analysis
    if (timingAnalyzerRef.current) {
      const analysis = timingAnalyzerRef.current.analyzeRhythm();
      console.log('Timing analysis:', analysis);
    }
  };
  
  // Play recording
  const playRecording = () => {
    if (!recorderRef.current || !pianoRef.current) return;
    
    setRecordingStatus('playing');
    
    // Play back using the piano's playNotes method
    recorderRef.current.playRecording(
      // Note on function
      (note, velocity) => {
        if (pianoRef.current) {
          pianoRef.current.playNotes([note], 500, velocity);
        }
      },
      // Note off function
      (note) => {
        // The piano's playNotes method handles note off automatically
      },
      // Completion callback
      () => {
        setRecordingStatus('stopped');
      }
    );
  };
  
  // Export recording
  const exportRecording = () => {
    if (!recorderRef.current) return;
    
    const jsonData = recorderRef.current.exportToJSON();
    
    // Create and download a file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'piano-recording.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="music-xml-example">
      <GlobalStyles />
      
      <h1>MusicXML Integration Example</h1>
      
      <div className="controls-section">
        <div className="file-upload">
          <h3>1. Upload MusicXML File</h3>
          <input 
            type="file" 
            accept=".xml,.musicxml" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                loadMusicXML(e.target.files[0]);
              }
            }}
          />
          <p className="info">
            {expectedNotes.length > 0 
              ? `Loaded ${expectedNotes.length} notes from MusicXML` 
              : 'No MusicXML file loaded'}
          </p>
        </div>
        
        <div className="recording-controls">
          <h3>2. Record Your Performance</h3>
          <div className="button-group">
            <button 
              onClick={startRecording}
              disabled={recordingStatus === 'recording'}
              className={recordingStatus === 'recording' ? 'active' : ''}
            >
              Start Recording
            </button>
            <button 
              onClick={stopRecording}
              disabled={recordingStatus !== 'recording'}
            >
              Stop Recording
            </button>
            <button 
              onClick={playRecording}
              disabled={recordingStatus === 'recording' || !recorderRef.current || recorderRef.current.getEventCount() === 0}
            >
              Play Recording
            </button>
            <button 
              onClick={exportRecording}
              disabled={recordingStatus === 'recording' || !recorderRef.current || recorderRef.current.getEventCount() === 0}
            >
              Export Recording
            </button>
          </div>
          <p className="recording-status">
            Status: {recordingStatus}
            {recordingStatus === 'stopped' && recorderRef.current && (
              <span> - {recorderRef.current.getEventCount()} events recorded</span>
            )}
          </p>
        </div>
      </div>
      
      <div className="score-section">
        <h3>3. Expected Notes from MusicXML</h3>
        <div className="note-list">
          {expectedNotes.length > 0 ? (
            <div className="notes">
              {expectedNotes
                .filter(note => !note.isRest)
                .map((note, index) => (
                  <span 
                    key={index} 
                    className="note"
                  >
                    {note.noteName}
                  </span>
                ))
              }
            </div>
          ) : (
            <p>Upload a MusicXML file to see expected notes</p>
          )}
        </div>
      </div>
      
      <div className="keyboard-section">
        <h3>4. Play Along</h3>
        <Piano
          ref={pianoRef}
          keyRange={{ startNote: 'C3', endNote: 'C6' }}
          onMidiMessage={handleMidiMessage}
          enableMidi={true}
          showControls={true}
          enableKeyboard={true}
          activeNotes={activeNotes}
          highlightedNotes={expectedNotes.filter(note => !note.isRest).map(note => note.noteName)}
        />
      </div>
      
      <div className="results-section">
        <h3>Results</h3>
        <div className="match-results">
          {matchResults.length > 0 ? (
            <div className="results-list">
              {matchResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`result ${result.matched ? 'match' : 'mismatch'}`}
                >
                  {result.note} - {result.matched ? 'Correct' : 'Incorrect'}
                </div>
              ))}
            </div>
          ) : (
            <p>Play notes to see match results</p>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .music-xml-example {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        h1 {
          color: #333;
          margin-bottom: 1.5rem;
        }
        
        .controls-section {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .file-upload, .recording-controls {
          flex: 1;
          min-width: 300px;
          padding: 1rem;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        h3 {
          margin-top: 0;
          color: #222;
        }
        
        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        button {
          padding: 0.5rem 1rem;
          background-color: #4568dc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        button:disabled {
          background-color: #999;
          cursor: not-allowed;
        }
        
        button.active {
          background-color: #d9534f;
        }
        
        .info, .recording-status {
          font-size: 0.9rem;
          color: #666;
        }
        
        .score-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 8px;
        }
        
        .note-list {
          overflow-x: auto;
          white-space: nowrap;
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 4px;
        }
        
        .notes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .note {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background-color: #e0f7fa;
          color: #006064;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .keyboard-section {
          margin-bottom: 2rem;
        }
        
        .results-section {
          padding: 1rem;
          background-color: #f5f5f5;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        
        .match-results {
          max-height: 200px;
          overflow-y: auto;
          padding: 1rem;
          background-color: #fff;
          border-radius: 4px;
        }
        
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .result {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        
        .result.match {
          background-color: #dff0d8;
          color: #3c763d;
        }
        
        .result.mismatch {
          background-color: #f2dede;
          color: #a94442;
        }
      `}</style>
    </div>
  );
};

export default MusicXMLIntegrationExample;