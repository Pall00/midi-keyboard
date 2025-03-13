# React Piano Keyboard

A customizable piano keyboard component for React applications with MIDI and computer keyboard support.

## Features

- Interactive piano keyboard with mouse/touch support
- Computer keyboard input (customizable key mapping)
- MIDI device support with automatic reconnection
- High-quality piano samples via Tone.js
- Sustain pedal functionality
- Multiple keyboard size options (25, 37, 49, 61, 76, or 88 keys)
- Customizable appearance with theming
- Highlight notes for learning applications
- Responsive design
- Note velocity sensitivity
- Octave navigation
- Context API for state management

## Installation

```bash
npm install react-piano-keyboard
```

or

```bash
yarn add react-piano-keyboard
```

## Quick Start

```jsx
import React from 'react';
import { Piano } from 'react-piano-keyboard';

const App = () => {
  const handleNoteOn = (note) => {
    console.log(`Note on: ${note}`);
  };

  const handleNoteOff = (note) => {
    console.log(`Note off: ${note}`);
  };

  return (
    <div className="app">
      <h1>Piano App</h1>
      <Piano 
        keyRange={{ startNote: 'C3', endNote: 'B5' }}
        onNoteOn={handleNoteOn}
        onNoteOff={handleNoteOff}
      />
    </div>
  );
};

export default App;
```

## Components

### Piano

The main component that provides a complete piano experience with controls.

