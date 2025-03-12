// src/components/MidiDeviceSelector/MidiDeviceSelector.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  SelectorContainer, 
  DeviceSelect, 
  ButtonsRow, 
  RefreshButton, 
  DisconnectButton, 
  NoDevicesMessage,
  LoadingIndicator,
  DeviceOption,
  RecentDevicesGroup,
  OtherDevicesGroup
} from './MidiDeviceSelector.styles';

import { CONNECTION_STATUS } from '../../hooks/useMidiConnectionManager';

/**
 * MIDI Device Selector Component
 *
 * Provides a dropdown to select from available MIDI devices
 * with additional buttons for refreshing and disconnecting.
 */
const MidiDeviceSelector = ({
  devices = [],
  selectedDevice = null,
  connectionStatus,
  connectionHistory = [],
  onDeviceSelect,
  onRefresh,
  onDisconnect,
  isRefreshing,
  disabled = false,
  className,
}) => {




  // Group devices by recency
  const [recentDevices, setRecentDevices] = useState([]);
  const [otherDevices, setOtherDevices] = useState([]);

  // Process devices into groups
  useEffect(() => {
    if (!devices || !connectionHistory) return;
    
    // Get the set of recently connected device IDs
    const recentIds = new Set(connectionHistory.map(item => item.id));
    
    // Split devices into recent and other
    const recent = [];
    const others = [];
    
    devices.forEach(device => {
      if (recentIds.has(device.id)) {
        recent.push(device);
      } else {
        others.push(device);
      }
    });
    
    // Sort recent devices based on their position in history
    recent.sort((a, b) => {
      const aIndex = connectionHistory.findIndex(item => item.id === a.id);
      const bIndex = connectionHistory.findIndex(item => item.id === b.id);
      return aIndex - bIndex;
    });
    
    setRecentDevices(recent);
    setOtherDevices(others);
  }, [devices, connectionHistory]);

  // Handle device selection
  const handleDeviceChange = (e) => {
    const deviceId = e.target.value;
    console.log("Device selected in dropdown:", deviceId);
    if (deviceId && onDeviceSelect) {
      onDeviceSelect(deviceId);
    }
  };

  // Check if we're connecting
  const isConnecting = connectionStatus === CONNECTION_STATUS.CONNECTING;
  
  // Check if we need to disable the selector
  const shouldDisableSelector = disabled || 
                              isConnecting || 
                              connectionStatus === CONNECTION_STATUS.UNAVAILABLE;

  

  return (
    <SelectorContainer className={className}>
      <DeviceSelect
        value={selectedDevice ? selectedDevice.id : ""}
        onChange={handleDeviceChange}
        disabled={shouldDisableSelector}
        aria-label="Select MIDI device"
      >
        <option value="">-- Select a MIDI device --</option>
        
        {/* Show recently used devices first */}
        {recentDevices.length > 0 && (
          <RecentDevicesGroup label="Recently Used">
            {recentDevices.map(device => (
              <DeviceOption 
                key={device.id} 
                value={device.id}
                $isConnected={selectedDevice && selectedDevice.id === device.id}
              >
                {device.name || "Unknown Device"}
              </DeviceOption>
            ))}
          </RecentDevicesGroup>
        )}
        
        {/* Show other devices */}
        {otherDevices.length > 0 && (
          <OtherDevicesGroup label={recentDevices.length > 0 ? "Other Devices" : "Available Devices"}>
            {otherDevices.map(device => (
              <DeviceOption 
                key={device.id} 
                value={device.id}
                $isConnected={selectedDevice && selectedDevice.id === device.id}
              >
                {device.name || "Unknown Device"}
              </DeviceOption>
            ))}
          </OtherDevicesGroup>
        )}
      </DeviceSelect>

      <ButtonsRow>
        <RefreshButton 
          onClick={onRefresh}
          disabled={isRefreshing || disabled}
          aria-label="Refresh MIDI devices"
        >
          {isRefreshing ? (
            <>
              <LoadingIndicator />
              <span>Refreshing...</span>
            </>
          ) : (
            <span>Refresh Devices</span>
          )}
        </RefreshButton>
        
        {selectedDevice && (
          <DisconnectButton 
            onClick={onDisconnect}
            disabled={disabled}
            aria-label="Disconnect MIDI device"
          >
            Disconnect
          </DisconnectButton>
        )}
      </ButtonsRow>
      
      {/* No devices message */}
      {devices.length === 0 && !isRefreshing && (
        <NoDevicesMessage>
          No MIDI devices detected. Connect a device and click "Refresh Devices".
        </NoDevicesMessage>
      )}
    </SelectorContainer>
  );
};

MidiDeviceSelector.propTypes = {
  /** Array of available MIDI devices */
  devices: PropTypes.array,
  /** Currently selected MIDI device */
  selectedDevice: PropTypes.object,
  /** Current connection status */
  connectionStatus: PropTypes.oneOf(Object.values(CONNECTION_STATUS)),
  /** Array of recently connected devices */
  connectionHistory: PropTypes.array,
  /** Handler for device selection */
  onDeviceSelect: PropTypes.func.isRequired,
  /** Handler for refreshing the device list */
  onRefresh: PropTypes.func.isRequired,
  /** Handler for disconnecting the current device */
  onDisconnect: PropTypes.func.isRequired,
  /** Whether devices are currently being refreshed */
  isRefreshing: PropTypes.bool,
  /** Whether the selector is disabled */
  disabled: PropTypes.bool,
  /** Optional className for styling */
  className: PropTypes.string,
};

export default MidiDeviceSelector;