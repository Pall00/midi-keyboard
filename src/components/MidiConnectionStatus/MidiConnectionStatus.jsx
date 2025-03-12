// src/components/MidiConnectionStatus/MidiConnectionStatus.jsx
import PropTypes from 'prop-types';
import { 
  StatusContainer, 
  StatusIndicator, 
  StatusLabel,
  StatusMessage, 
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  ErrorActions,
  RetryButton,
  HelpLink,
  DeviceInfo
} from './MidiConnectionStatus.styles';

import { CONNECTION_STATUS } from '../../hooks/useMidiConnectionManager';

/**
 * Get status message based on connection status
 * @param {string} status - Connection status
 * @returns {string} Status message
 */
const getStatusMessage = (status, deviceName = null) => {
  switch (status) {
    case CONNECTION_STATUS.CONNECTED:
      return deviceName ? `Connected to ${deviceName}` : 'Connected';
    case CONNECTION_STATUS.CONNECTING:
      return 'Connecting to MIDI device...';
    case CONNECTION_STATUS.DISCONNECTED:
      return 'No MIDI device connected';
    case CONNECTION_STATUS.UNAVAILABLE:
      return 'MIDI is not supported in this browser';
    case CONNECTION_STATUS.ERROR:
      return 'MIDI connection error';
    default:
      return 'Unknown status';
  }
};

/**
 * Get error message and troubleshooting steps
 * @param {Object} error - Error information
 * @returns {Object} Error details
 */
const getErrorDetails = (error) => {
  if (!error) return { title: 'Unknown Error', message: 'An unknown error occurred' };

  const code = error.code || 'UNKNOWN_ERROR';
  
  switch (code) {
    case 'PERMISSION_DENIED':
      return {
        title: 'Permission Denied',
        message: 'You need to grant permission to access MIDI devices. Check your browser settings and try again.',
        helpUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess'
      };
    case 'NOT_SUPPORTED':
      return {
        title: 'Browser Not Supported',
        message: 'Your browser doesn\'t support the Web MIDI API. Please use Chrome, Edge, or Opera.',
        helpUrl: 'https://caniuse.com/midi'
      };
    case 'DEVICE_NOT_FOUND':
      return {
        title: 'Device Not Found',
        message: 'The selected MIDI device could not be found. It may have been disconnected.'
      };
    case 'CONNECTION_FAILED':
      return {
        title: 'Connection Failed',
        message: 'Failed to connect to the MIDI device. Try disconnecting and reconnecting the device.'
      };
    default:
      return {
        title: 'Connection Error',
        message: error.message || 'An unknown error occurred while connecting to the MIDI device.'
      };
  }
};

/**
 * MIDI Connection Status Component
 * 
 * Displays the current status of MIDI connection with appropriate
 * visual indicators and error information.
 */
const MidiConnectionStatus = ({
  connectionStatus,
  selectedDevice,
  error,
  onRetry,
  className,
}) => {
  // Get status message
  const statusMessage = getStatusMessage(
    connectionStatus, 
    selectedDevice?.name
  );

  // Error details
  const errorDetails = error ? getErrorDetails(error) : null;

  return (
    <StatusContainer 
      $status={connectionStatus}
      className={className}
    >
      <StatusIndicator $status={connectionStatus} />
      
      <div>
        <StatusLabel>MIDI Status:</StatusLabel>
        <StatusMessage>{statusMessage}</StatusMessage>
        
        {selectedDevice && connectionStatus === CONNECTION_STATUS.CONNECTED && (
          <DeviceInfo>
            <span>Device: {selectedDevice.name}</span>
            {selectedDevice.manufacturer && (
              <span>Manufacturer: {selectedDevice.manufacturer}</span>
            )}
          </DeviceInfo>
        )}
        
        {connectionStatus === CONNECTION_STATUS.ERROR && error && (
          <ErrorContainer>
            <ErrorTitle>{errorDetails.title}</ErrorTitle>
            <ErrorMessage>{errorDetails.message}</ErrorMessage>
            
            <ErrorActions>
              {onRetry && (
                <RetryButton onClick={onRetry}>
                  Retry Connection
                </RetryButton>
              )}
              
              {errorDetails.helpUrl && (
                <HelpLink 
                  href={errorDetails.helpUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Learn More
                </HelpLink>
              )}
            </ErrorActions>
          </ErrorContainer>
        )}
      </div>
    </StatusContainer>
  );
};

MidiConnectionStatus.propTypes = {
  /** Current connection status */
  connectionStatus: PropTypes.oneOf(Object.values(CONNECTION_STATUS)).isRequired,
  /** Currently selected MIDI device */
  selectedDevice: PropTypes.object,
  /** Error information if there's a problem */
  error: PropTypes.shape({
    message: PropTypes.string,
    code: PropTypes.string
  }),
  /** Handler for retry button */
  onRetry: PropTypes.func,
  /** Optional className for styling */
  className: PropTypes.string
};

export default MidiConnectionStatus;