```jsx
<Piano 
  keyRange={{ startNote: 'C3', endNote: 'B5' }}
  onNoteOn={(note) => console.log(`Note on: ${note}`)}
  onNoteOff={(note) => console.log(`Note off: ${note}`)}
  showControls={true}
  enableKeyboard={true}
  enableMidi={true}
  customTheme={{
    colors: {
      whiteKey: '#FFFFFF',
      activeWhiteKey: '#E0E8FF',
    }
  }}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `keyRange` | `Object` | `{ startNote: 'C3', endNote: 'B5' }` | Range of keys to display |
| `onNoteOn` | `Function` | `null` | Called when a note is activated |
| `onNoteOff` | `Function` | `null` | Called when a note is deactivated |
| `onMidiMessage` | `Function` | `null` | Called on any MIDI message |
| `showControls` | `Boolean` | `true` | Whether to show piano controls |
| `enableMidi` | `Boolean` | `false` | Whether to enable MIDI input |
| `enableKeyboard` | `Boolean` | `true` | Whether to enable computer keyboard input |
| `showInstructions` | `Boolean` | `true` | Whether to show instructions |
| `customTheme` | `Object` | `null` | Custom theme overrides |
| `width` | `Number` | `null` | Explicit width for the piano |
| `height` | `Number` | `null` | Explicit height for the piano |
| `initialKeyboardLayout` | `String` | `null` | ID of initial keyboard layout |
| `showKeyboardSizeSelector` | `Boolean` | `true` | Whether to show keyboard size selector |
| `onKeyboardSizeChange` | `Function` | `null` | Called when keyboard size changes |

### Keyboard

A standalone keyboard component that you can use without the additional controls.

```jsx
<Keyboard 
  activeNotes={['C4', 'E4', 'G4']}
  highlightedNotes={['C4']}
  onNoteOn={(note) => console.log(`Note on: ${note}`)}
  onNoteOff={(note) => console.log(`Note off: ${note}`)}
  keyRange={{ startNote: 'C4', endNote: 'C5' }}
  showKeyboardShortcuts={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeNotes` | `Array` | `[]` | Array of currently active (pressed) notes |
| `highlightedNotes` | `Array` | `[]` | Array of notes to highlight |
| `onNoteOn` | `Function` | *Required* | Called when a note is activated |
| `onNoteOff` | `Function` | *Required* | Called when a note is deactivated |
| `keyRange` | `Object` | `{ startNote: 'C4', endNote: 'B5' }` | Range of keys to display |
| `showKeyboardShortcuts` | `Boolean` | `true` | Whether to show computer keyboard shortcuts |
| `keyboardMapping` | `Object` | `defaultKeyboardMapping` | Mapping of notes to computer keyboard keys |
| `sustainEnabled` | `Boolean` | `false` | Whether sustain is enabled |
| `customTheme` | `Object` | `null` | Custom theme overrides |
| `width` | `Number` | `null` | Explicit width for the keyboard |
| `height` | `Number` | `null` | Explicit height for the keyboard |

### MIDI Components

#### MidiManager

Manages MIDI device connections with UI for device selection and status.

```jsx
<MidiManager 
  onMidiMessage={(message) => console.log('MIDI Message:', message)} 
  onConnectionChange={(status) => console.log('Connection status:', status)}
  autoConnect={true}
  initialExpanded={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onMidiMessage` | `Function` | *Required* | Handler for MIDI messages |
| `onConnectionChange` | `Function` | `null` | Handler for connection status changes |
| `compact` | `Boolean` | `false` | Whether to use a compact layout |
| `autoConnect` | `Boolean` | `true` | Whether to auto-connect to previously used devices |
| `initialExpanded` | `Boolean` | `false` | Whether the controls are initially expanded |

#### MidiDeviceSelector

A dropdown for selecting MIDI input devices.

```jsx
<MidiDeviceSelector
  devices={midiInputs}
  selectedDevice={currentDevice}
  connectionStatus={connectionStatus}
  onDeviceSelect={handleDeviceSelect}
  onRefresh={refreshDevices}
  onDisconnect={disconnectDevice}
/>
```

#### MidiConnectionStatus

Displays the current status of MIDI connection with visual indicators.

```jsx
<MidiConnectionStatus 
  connectionStatus={connectionStatus}
  selectedDevice={currentDevice}
  error={errorInfo}
  onRetry={retryConnection}
/>
```

### KeyboardSizeSelector

Component for choosing different keyboard sizes/layouts.

```jsx
<KeyboardSizeSelector
  selectedLayout="keys49"
  onChange={handleLayoutChange}
  displayMode="dropdown"
  showInfo={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedLayout` | `String` | *Required* | Currently selected layout ID |
| `onChange` | `Function` | *Required* | Handler for layout changes |
| `displayMode` | `String` | `'dropdown'` | Display mode: 'dropdown' or 'buttons' |
| `showInfo` | `Boolean` | `true` | Whether to show additional layout info |
| `vertical` | `Boolean` | `false` | Whether to use vertical layout |
| `disabled` | `Boolean` | `false` | Whether the selector is disabled |

## Keyboard Layouts

The library provides several predefined keyboard layouts:

| Layout ID | Keys | Range | Description |
|-----------|------|-------|-------------|
| `full88` | 88 | A0-C8 | Standard full-size piano |
| `keys76` | 76 | E1-G7 | Common 76-key digital piano |
| `keys61` | 61 | C2-C7 | Standard 61-key MIDI controller |
| `keys49` | 49 | C3-C7 | Compact 49-key controller |
| `keys37` | 37 | C3-C6 | Mini 37-key controller |
| `keys25` | 25 | C3-C5 | Ultra-compact 25-key controller |
| `keys13` | 13 | C4-C5 | Single octave with middle C |

You can access these layouts using the utility functions:

```jsx
import { getKeyboardLayout, getKeyboardLayoutsArray } from 'react-piano-keyboard';

// Get a specific layout
const layout = getKeyboardLayout('keys49');

// Get all layouts as an array
const allLayouts = getKeyboardLayoutsArray();
```

## Hooks

The library includes several custom hooks that you can use to build your own piano interface:

### usePianoNotes

Manages active and highlighted notes state.

```jsx
const {
  activeNotes,
  highlightedNotes,
  activateNote,
  deactivateNote,
  highlightNote,
  unhighlightNote,
  clearAllNotes,
  clearHighlights,
  whiteKeys,
  blackKeys,
} = usePianoNotes({ startNote: 'C3', endNote: 'C5' });
```

### useAudioEngine

Handles audio synthesis using Tone.js.

```jsx
const {
  isLoaded,
  playNote,
  stopNote,
  startAudio,
  volume,
  changeVolume,
  isSustainActive,
  setSustain,
} = useAudioEngine({
  initialVolume: -10,
  initialReverb: 0.2
});
```

### useKeyboardInput

Handles computer keyboard input for piano playing.

```jsx
const { setKeyboardMapping } = useKeyboardInput({
  onNoteOn,
  onNoteOff,
  enabled: true,
  sustainKey: ' ', // space bar
  onSustainChange: setSustain,
});
```

### useMidiConnectionManager

Manages MIDI device connections with comprehensive device discovery and error handling.

```jsx
const {
  connectionStatus,
  inputs,
  selectedInput,
  errorInfo,
  connectToDevice,
  disconnect,
  refreshDevices,
} = useMidiConnectionManager({
  onMidiMessage,
  autoConnect: true,
  debug: false
});
```

## Customization

### Theming

You can customize the appearance of the piano using the `customTheme` prop:

```jsx
import { createTheme } from 'react-piano-keyboard';

const customTheme = createTheme({
  colors: {
    whiteKey: '#F8F8F8',
    blackKey: '#222222',
    activeWhiteKey: '#D4E6FF',
    activeBlackKey: '#476CB3',
    highlightKey: '#FF5252',
  },
  dimensions: {
    whiteKeyWidth: 40,
    blackKeyWidthRatio: 0.7,
    whiteKeyHeight: 160,
    blackKeyHeight: 100,
  },
});

<Piano customTheme={customTheme} />
```

### Keyboard Mapping

You can create a custom mapping of computer keyboard keys to piano notes:

```jsx
import { createKeyboardMapping } from 'react-piano-keyboard';

const myKeyboardMapping = createKeyboardMapping({
  'z': 'C3',
  'x': 'D3',
  'c': 'E3',
  // ...more mappings
}, true); // Set true to completely replace the default mapping

<Piano keyboardMapping={myKeyboardMapping} />
```

## Context API

For larger applications, or when you need to share piano state across multiple components, you can use the `PianoProvider` and `usePianoContext` hook:

```jsx
import React from 'react';
import { 
  PianoProvider, 
  usePianoContext, 
  Keyboard, 
  KeyboardControls,
  GlobalStyles 
} from 'react-piano-keyboard';

// Component using the context
const PianoComponent = () => {
  const { 
    activeNotes, 
    handleNoteOn, 
    handleNoteOff,
    volume,
    changeVolume,
    isSustainActive,
    setSustain
  } = usePianoContext();
  
  return (
    <div>
      <KeyboardControls 
        volume={volume}
        changeVolume={changeVolume}
        sustainActive={isSustainActive}
        toggleSustain={() => setSustain(!isSustainActive)}
      />
      
      <Keyboard
        activeNotes={activeNotes}
        onNoteOn={handleNoteOn}
        onNoteOff={handleNoteOff}
        sustainEnabled={isSustainActive}
      />
    </div>
  );
};

// Wrap your app with the provider
const App = () => (
  <PianoProvider initialSettings={{
    keyRange: { startNote: 'C3', endNote: 'B5' },
    volume: -10,
    autoConnectMidi: true
  }}>
    <GlobalStyles />
    <PianoComponent />
  </PianoProvider>
);
```

The context provides a unified interface to all the functionality:

- Note management (active notes, highlighted notes)
- Audio control (volume, sustain, etc.)
- MIDI device connection
- Settings management

## Advanced Usage Examples

### Building a MIDI-enabled Piano with Note Visualization

```jsx
import React, { useState } from 'react';
import { 
  Piano, 
  MidiManager, 
  MidiConnectionStatus,
  CONNECTION_STATUS 
} from 'react-piano-keyboard';

const AdvancedPiano = () => {
  const [activeNotes, setActiveNotes] = useState([]);
  const [midiStatus, setMidiStatus] = useState({
    status: CONNECTION_STATUS.DISCONNECTED,
    device: null
  });
  
  const handleNoteOn = (note, source) => {
    setActiveNotes(prev => [...prev, note]);
    console.log(`Note on: ${note} (Source: ${source})`);
  };
  
  const handleNoteOff = (note) => {
    setActiveNotes(prev => prev.filter(n => n !== note));
    console.log(`Note off: ${note}`);
  };
  
  const handleMidiMessage = (message) => {
    console.log('MIDI message:', message);
    // Add custom MIDI message handling here
  };
  
  const handleMidiConnectionChange = (connection) => {
    setMidiStatus({
      status: connection.status,
      device: connection.device
    });
  };
  
  return (
    <div>
      <h2>Advanced MIDI Piano</h2>
      
      <MidiConnectionStatus 
        connectionStatus={midiStatus.status}
        selectedDevice={midiStatus.device}
      />
      
      <div style={{ marginBottom: '1rem' }}>
        <h3>Currently Playing:</h3>
        <div>
          {activeNotes.length > 0 
            ? activeNotes.join(', ') 
            : 'No notes playing'}
        </div>
      </div>
      
      <Piano 
        keyRange={{ startNote: 'C3', endNote: 'C5' }}
        onNoteOn={handleNoteOn}
        onNoteOff={handleNoteOff}
        onMidiMessage={handleMidiMessage}
        enableMidi={true}
        showControls={true}
        customTheme={{
          colors: {
            highlightKey: '#FF5252',
            activeWhiteKey: '#B3E5FC',
            activeBlackKey: '#4FC3F7'
          }
        }}
      />
    </div>
  );
};
```

## Implementation Details

### File Structure

The library follows a modular architecture:

```
react-piano-keyboard/
├── src/
│   ├── components/           # React components
│   │   ├── Key/              # Individual piano key
│   │   ├── Keyboard/         # Main keyboard layout 
│   │   ├── KeyboardControls/ # Volume, sustain controls
│   │   ├── KeyboardSizeSelector/ # Keyboard size selection
│   │   ├── MidiDeviceSelector/ # MIDI device selection
│   │   ├── MidiConnectionStatus/ # MIDI connection status display
│   │   ├── MidiManager/      # MIDI device management
│   │   └── Piano/            # Main wrapper component
│   ├── hooks/                # Custom React hooks
│   │   ├── useAudioEngine.js # Sound synthesis
│   │   ├── useMidiConnectionManager.js # MIDI device handling
│   │   ├── useKeyboardInput.js  # Computer keyboard input
│   │   ├── usePianoNotes.js     # Note state management
│   │   ├── useKeyPositions.js   # Key position calculations
│   │   └── useKeyboardInteractions.js # Mouse/touch handling
│   ├── utils/                # Utility functions
│   │   ├── midiUtils.js      # MIDI note formatting utilities
│   │   ├── midiStorageManager.js # MIDI settings storage
│   │   ├── keyboardMapping.js # Computer keyboard mapping
│   │   ├── keyboardLayouts.js # Predefined keyboard layouts
│   │   ├── pianoUtils.js     # Piano key generation
│   │   └── audioUtils.js     # Audio-related utilities
│   ├── styles/               # Styling
│   │   ├── theme.js          # Theme variables
│   │   └── GlobalStyles.js   # Global styles
│   ├── context/             # Context API
│   │   └── PianoContext.jsx  # Piano context provider
│   └── index.js              # Main exports
└── ...
```

## License

MIT