// src/components/Keyboard/components/OctaveMarkers.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { OctaveMarker } from '../Keyboard.styles';

/**
 * Component for displaying octave markers
 * Shows C notes with their octave number at the bottom of the keyboard
 */
const OctaveMarkers = ({ whiteKeys, keyPositions, whiteKeyWidth }) => {
  // Create octave markers for visual reference
  const markers = useMemo(() => {
    const markersArray = [];
    let previousOctave = null;

    // Safety check
    if (!whiteKeys || !keyPositions) return markersArray;

    // Find the position of each C note for octave markers
    whiteKeys.forEach(key => {
      const match = key.note.match(/^C(\d+)$/);
      if (match) {
        const octave = match[1];
        if (octave !== previousOctave && keyPositions[key.note]) {
          markersArray.push({
            label: key.note,
            position: keyPositions[key.note].left + whiteKeyWidth / 2,
          });
          previousOctave = octave;
        }
      }
    });

    return markersArray;
  }, [whiteKeys, keyPositions, whiteKeyWidth]);

  return (
    <>
      {markers.map(marker => (
        <OctaveMarker key={marker.label} $position={marker.position}>
          {marker.label}
        </OctaveMarker>
      ))}
    </>
  );
};

OctaveMarkers.propTypes = {
  whiteKeys: PropTypes.array.isRequired,
  keyPositions: PropTypes.object.isRequired,
  whiteKeyWidth: PropTypes.number.isRequired,
};

export default React.memo(OctaveMarkers);
