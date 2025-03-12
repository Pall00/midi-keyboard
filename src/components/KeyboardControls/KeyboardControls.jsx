// src/components/KeyboardControls/KeyboardControls.jsx
import PropTypes from 'prop-types';

import {
  ControlsContainer,
  ControlsRow,
  ControlItem,
  Label,
  VolumeSlider,
  SustainButton,
  Select,
  ControlHelp,
  Kbd,
} from './KeyboardControls.styles';

/**
 * KeyboardControls Component
 *
 * Controls panel for the piano keyboard with volume, sustain, and
 * other settings.
 */
const KeyboardControls = ({
  isOpen,
  volume,
  changeVolume,
  sustainActive,
  toggleSustain,
  octave,
  changeOctave,
  showOctaveControl,
  showKeyLabels,
  toggleKeyLabels,
  showShortcuts,
  toggleShortcuts,
}) => {
  // Animation properties
  const animationProps = {
    animate: {
      height: isOpen ? 'auto' : 0,
      opacity: isOpen ? 1 : 0,
    },
    transition: { duration: 0.3 },
  };

  // Get octave options
  const getOctaveOptions = () => {
    const options = [];
    for (let i = 0; i <= 7; i++) {
      options.push(
        <option key={i} value={i}>
          Octave {i}
        </option>
      );
    }
    return options;
  };

  return (
    <ControlsContainer {...animationProps}>
      <ControlsRow>
        {/* Volume Control */}
        <ControlItem>
          <Label htmlFor="volume-control">Volume</Label>
          <VolumeSlider
            id="volume-control"
            min="-40"
            max="0"
            step="1"
            value={volume}
            onChange={e => changeVolume(parseFloat(e.target.value))}
          />
        </ControlItem>

        {/* Sustain Control */}
        <ControlItem>
          <Label>Sustain</Label>
          <SustainButton
            $active={sustainActive}
            onClick={toggleSustain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sustainActive ? 'On' : 'Off'}
          </SustainButton>
        </ControlItem>

        {/* Octave Control */}
        {showOctaveControl && (
          <ControlItem>
            <Label htmlFor="octave-control">Octave</Label>
            <Select
              id="octave-control"
              value={octave}
              onChange={e => changeOctave(parseInt(e.target.value))}
            >
              {getOctaveOptions()}
            </Select>
          </ControlItem>
        )}

        {/* Key Labels Switch */}
        {showKeyLabels !== undefined && (
          <ControlItem>
            <Label>Key Labels</Label>
            <SustainButton
              $active={showKeyLabels}
              onClick={toggleKeyLabels}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showKeyLabels ? 'On' : 'Off'}
            </SustainButton>
          </ControlItem>
        )}

        {/* Shortcuts Switch */}
        {showShortcuts !== undefined && (
          <ControlItem>
            <Label>Keyboard Shortcuts</Label>
            <SustainButton
              $active={showShortcuts}
              onClick={toggleShortcuts}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showShortcuts ? 'On' : 'Off'}
            </SustainButton>
          </ControlItem>
        )}

        {/* Keyboard Shortcuts Help */}
        <ControlHelp>
          Press <Kbd>Space</Kbd> to toggle sustain
        </ControlHelp>
      </ControlsRow>
    </ControlsContainer>
  );
};

KeyboardControls.propTypes = {
  /** Whether the controls panel is open */
  isOpen: PropTypes.bool,
  /** Current volume level (-40 to 0) */
  volume: PropTypes.number.isRequired,
  /** Function to change volume */
  changeVolume: PropTypes.func.isRequired,
  /** Whether sustain is active */
  sustainActive: PropTypes.bool.isRequired,
  /** Function to toggle sustain */
  toggleSustain: PropTypes.func.isRequired,
  /** Current octave */
  octave: PropTypes.number,
  /** Function to change octave */
  changeOctave: PropTypes.func,
  /** Whether to show octave control */
  showOctaveControl: PropTypes.bool,
  /** Whether key labels are shown */
  showKeyLabels: PropTypes.bool,
  /** Function to toggle key labels */
  toggleKeyLabels: PropTypes.func,
  /** Whether keyboard shortcuts are shown */
  showShortcuts: PropTypes.bool,
  /** Function to toggle keyboard shortcuts */
  toggleShortcuts: PropTypes.func,
};

KeyboardControls.defaultProps = {
  isOpen: true,
  octave: 4,
  changeOctave: () => {},
  showOctaveControl: false,
  showKeyLabels: undefined,
  toggleKeyLabels: () => {},
  showShortcuts: undefined,
  toggleShortcuts: () => {},
};

export default KeyboardControls;
