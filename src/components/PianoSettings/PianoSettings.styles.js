// src/components/PianoSettings/PianoSettings.styles.js
import styled from 'styled-components';

/**
 * Main container for the consolidated settings panel
 */
export const CompactControlsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: #2a2a2a;
  border-bottom: 1px solid #333;
  max-height: 300px;
  overflow-y: auto;
  
  /* Make scrollbar thinner and more subtle */
  scrollbar-width: thin;
  scrollbar-color: #666 #2a2a2a;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2a2a2a;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 3px;
  }
  
  /* Style for instructions text */
  .instructions-text {
    color: #aaa;
    font-size: 0.75rem;
    text-align: left;
    line-height: 1.4;
    padding: 0.5rem 0;
    font-family: ${props => props.theme.typography?.fontFamily ||
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
  }
`;

/**
 * Container for organizing settings sections
 */
export const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: ${props => props.$noBorder ? 'none' : '1px solid #444'};
  margin-bottom: 0.5rem;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

/**
 * Section title for settings groups
 */
export const SectionTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  color: #bbb;
  font-weight: 500;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Row for control groups to organize horizontally
 */
export const ControlRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
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
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
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
    props.$active ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.2)'};
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};

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
  align-self: flex-end;

  &:hover {
    color: #bbb;
  }
`;

/**
 * Advanced controls inner wrapper
 */
export const AdvancedControlsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #444;
`;

/**
 * Button for settings
 */
export const SettingsButton = styled.button`
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: auto;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};

  &:hover {
    background-color: #555;
  }
`;