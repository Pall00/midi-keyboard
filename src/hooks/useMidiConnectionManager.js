// src/hooks/useMidiConnectionManager.js
import { useState, useEffect, useCallback, useRef } from 'react';

import { formatMidiNote, getMIDIErrorCode } from '../utils/midiUtils';
import {
  saveMidiDevicePreference,
  getLastMidiDevice,
  getMidiConnectionHistory,
  saveMidiConnectionHistory,
} from '../utils/midiStorageManager';

// Connection status enum
export const CONNECTION_STATUS = {
  UNAVAILABLE: 'unavailable', // WebMIDI not supported
  DISCONNECTED: 'disconnected', // No device connected
  CONNECTING: 'connecting', // Connection in progress
  CONNECTED: 'connected', // Successfully connected
  ERROR: 'error', // Error occurred
};

/**
 * Enhanced hook for managing MIDI device connections
 *
 * Provides comprehensive device discovery, connection management,
 * error handling, and automatic reconnection to previous devices.
 *
 * @param {Object} options - Configuration options
 * @returns {Object} MIDI connection state and methods
 */
const useMidiConnectionManager = ({
  onMidiMessage,
  autoConnect = true,
  debug = false,
  autoRetry = true,
  maxRetryAttempts = 3,
} = {}) => {
  // Core state
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
  const [inputs, setInputs] = useState([]);
  const [selectedInput, setSelectedInput] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  // Refs
  const webMidiRef = useRef(null);
  const retryAttemptsRef = useRef(0);
  const retryTimeoutRef = useRef(null);

  // Helper to log debug information
  const logDebug = useCallback(
    message => {
      if (debug) {
        const timestamp = new Date().toISOString().substring(11, 23);
        setDebugInfo(prev => `${prev}\n[${timestamp}] ${message}`.trim());
        console.debug(`[MIDI] ${message}`);
      }
    },
    [debug]
  );

  /**
   * Handle MIDI device connection
   * @param {Object} e - Connection event object
   */
  const handleDeviceConnected = useCallback(
    e => {
      logDebug(`Device connected: ${e.port.name} (${e.port.id})`);

      const WebMidi = webMidiRef.current;
      if (WebMidi && WebMidi.enabled) {
        setInputs(prevInputs => {
          // Check if this is actually a new device
          const deviceExists = prevInputs.some(input => input.id === e.port.id);
          if (!deviceExists && e.port.type === 'input') {
            return [...prevInputs, e.port];
          }
          return prevInputs;
        });
      }
    },
    [logDebug]
  );

  /**
   * Handle MIDI device disconnection
   * @param {Object} e - Disconnection event object
   */
  const handleDeviceDisconnected = useCallback(
    e => {
      logDebug(`Device disconnected: ${e.port.name} (${e.port.id})`);

      const WebMidi = webMidiRef.current;
      if (WebMidi && WebMidi.enabled) {
        setInputs(prevInputs => prevInputs.filter(input => input.id !== e.port.id));

        // If the disconnected device was our selected input
        if (selectedInput && selectedInput.id === e.port.id) {
          setSelectedInput(null);
          setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
          logDebug(`Selected device ${e.port.name} was disconnected`);
        }
      }
    },
    [selectedInput, logDebug]
  );

  /**
   * Set up MIDI note handlers
   * @param {Object} input - MIDI input device
   */
  const setupMidiHandlers = useCallback(
    input => {
      if (!input) return;

      logDebug(`Setting up handlers for ${input.name}`);

      // Note on handler
      input.addListener('noteon', e => {
        const formattedNote = formatMidiNote(e.note);
        logDebug(`Note on: ${formattedNote} (velocity: ${e.velocity})`);

        if (onMidiMessage) {
          onMidiMessage({
            type: 'noteon',
            note: formattedNote,
            velocity: e.velocity,
            rawNote: e.note,
            source: input.name,
            timestamp: Date.now(),
          });
        }
      });

      // Note off handler
      input.addListener('noteoff', e => {
        const formattedNote = formatMidiNote(e.note);
        logDebug(`Note off: ${formattedNote}`);

        if (onMidiMessage) {
          onMidiMessage({
            type: 'noteoff',
            note: formattedNote,
            rawNote: e.note,
            source: input.name,
            timestamp: Date.now(),
          });
        }
      });

      // Add control change listeners (e.g., sustain pedal)
      input.addListener('controlchange', e => {
        // CC #64 is the sustain pedal
        if (e.controller.number === 64) {
          const isOn = e.value >= 64;
          logDebug(`Sustain pedal: ${isOn ? 'on' : 'off'} (value: ${e.value})`);

          if (onMidiMessage) {
            onMidiMessage({
              type: 'controlchange',
              controller: e.controller.number,
              value: e.value,
              control: 'sustain',
              isOn,
              source: input.name,
              timestamp: Date.now(),
            });
          }
        }
      });
    },
    [onMidiMessage, logDebug]
  );

  /**
   * Remove MIDI handlers
   * @param {Object} input - MIDI input device
   */
  const removeMidiHandlers = useCallback(
    input => {
      if (!input) return;

      logDebug(`Removing handlers from ${input.name}`);

      // Remove all listeners
      input.removeListener('noteon');
      input.removeListener('noteoff');
      input.removeListener('controlchange');
    },
    [logDebug]
  );

  /**
   * Connect to a MIDI device
   * @param {string} deviceId - The device ID to connect to
   * @returns {Object} Result of the connection attempt
   */
  const connectToDevice = useCallback(
    deviceId => {
      console.log('Attempting to connect to MIDI device:', deviceId);

      const WebMidi = webMidiRef.current;
      if (!WebMidi || !WebMidi.enabled) {
        logDebug('Cannot connect: WebMIDI not enabled');
        setErrorInfo({
          message: 'WebMIDI is not enabled or not available',
          code: 'NOT_ENABLED',
        });
        setConnectionStatus(CONNECTION_STATUS.ERROR);
        return { success: false, error: 'WebMIDI not enabled' };
      }

      try {
        setConnectionStatus(CONNECTION_STATUS.CONNECTING);

        // Disconnect from previous device if any
        if (selectedInput) {
          removeMidiHandlers(selectedInput);
        }

        const device = WebMidi.getInputById(deviceId);
        if (!device) {
          throw new Error(`MIDI input device with ID ${deviceId} not found`);
        }

        console.log('Found MIDI device:', device.name);
        setSelectedInput(device);
        setupMidiHandlers(device);
        setConnectionStatus(CONNECTION_STATUS.CONNECTED);
        setErrorInfo(null);
        retryAttemptsRef.current = 0; // Reset retry counter on successful connection

        // Update connection history
        const deviceName = device.name || 'Unknown Device';
        const newHistory = [
          { id: deviceId, name: deviceName, lastConnected: Date.now() },
          ...connectionHistory.filter(d => d.id !== deviceId),
        ].slice(0, 5); // Keep only last 5 devices

        setConnectionHistory(newHistory);
        saveMidiConnectionHistory(newHistory);

        // Store device ID for future sessions
        saveMidiDevicePreference(deviceId);

        logDebug(`Connected to MIDI device: ${device.name} (${deviceId})`);
        return { success: true, device };
      } catch (err) {
        console.error('Error connecting to MIDI device:', err);
        const errorCode = getMIDIErrorCode(err);
        const errorMessage = err.message || 'Failed to connect to MIDI device';

        logDebug(`Error connecting to MIDI device: ${errorMessage} (${errorCode})`);

        setErrorInfo({ message: errorMessage, code: errorCode });
        setConnectionStatus(CONNECTION_STATUS.ERROR);

        // Implement auto-retry if enabled
        if (autoRetry && retryAttemptsRef.current < maxRetryAttempts) {
          const delay = Math.pow(2, retryAttemptsRef.current) * 1000; // Exponential backoff
          logDebug(
            `Will retry connection in ${delay / 1000} seconds. Attempt ${retryAttemptsRef.current + 1} of ${maxRetryAttempts}`
          );

          retryTimeoutRef.current = setTimeout(() => {
            retryAttemptsRef.current += 1;
            connectToDevice(deviceId);
          }, delay);
        }

        return { success: false, error: errorMessage, code: errorCode };
      }
    },
    [
      selectedInput,
      removeMidiHandlers,
      setupMidiHandlers,
      logDebug,
      connectionHistory,
      autoRetry,
      maxRetryAttempts,
      setConnectionStatus,
      setSelectedInput,
      setErrorInfo,
      setConnectionHistory,
    ]
  );

  /**
   * Auto-connect to the last used device or the first available
   * @returns {Object} Result of the connection attempt
   */
  const autoConnectToDevice = useCallback(() => {
    const WebMidi = webMidiRef.current;
    if (!WebMidi || !WebMidi.enabled || inputs.length === 0) {
      return { success: false, reason: 'No devices available' };
    }

    // Check if we're already connected to something
    if (selectedInput) {
      return { success: true, device: selectedInput, reason: 'Already connected' };
    }

    // Try to connect to the last used device
    const lastUsedDeviceId = getLastMidiDevice();
    if (lastUsedDeviceId) {
      const deviceExists = inputs.some(input => input.id === lastUsedDeviceId);
      if (deviceExists) {
        logDebug(`Auto-connecting to last used device: ${lastUsedDeviceId}`);
        return connectToDevice(lastUsedDeviceId);
      }
    }

    // If no last device or it's not available, connect to first in history
    const history = getMidiConnectionHistory();
    if (history.length > 0) {
      for (const historyItem of history) {
        const deviceExists = inputs.some(input => input.id === historyItem.id);
        if (deviceExists) {
          logDebug(`Auto-connecting to device from history: ${historyItem.name}`);
          return connectToDevice(historyItem.id);
        }
      }
    }

    // If no history matches, connect to the first available device
    if (inputs.length > 0) {
      logDebug(`Auto-connecting to first available device: ${inputs[0].name}`);
      return connectToDevice(inputs[0].id);
    }

    return { success: false, reason: 'No suitable device found for auto-connection' };
  }, [inputs, selectedInput, connectToDevice, logDebug]);

  /**
   * Initialize WebMIDI
   */
  useEffect(() => {
    // Prevent multiple initializations
    if (webMidiRef.current && webMidiRef.current.enabled) {
      return;
    }

    let isMounted = true;

    // Dynamically import WebMidi to avoid SSR issues
    const initializeWebMidi = async () => {
      try {
        if (!isMounted) return;

        setConnectionStatus(CONNECTION_STATUS.CONNECTING);
        logDebug('Initializing WebMIDI...');

        // Use dynamic import for WebMidi.js
        const WebMidi = (await import('webmidi')).WebMidi;

        // Check if we've already initialized
        if (webMidiRef.current && webMidiRef.current.enabled) {
          return;
        }

        webMidiRef.current = WebMidi;

        await WebMidi.enable({ sysex: true });

        if (!isMounted) return;

        // Get connection history
        const history = getMidiConnectionHistory();
        setConnectionHistory(history);

        // Store available inputs
        setInputs(WebMidi.inputs);
        logDebug(`Found ${WebMidi.inputs.length} MIDI inputs`);

        // Set up listeners for device connections/disconnections
        WebMidi.addListener('connected', handleDeviceConnected);
        WebMidi.addListener('disconnected', handleDeviceDisconnected);

        // Try to auto-connect if enabled
        if (autoConnect && WebMidi.inputs.length > 0) {
          setTimeout(() => {
            if (isMounted) {
              autoConnectToDevice();
            }
          }, 0);
        } else {
          setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
        }

        logDebug('WebMIDI initialized successfully');
      } catch (err) {
        if (!isMounted) return;

        const errorCode = getMIDIErrorCode(err);
        const errorMessage = err.message || 'Failed to initialize WebMIDI';

        logDebug(`WebMIDI initialization failed: ${errorMessage} (${errorCode})`);

        setErrorInfo({ message: errorMessage, code: errorCode });

        // Set the appropriate connection status
        if (errorCode === 'NOT_SUPPORTED') {
          setConnectionStatus(CONNECTION_STATUS.UNAVAILABLE);
        } else {
          setConnectionStatus(CONNECTION_STATUS.ERROR);
        }
      }
    };

    // Initialize WebMIDI
    initializeWebMidi();

    // Cleanup function
    return () => {
      isMounted = false;

      const WebMidi = webMidiRef.current;
      if (WebMidi && WebMidi.enabled) {
        logDebug('Cleaning up WebMIDI...');
        WebMidi.removeListener('connected');
        WebMidi.removeListener('disconnected');

        if (selectedInput) {
          removeMidiHandlers(selectedInput);
        }

        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
      }
    };
  }, [
    // Only include dependencies that should trigger re-initialization
    autoConnect,
    logDebug,
    handleDeviceConnected,
    handleDeviceDisconnected,
    removeMidiHandlers,
    autoConnectToDevice,
  ]);

  /**
   * Disconnect from the current MIDI device
   */
  const disconnect = useCallback(() => {
    if (selectedInput) {
      removeMidiHandlers(selectedInput);
      logDebug(`Disconnected from ${selectedInput.name}`);
      setSelectedInput(null);
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    }
  }, [selectedInput, removeMidiHandlers, logDebug]);

  /**
   * Refresh the list of MIDI devices
   */
  const refreshDevices = useCallback(() => {
    const WebMidi = webMidiRef.current;
    if (!WebMidi || !WebMidi.enabled) {
      return { inputs: [] };
    }

    setIsRefreshing(true);
    logDebug('Refreshing MIDI devices...');

    // This will trigger the 'connected' event for each device
    // which will update our inputs list
    setTimeout(() => {
      setInputs([...WebMidi.inputs]);
      logDebug(`Found ${WebMidi.inputs.length} MIDI devices after refresh`);
      setIsRefreshing(false);
    }, 500);

    return { inputs: [...WebMidi.inputs] };
  }, [logDebug]);

  /**
   * Retry connection after an error
   */
  const retryConnection = useCallback(() => {
    // Clear any existing error
    setErrorInfo(null);

    // If we have a selected input, try to reconnect to it
    if (selectedInput) {
      logDebug(`Retrying connection to ${selectedInput.name}`);
      connectToDevice(selectedInput.id);
    } else if (inputs.length > 0) {
      // Otherwise try to connect to the first available device
      autoConnectToDevice();
    } else {
      // If no devices available, refresh the device list
      refreshDevices();
    }
  }, [selectedInput, inputs, connectToDevice, autoConnectToDevice, refreshDevices, logDebug]);

  return {
    // State
    connectionStatus,
    inputs,
    selectedInput,
    errorInfo,
    isRefreshing,
    connectionHistory,
    debugInfo,

    // Methods
    connectToDevice,
    autoConnectToDevice,
    disconnect,
    refreshDevices,
    retryConnection,

    // Debug helpers
    setDebugInfo,
    clearDebugInfo: () => setDebugInfo(''),
  };
};

export default useMidiConnectionManager;
