// src/components/MidiConnectionStatus/MidiConnectionStatus.styles.js
import styled, { keyframes, css } from 'styled-components';
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
 * Main container for the status display
 */
export const StatusContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 4px;
  background-color: ${props => STATUS_BACKGROUNDS[props.$status] || 'rgba(0, 0, 0, 0.1)'};
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Pulse animation for connecting status
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

// Blink animation for error status
const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

/**
 * Visual indicator showing connection status
 */
export const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => STATUS_COLORS[props.$status] || '#999'};
  margin-top: 0.25rem;
  
  /* Apply animations based on status */
  animation: ${props => {
    if (props.$status === CONNECTION_STATUS.CONNECTING) {
      return css`${pulse} 1.5s infinite ease-in-out`;
    }
    if (props.$status === CONNECTION_STATUS.ERROR) {
      return css`${blink} 2s infinite ease-in-out`;
    }
    return 'none';
  }};
`;

/**
 * Label for status
 */
export const StatusLabel = styled.div`
  font-size: 0.75rem;
  color: #999;
  margin-bottom: 0.25rem;
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Status message text
 */
export const StatusMessage = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors?.whiteKeyText || '#555'};
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Connected device information
 */
export const DeviceInfo = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #aaa;
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Error container
 */
export const ErrorContainer = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: rgba(244, 67, 54, 0.05);
  border-left: 3px solid #F44336;
  border-radius: 0 4px 4px 0;
`;

/**
 * Error title
 */
export const ErrorTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: #F44336;
  margin-bottom: 0.375rem;
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Error message
 */
export const ErrorMessage = styled.div`
  font-size: 0.8125rem;
  color: #ddd;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Error action buttons container
 */
export const ErrorActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.625rem;
`;

/**
 * Retry button
 */
export const RetryButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
  border: 1px solid rgba(244, 67, 54, 0.5);
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
  
  &:hover {
    background-color: rgba(244, 67, 54, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
  }
`;

/**
 * Help link for errors
 */
export const HelpLink = styled.a`
  font-size: 0.75rem;
  color: #90CAF9;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
  
  &:hover {
    text-decoration: underline;
    color: #64B5F6;
  }
  
  &:focus {
    outline: none;
    text-decoration: underline;
  }
`;