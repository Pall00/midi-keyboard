// src/components/MidiPanel/MidiPanel.styles.js
import styled, { keyframes } from 'styled-components';
import { CONNECTION_STATUS } from '../../hooks/useMidiConnectionManager';

// Status colors
const STATUS_COLORS = {
  [CONNECTION_STATUS.CONNECTED]: '#4CAF50', // Green
  [CONNECTION_STATUS.CONNECTING]: '#FFC107', // Amber
  [CONNECTION_STATUS.DISCONNECTED]: '#9E9E9E', // Gray
  [CONNECTION_STATUS.UNAVAILABLE]: '#795548', // Brown
  [CONNECTION_STATUS.ERROR]: '#F44336', // Red
};

// Status backgrounds (with reduced opacity)
const STATUS_BACKGROUNDS = {
  [CONNECTION_STATUS.CONNECTED]: 'rgba(76, 175, 80, 0.1)',
  [CONNECTION_STATUS.CONNECTING]: 'rgba(255, 193, 7, 0.1)',
  [CONNECTION_STATUS.DISCONNECTED]: 'rgba(158, 158, 158, 0.1)',
  [CONNECTION_STATUS.UNAVAILABLE]: 'rgba(121, 85, 72, 0.1)',
  [CONNECTION_STATUS.ERROR]: 'rgba(244, 67, 54, 0.1)',
};

/**
 * Container for the MIDI panel
 */
export const PanelContainer = styled.div`
  background-color: #222;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #333;
  font-family: ${props =>
    props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
  width: 100%;
  ${props => props.$compact && `
    font-size: 0.9rem;
  `}
`;

/**
 * Header row with status indicator and expand/collapse button
 */
export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #2a2a2a;
  border-bottom: 1px solid #333;
  
  button {
    margin-left: auto;
    background: none;
    border: none;
    color: #90caf9;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(144, 202, 249, 0.1);
    }
  }
`;

/**
 * Status indicator dot
 */
export const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => STATUS_COLORS[props.$status] || '#999'};
  margin-right: 0.75rem;
  
  /* Add pulse animation for connecting status */
  animation: ${props => props.$status === CONNECTION_STATUS.CONNECTING
    ? `pulse 1.5s infinite ease-in-out`
    : 'none'};
    
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

/**
 * Status message text
 */
export const StatusMessage = styled.div`
  font-size: 0.875rem;
  color: #ddd;
`;

/**
 * Controls row with device selector and action buttons
 */
export const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

/**
 * Device selector dropdown
 */
export const DeviceSelect = styled.select`
  background-color: #333;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.875rem;
  min-width: 200px;
  flex: 1;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  option, optgroup {
    background-color: #333;
  }
`;

/**
 * Action button
 */
export const ActionButton = styled.button`
  background-color: #444;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  margin-left: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background-color: #555;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * Debug toggle button
 */
export const DebugToggle = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-align: right;
  display: block;
  width: 100%;
  text-decoration: underline;
  
  &:hover {
    color: #aaa;
  }
`;

/**
 * Debug panel
 */
export const DebugPanel = styled.div`
  border-top: 1px solid #333;
  padding: 0.75rem;
  background-color: #1a1a1a;
  font-family: monospace;
  
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    
    span {
      font-size: 0.75rem;
      color: #888;
    }
    
    button {
      background: none;
      border: none;
      color: #888;
      font-size: 0.75rem;
      cursor: pointer;
      text-decoration: underline;
      
      &:hover {
        color: #aaa;
      }
    }
  }
  
  pre {
    margin: 0;
    max-height: 150px;
    overflow-y: auto;
    font-size: 0.75rem;
    color: #0f0;
    line-height: 1.3;
  }
`;

/**
 * Error display
 */
export const ErrorDisplay = styled.div`
  margin: 0 1rem 0.75rem;
  padding: 0.75rem;
  background-color: rgba(244, 67, 54, 0.1);
  border-left: 3px solid #f44336;
  border-radius: 0 4px 4px 0;
  font-size: 0.875rem;
  color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  strong {
    color: #f44336;
  }
`;

/**
 * Message displayed when no devices are available
 */
export const NoDevicesMessage = styled.div`
  padding: 0.625rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: #bbb;
  font-size: 0.875rem;
  text-align: center;
  flex: 1;
`;

/**
 * Spinner animation
 */
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

/**
 * Loading indicator
 */
export const LoadingIndicator = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;