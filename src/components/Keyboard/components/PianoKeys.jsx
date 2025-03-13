// src/components/Keyboard/components/PianoKeys.jsx
import React from 'react';
import PropTypes from 'prop-types';

import Key from '../../Key';

/**
 * Component for rendering the piano keys
 * Handles both white and black keys with proper z-index ordering
 */
const PianoKeys = ({
  whiteKeys,
  blackKeys,
  keyPositions,
  blackKeyWidth,
  isNoteActive,
  isNoteHighlighted,
  showKeyboardShortcuts,
  keyboardMapping,
  handleMouseDown,
  handleMouseUp,
  handleMouseEnter,
  handleMouseLeave,
  handleTouchStart,
  handleTouchEnd,
}) => {
  // Safely handle arrays
  const safeWhiteKeys = whiteKeys || [];
  const safeBlackKeys = blackKeys || [];

  return (
    <>
      {/* Render white keys first (they'll have a lower z-index) */}
      {safeWhiteKeys.map(key =>
        keyPositions && keyPositions[key.note] ? (
          <Key
            key={key.note}
            note={key.note}
            isBlack={false}
            keyboardShortcut={showKeyboardShortcuts ? keyboardMapping[key.note] : null}
            isActive={isNoteActive(key.note)}
            isHighlighted={isNoteHighlighted(key.note)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              position: 'absolute',
              left: `${keyPositions[key.note].left}px`,
              top: `${keyPositions[key.note].top}px`,
              width: `${keyPositions[key.note].width}px`,
              height: `${keyPositions[key.note].height}px`,
              zIndex: keyPositions[key.note].zIndex,
            }}
          />
        ) : null
      )}

      {/* Then render black keys (they'll have a higher z-index) */}
      {safeBlackKeys.map(key =>
        keyPositions && keyPositions[key.note] ? (
          <Key
            key={key.note}
            note={key.note}
            isBlack={true}
            keyboardShortcut={showKeyboardShortcuts ? keyboardMapping[key.note] : null}
            isActive={isNoteActive(key.note)}
            isHighlighted={isNoteHighlighted(key.note)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              position: 'absolute',
              left: `${keyPositions[key.note].left - blackKeyWidth * 0.1}px`,
              top: `${keyPositions[key.note].top}px`,
              width: `${blackKeyWidth}px`,
              height: `${keyPositions[key.note].height}px`,
              zIndex: keyPositions[key.note].zIndex,
            }}
          />
        ) : null
      )}
    </>
  );
};

PianoKeys.propTypes = {
  whiteKeys: PropTypes.array.isRequired,
  blackKeys: PropTypes.array.isRequired,
  keyPositions: PropTypes.object.isRequired,
  blackKeyWidth: PropTypes.number.isRequired,
  isNoteActive: PropTypes.func.isRequired,
  isNoteHighlighted: PropTypes.func.isRequired,
  showKeyboardShortcuts: PropTypes.bool,
  keyboardMapping: PropTypes.object,
  handleMouseDown: PropTypes.func.isRequired,
  handleMouseUp: PropTypes.func.isRequired,
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  handleTouchStart: PropTypes.func.isRequired,
  handleTouchEnd: PropTypes.func.isRequired,
};

export default React.memo(PianoKeys);
