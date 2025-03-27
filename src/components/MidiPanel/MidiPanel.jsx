// src/components/MidiPanel/MidiPanel.jsx
// Merged component that replaces MidiManager, MidiDeviceSelector, and MidiConnectionStatus
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import useMidiConnectionManager, { CONNECTION_STATUS } from '../../hooks/useMidiConnectionManager';
import { getMidiPreferences, saveMidiPreferences } from '../../utils/midiStorageManager';

import {
  PanelContainer,
  HeaderRow,
  StatusIndicator, 
  DeviceSelect,
  ControlsRow,
  ActionButton,
  DebugToggle,
  DebugPanel,
  StatusMessage,
  ErrorDisplay,
  NoDevicesMessage,
  LoadingIndicator
} from './MidiPanel.styles';

/**
 * Integrated MIDI Panel Component
 *
 * Combines MIDI connection status, device selection, and controls in a single component
 * with a streamlined interface.
 */
const MidiPanel = ({
  onMidiMessage,
  onConnectionChange,
  autoConnect = true,
  compact = false,
  className,
  initialExpanded = false,
}) => {
  // Get user preferences
  const preferences = getMidiPreferences();

  // State
  const [expanded, setExpanded] = useState(initialExpanded);
  const [showDebug, setShowDebug] = useState(preferences.showDebugInfo || false);

  // Use MIDI connection manager hook
  const {
    connectionStatus,
    inputs,
    selectedInput,
    errorInfo,
    isRefreshing,
    connectionHistory,
    debugInfo,
    connectToDevice,
    disconnect,
    refreshDevices,
    retryConnection,
    clearDebugInfo,
  } = useMidiConnectionManager({
    onMidiMessage,
    autoConnect,
    debug: showDebug,
  });

  // Determine if connected
  const isConnected = connectionStatus === CONNECTION_STATUS.CONNECTED;

  // Notify parent when connection status changes
  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange({
        status: connectionStatus,
        device: selectedInput,
        error: errorInfo,
      });
    }
  }, [connectionStatus, selectedInput, errorInfo, onConnectionChange]);

  // Toggle debug info
  const toggleDebug = useCallback(() => {
    const newState = !showDebug;
    setShowDebug(newState);
    saveMidiPreferences({ showDebugInfo: newState });
  }, [showDebug]);

  // Handle device selection
  const handleDeviceChange = useCallback(event => {
    const deviceId = event.target.value;
    if (deviceId) {
      connectToDevice(deviceId);
    }
  }, [connectToDevice]);

  // Get status message based on connection status
  const getStatusMessage = useCallback(() => {
    switch (connectionStatus) {
      case CONNECTION_STATUS.CONNECTED:
        return selectedInput 
          ? `Connected to ${selectedInput.name}` 
          : 'Connected';
      case CONNECTION_STATUS.CONNECTING:
        return 'Connecting...';
      case CONNECTION_STATUS.DISCONNECTED:
        return 'No MIDI device connected';
      case CONNECTION_STATUS.UNAVAILABLE:
        return 'MIDI not supported in this browser';
      case CONNECTION_STATUS.ERROR:
        return 'Connection error';
      default:
        return 'Unknown status';
    }
  }, [connectionStatus, selectedInput]);

  // Is MIDI available?
  const midiAvailable = connectionStatus !== CONNECTION_STATUS.UNAVAILABLE;

  return (
    <PanelContainer className={className} $compact={compact}>
      <HeaderRow>
        <StatusIndicator $status={connectionStatus} />
        <StatusMessage>{getStatusMessage()}</StatusMessage>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide' : 'Show'}
        </button>
      </HeaderRow>

      {expanded && (
        <>
          <ControlsRow>
            {/* Device selector dropdown */}
            {inputs.length > 0 ? (
              <DeviceSelect
                value={selectedInput ? selectedInput.id : ''}
                onChange={handleDeviceChange}
                disabled={!midiAvailable || isRefreshing}
                aria-label="Select MIDI device"
              >
                <option value="">-- Select MIDI device --</option>
                {connectionHistory.length > 0 && (
                  <optgroup label="Recently Used">
                    {connectionHistory
                      .filter(device => inputs.some(input => input.id === device.id))
                      .map(device => (
                        <option key={device.id} value={device.id}>
                          {device.name || 'Unknown Device'}
                        </option>
                      ))}
                  </optgroup>
                )}
                <optgroup label={connectionHistory.length > 0 ? 'Other Devices' : 'Available Devices'}>
                  {inputs
                    .filter(device => !connectionHistory.some(hist => hist.id === device.id))
                    .map(device => (
                      <option key={device.id} value={device.id}>
                        {device.name || 'Unknown Device'}
                      </option>
                    ))}
                </optgroup>
              </DeviceSelect>
            ) : (
              <NoDevicesMessage>
                No MIDI devices detected. {midiAvailable ? 'Connect a device and click "Refresh".' : ''}
              </NoDevicesMessage>
            )}

            {/* Action buttons */}
            <div>
              <ActionButton
                onClick={refreshDevices}
                disabled={isRefreshing || !midiAvailable}
                aria-label="Refresh MIDI devices"
              >
                {isRefreshing ? (
                  <>
                    <LoadingIndicator />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <span>Refresh</span>
                )}
              </ActionButton>

              {isConnected && (
                <ActionButton 
                  onClick={disconnect}
                  aria-label="Disconnect MIDI device"
                >
                  Disconnect
                </ActionButton>
              )}
            </div>
          </ControlsRow>

          {/* Error display */}
          {errorInfo && (
            <ErrorDisplay>
              <div>
                <strong>{errorInfo.code || 'Error'}</strong>: {errorInfo.message}
              </div>
              <ActionButton onClick={retryConnection}>
                Retry
              </ActionButton>
            </ErrorDisplay>
          )}

          {/* Debug toggle */}
          <DebugToggle onClick={toggleDebug}>
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </DebugToggle>

          {/* Debug panel */}
          {showDebug && (
            <DebugPanel>
              <div>
                <span>MIDI Debug Log</span>
                <button onClick={clearDebugInfo}>Clear</button>
              </div>
              <pre>{debugInfo || 'No debug information available'}</pre>
            </DebugPanel>
          )}
        </>
      )}
    </PanelContainer>
  );
};

MidiPanel.propTypes = {
  /** Handler for MIDI messages */
  onMidiMessage: PropTypes.func.isRequired,
  /** Handler for connection status changes */
  onConnectionChange: PropTypes.func,
  /** Whether to auto-connect to previously used devices */
  autoConnect: PropTypes.bool,
  /** Whether to use a compact layout */
  compact: PropTypes.bool,
  /** Optional className for custom styling */
  className: PropTypes.string,
  /** Whether the panel is initially expanded */
  initialExpanded: PropTypes.bool,
};

export default MidiPanel;