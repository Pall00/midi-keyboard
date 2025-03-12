# React Piano Keyboard

A customizable piano keyboard component for React applications with MIDI and computer keyboard support.

## Features

- Interactive piano keyboard with mouse/touch support
- Computer keyboard input (customizable key mapping)
- MIDI device support
- High-quality piano samples via Tone.js
- Sustain pedal functionality
- Customizable appearance with theming
- Highlight notes for learning applications
- Responsive design

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

The main component that provides a complete piano experience.

```jsx
<Piano 
  keyRange={{ startNote: 'C3', endNote: 'B5' }}
  onNoteOn={(note) => console.log(`Note on: ${note}`)}
  onNoteOff={(note) => console.log(`Note off: ${note}`)}
  showControls={true}
  enableKeyboard={true}
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
| `showControls` | `Boolean` | `true` | Whether to show piano controls |
| `enableMidi` | `Boolean` | `false` | Whether to enable MIDI input |
| `enableKeyboard` | `Boolean` | `true` | Whether to enable computer keyboard input |
| `showInstructions` | `Boolean` | `true` | Whether to show instructions |
| `customTheme` | `Object` | `null` | Custom theme overrides |
| `width` | `Number` | `null` | Explicit width for the piano |
| `height` | `Number` | `null` | Explicit height for the piano |

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
  // ...other methods
} = usePianoNotes();
```

### useAudioEngine

Handles audio synthesis using Tone.js.

```jsx
const {
  isLoaded,
  playNote,
  stopNote,
  startAudio,
  // ...other methods and state
} = useAudioEngine();
```

### useKeyboardInput

Handles computer keyboard input for piano playing.

```jsx
const { setKeyboardMapping } = useKeyboardInput({
  onNoteOn,
  onNoteOff,
  enabled: true,
  // ...other options
});
```

## Customization

### Theming

You can customize the appearance of the piano using the `customTheme` prop:

```jsx
const customTheme = {
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
};

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
│   │   ├── MidiPanel/        # MIDI device connection UI
│   │   └── Piano/            # Main wrapper component
│   ├── hooks/                # Custom React hooks
│   │   ├── useAudioEngine.js # Sound synthesis
│   │   ├── useMidiConnection.js # MIDI device handling
│   │   ├── useKeyboardInput.js  # Computer keyboard input
│   │   └── usePianoNotes.js     # Note state management
│   ├── utils/                # Utility functions
│   │   ├── midiUtils.js      # MIDI note formatting utilities
│   │   ├── keyboardMapping.js # Computer keyboard mapping
│   │   └── audioUtils.js     # Audio-related utilities
│   ├── styles/               # Styling
│   │   ├── theme.js          # Theme variables
│   │   └── GlobalStyles.js   # Global styles
│   └── index.js              # Main exports
├── examples/                 # Example implementations
│   ├── basic/                # Simple piano example
│   └── with-midi/            # Advanced with MIDI support
└── ...
```

### Example Usage with Hooks

For more advanced customization, you can use the individual hooks and components:

```jsx
import React from 'react';
import { 
  Keyboard, 
  usePianoNotes, 
  useAudioEngine, 
  GlobalStyles 
} from 'react-piano-keyboard';

const CustomPiano = () => {
  // Manage piano notes state
  const { activeNotes, activateNote, deactivateNote } = usePianoNotes();
  
  // Setup audio engine
  const { 
    isLoaded, 
    playNote, 
    stopNote, 
    startAudio 
  } = useAudioEngine();
  
  // Note event handlers
  const handleNoteOn = (note) => {
    activateNote(note);
    playNote(note);
  };
  
  const handleNoteOff = (note) => {
    deactivateNote(note);
    stopNote(note);
  };
  
  return (
    <div>
      <GlobalStyles />
      <button onClick={startAudio}>Start Audio</button>
      {isLoaded && (
        <Keyboard
          activeNotes={activeNotes}
          onNoteOn={handleNoteOn}
          onNoteOff={handleNoteOff}
          keyRange={{ startNote: 'C4', endNote: 'B4' }}
        />
      )}
    </div>
  );
};
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

## License

MIT