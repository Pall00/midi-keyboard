// src/components/MidiManager/MidiManager.jsx
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';


import MidiDeviceSelector from '../MidiDeviceSelector';
import MidiConnectionStatus from '../MidiConnectionStatus';
import useMidiConnectionManager, { CONNECTION_STATUS } from '../../hooks/useMidiConnectionManager';
import { getMidiPreferences, saveMidiPreferences } from '../../utils/midiStorageManager';

import {
  ManagerContainer,
  ControlsContainer,
  Title,
  ToggleButton,
  ManagerContent,
  DebugPanel,
  DebugHeader,
  DebugContent,
  ClearButton,
} from './MidiManager.styles';

/**
 * MIDI Manager Component
 *
 * Integrated component to handle all MIDI device connection management
 * with UI for device selection, connection status, and debug information.
 */
const MidiManager = ({
  onMidiMessage,
  onConnectionChange,
  compact = false,
  autoConnect = true,
  className,
  initialExpanded = false,
}) => {
  // Get user preferences
  const preferences = getMidiPreferences();

  // Local state
  const [expanded, setExpanded] = useState(initialExpanded);
  const [showDebug, setShowDebug] = useState(preferences.showDebugInfo || false);

  // Use our MIDI connection manager hook
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

  // Handle connection status changes
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

  return (
    <ManagerContainer className={className}>
      <ControlsContainer>
        <Title>MIDI Device</Title>

        <ToggleButton
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls="midi-manager-content"
        >
          {expanded ? 'Hide' : 'Show'} Controls
        </ToggleButton>
      </ControlsContainer>

      <ManagerContent id="midi-manager-content" $expanded={expanded} $compact={compact}>
        {/* Connection status display */}
        <MidiConnectionStatus
          connectionStatus={connectionStatus}
          selectedDevice={selectedInput}
          error={errorInfo}
          onRetry={retryConnection}
        />

        {/* Device selector */}
        <MidiDeviceSelector
          devices={inputs}
          selectedDevice={selectedInput}
          connectionStatus={connectionStatus}
          connectionHistory={connectionHistory}
          onDeviceSelect={connectToDevice}
          onRefresh={refreshDevices}
          onDisconnect={disconnect}
          isRefreshing={isRefreshing}
          disabled={connectionStatus === CONNECTION_STATUS.UNAVAILABLE}
        />

        {/* Debug panel */}
        {showDebug && (
          <DebugPanel>
            <DebugHeader>
              <span>MIDI Debug Information</span>
              <ClearButton onClick={clearDebugInfo}>Clear</ClearButton>
            </DebugHeader>
            <DebugContent>{debugInfo || 'No debug info available'}</DebugContent>
          </DebugPanel>
        )}

        {/* Debug toggle */}
        <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
          <button
            onClick={toggleDebug}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
        </div>
      </ManagerContent>
    </ManagerContainer>
  );
};

MidiManager.propTypes = {
  /** Handler for MIDI messages */
  onMidiMessage: PropTypes.func.isRequired,
  /** Handler for connection status changes */
  onConnectionChange: PropTypes.func,
  /** Whether to use a compact layout */
  compact: PropTypes.bool,
  /** Whether to auto-connect to previously used devices */
  autoConnect: PropTypes.bool,
  /** Optional className for styling */
  className: PropTypes.string,
  /** Whether the controls are initially expanded */
  initialExpanded: PropTypes.bool,
};

export default MidiManager;
