// src/components/MidiManager/MidiManager.styles.js
import styled from 'styled-components';

/**
 * Main container for the MIDI manager
 */
export const ManagerContainer = styled.div`
  background-color: #222;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #333;
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Header with title and toggle button
 */
export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #333;
  border-bottom: 1px solid #444;
`;

/**
 * Title for the MIDI manager
 */
export const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #eee;
  margin: 0;
`;

/**
 * Button to toggle visibility of MIDI controls
 */
export const ToggleButton = styled.button`
  background-color: transparent;
  color: #90CAF9;
  border: none;
  padding: 0.375rem 0.625rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(144, 202, 249, 0.1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(144, 202, 249, 0.2);
  }
`;

/**
 * Content area for MIDI manager
 */
export const ManagerContent = styled.div`
  max-height: ${props => props.$expanded ? '500px' : '0'};
  opacity: ${props => props.$expanded ? '1' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  padding: ${props => props.$expanded ? '1rem' : '0 1rem'};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  /* Adjust for compact mode */
  ${props => props.$compact && `
    gap: 0.5rem;
    padding: ${props.$expanded ? '0.75rem' : '0 0.75rem'};
    
    & > * {
      font-size: 0.875rem;
    }
  `}
`;

/**
 * Debug panel
 */
export const DebugPanel = styled.div`
  margin-top: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  overflow: hidden;
`;

/**
 * Debug panel header
 */
export const DebugHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #333;
  font-size: 0.75rem;
  color: #aaa;
  border-bottom: 1px solid #444;
`;

/**
 * Debug content area
 */
export const DebugContent = styled.pre`
  background-color: #1a1a1a;
  color: #0f0;
  padding: 0.75rem;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.75rem;
  line-height: 1.4;
  word-break: break-all;
  white-space: pre-wrap;
`;

/**
 * Clear button for debug panel
 */
export const ClearButton = styled.button`
  background: none;
  border: none;
  color: #90CAF9;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  
  &:hover {
    background-color: rgba(144, 202, 249, 0.1);
    text-decoration: underline;
  }
`;