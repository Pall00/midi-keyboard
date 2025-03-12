// src/components/KeyboardControls/KeyboardControls.styles.js
import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * Main container for the controls panel
 */
export const ControlsContainer = styled(motion.div)`
  background-color: #2a2a2a;
  padding: 1rem;
  border-bottom: 1px solid #333;
  overflow: hidden;
`;

/**
 * Row of control elements
 */
export const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
`;

/**
 * Individual control item
 */
export const ControlItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/**
 * Label for control items
 */
export const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  color: #ddd;
  font-size: 0.875rem;
  font-family: ${props => props.theme.typography.fontFamily};
`;

/**
 * Volume slider component
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
 * Sustain button component
 */
export const SustainButton = styled(motion.button)`
  background-color: ${props => (props.$active ? '#4568dc' : '#555')};
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: ${props => props.theme.typography.fontFamily};
`;

/**
 * Select dropdown component
 */
export const Select = styled.select`
  background-color: #444;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 150px;
  font-family: ${props => props.theme.typography.fontFamily};

  &:focus {
    outline: none;
    border-color: #4568dc;
  }
`;

/**
 * Help text for controls
 */
export const ControlHelp = styled.div`
  color: #aaa;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: ${props => props.theme.typography.fontFamily};
`;

/**
 * Keyboard key styling
 */
export const Kbd = styled.span`
  background-color: #444;
  border-radius: 3px;
  border: 1px solid #666;
  padding: 0.0625rem 0.25rem;
  font-size: 0.6875rem;
  font-family: ${props => props.theme.typography.fontFamily};
`;
