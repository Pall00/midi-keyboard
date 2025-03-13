// src/components/Piano/Piano.styles.js
import styled from 'styled-components';

/**
 * Main container for the Piano component
 */
export const PianoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #222;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

/**
 * Container for piano controls
 */
export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #2a2a2a;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

/**
 * Group of related controls
 */
export const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

/**
 * Label for controls
 */
export const ControlLabel = styled.span`
  color: #ddd;
  font-size: 0.75rem;
  font-family: ${props => props.theme.typography.fontFamily};
`;

/**
 * Button for piano controls
 */
export const ControlButton = styled.button`
  background-color: ${props => (props.active ? '#4568dc' : '#444')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: ${props => props.theme.typography.fontFamily};

  &:hover {
    background-color: ${props => (props.active ? '#3a57c4' : '#555')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * Visual sustain pedal
 */
export const SustainPedal = styled.div`
  width: 80px;
  height: 30px;
  background-color: ${props => (props.$active ? '#4568dc' : '#444')};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  box-shadow: ${props =>
    props.active ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.2)'};
  font-family: ${props => props.theme.typography.fontFamily};

  &:hover {
    background-color: ${props => (props.$active ? '#3a57c4' : '#555')};
  }
`;

/**
 * Slider component for volume control
 */
export const VolumeSlider = styled.input.attrs({ type: 'range' })`
  width: 120px;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: #555;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #4568dc;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #4568dc;
    cursor: pointer;
    border: none;
  }
`;

/**
 * Container for MIDI-related controls and displays
 */
export const MidiSection = styled.div`
  margin: 0;
  border-bottom: 1px solid #333;
`;

/**
 * Instructions display
 */
export const InstructionsText = styled.div`
  margin-top: 0.5rem;
  color: #aaa;
  font-size: 0.75rem;
  text-align: center;
  line-height: 1.4;
  padding: 0.5rem;
  font-family: ${props => props.theme.typography.fontFamily};
`;

/**
 * Container for advanced controls with toggle
 */
export const AdvancedControlsContainer = styled.div`
  width: 100%;
  background-color: #333;
  border-top: 1px solid #444;
  padding: ${props => (props.$expanded ? '1rem' : '0')};
  max-height: ${props => (props.$expanded ? '200px' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
`;

/**
 * Button to toggle advanced controls
 */
export const AdvancedControlsToggle = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  text-decoration: underline;
  margin-left: auto;

  &:hover {
    color: #bbb;
  }
`;

/**
 * Advanced controls inner wrapper
 */
export const AdvancedControlsContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;
