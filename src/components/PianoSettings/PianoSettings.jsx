// src/components/PianoSettings/PianoSettings.jsx
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import KeyboardSizeSelector from '../KeyboardSizeSelector';
import MidiPanel from '../MidiPanel';
import { getKeyboardLayout } from '../../utils/keyboardLayouts';

import {
  CompactControlsPanel,
  SettingsSection,
  SectionTitle,
  ControlRow,
  ControlGroup,
  ControlLabel,
  VolumeSlider,
  SustainPedal,
  AdvancedControlsToggle,
  AdvancedControlsContent,
} from './PianoSettings.styles';

/**
 * Consolidated Piano Settings Component
 *
 * Combines keyboard controls, size selection, and MIDI settings
 * into a single, organized component with sections.
 */
const PianoSettings = ({
  volume,
  onVolumeChange,
  isSustainActive,
  onSustainToggle,
  keyboardLayoutId,
  onKeyboardSizeChange,
  showKeyboardSizeSelector = true,
  enableMidi = false,
  onMidiMessage,
  onMidiConnectionChange,
  showInstructions = true,
  className,
}) => {
  // State for advanced options visibility
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

  // Get current keyboard layout info for display
  const currentLayout = getKeyboardLayout(keyboardLayoutId);

  // Toggle advanced controls section
  const toggleAdvancedControls = useCallback(() => {
    setShowAdvancedControls(prev => !prev);
  }, []);

  return (
    <CompactControlsPanel className={className}>
      {/* Sound Controls Section */}
      <SettingsSection>
        <SectionTitle>Sound Controls</SectionTitle>
        <ControlRow>
          <ControlGroup>
            <ControlLabel>Volume</ControlLabel>
            <VolumeSlider
              min="-40"
              max="0"
              step="1"
              value={volume}
              onChange={e => onVolumeChange(parseFloat(e.target.value))}
            />
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>Sustain</ControlLabel>
            <SustainPedal $active={isSustainActive} onClick={onSustainToggle}>
              {isSustainActive ? 'On' : 'Off'}
            </SustainPedal>
          </ControlGroup>
        </ControlRow>
      </SettingsSection>

      {/* Keyboard Layout Section */}
      {showKeyboardSizeSelector && (
        <SettingsSection>
          <SectionTitle>Keyboard Layout</SectionTitle>
          <ControlRow>
            <ControlGroup>
              <KeyboardSizeSelector
                selectedLayout={keyboardLayoutId}
                onChange={onKeyboardSizeChange}
                displayMode="dropdown"
                showInfo={true}
              />
            </ControlGroup>
          </ControlRow>
        </SettingsSection>
      )}

      {/* MIDI Section */}
      {enableMidi && (
        <SettingsSection>
          <SectionTitle>MIDI Settings</SectionTitle>
          <MidiPanel
            onMidiMessage={onMidiMessage}
            onConnectionChange={onMidiConnectionChange}
            compact={true}
            autoConnect={true}
            initialExpanded={true}
          />
        </SettingsSection>
      )}

      {/* Advanced Settings Section */}
      {showKeyboardSizeSelector && (
        <SettingsSection $noBorder>
          <AdvancedControlsToggle onClick={toggleAdvancedControls}>
            {showAdvancedControls ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </AdvancedControlsToggle>

          {showAdvancedControls && (
            <AdvancedControlsContent>
              {/* Advanced Keyboard Size Options */}
              <div>
                <SectionTitle>Advanced Keyboard Layouts</SectionTitle>
                <KeyboardSizeSelector
                  selectedLayout={keyboardLayoutId}
                  onChange={onKeyboardSizeChange}
                  displayMode="buttons"
                  showInfo={true}
                />
              </div>
            </AdvancedControlsContent>
          )}
        </SettingsSection>
      )}

      {/* Instructions */}
      {showInstructions && (
        <SettingsSection>
          <SectionTitle>Instructions</SectionTitle>
          <div className="instructions-text">
            Use your computer keyboard to play. A-L keys for white notes, W-P keys for black notes.
            <br />
            Press SPACE to toggle sustain pedal.
            {enableMidi && (
              <>
                <br />
                Connect a MIDI device using the MIDI Settings above.
              </>
            )}
          </div>
        </SettingsSection>
      )}
    </CompactControlsPanel>
  );
};

PianoSettings.propTypes = {
  // Sound control props
  volume: PropTypes.number.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  isSustainActive: PropTypes.bool.isRequired,
  onSustainToggle: PropTypes.func.isRequired,

  // Keyboard layout props
  keyboardLayoutId: PropTypes.string.isRequired,
  onKeyboardSizeChange: PropTypes.func.isRequired,
  showKeyboardSizeSelector: PropTypes.bool,

  // MIDI props
  enableMidi: PropTypes.bool,
  onMidiMessage: PropTypes.func,
  onMidiConnectionChange: PropTypes.func,

  // Other props
  showInstructions: PropTypes.bool,
  className: PropTypes.string,
};

export default PianoSettings;