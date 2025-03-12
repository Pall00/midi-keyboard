// src/components/MidiDeviceSelector/MidiDeviceSelector.styles.js
import styled, { keyframes } from 'styled-components';

/**
 * Main container for the device selector
 */
export const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

/**
 * Device selection dropdown
 */
export const DeviceSelect = styled.select`
  width: 100%;
  padding: 0.625rem;
  background-color: #444;
  color: #fff;
  border: 1px solid #555;
  border-radius: 4px;
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4568dc;
    box-shadow: 0 0 0 2px rgba(69, 104, 220, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * Device group in the dropdown
 */
export const RecentDevicesGroup = styled.optgroup`
  font-weight: 600;
  color: #bbb;
  background-color: #333;
`;

/**
 * Other devices group in the dropdown
 */
export const OtherDevicesGroup = styled.optgroup`
  color: #999;
  background-color: #333;
`;

/**
 * Device option in the dropdown
 */
export const DeviceOption = styled.option`
  padding: 0.5rem;
  background-color: ${props => props.$isConnected ? '#2a4080' : '#444'};
  color: ${props => props.$isConnected ? '#fff' : '#ddd'};
  font-weight: ${props => props.$isConnected ? 600 : 400};
`;

/**
 * Container for buttons
 */
export const ButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

/**
 * Base button style
 */
const BaseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(69, 104, 220, 0.4);
  }
`;

/**
 * Refresh devices button
 */
export const RefreshButton = styled(BaseButton)`
  background-color: #444;
  color: #fff;

  &:hover:not(:disabled) {
    background-color: #555;
  }

  &:active:not(:disabled) {
    background-color: #333;
    transform: translateY(1px);
  }
`;

/**
 * Disconnect button
 */
export const DisconnectButton = styled(BaseButton)`
  background-color: #733;
  color: #fff;

  &:hover:not(:disabled) {
    background-color: #933;
  }

  &:active:not(:disabled) {
    background-color: #622;
    transform: translateY(1px);
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
  font-family: ${props => props.theme.typography?.fontFamily || 
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
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