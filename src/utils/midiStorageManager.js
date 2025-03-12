// src/utils/midiStorageManager.js

// Storage keys
const STORAGE_KEYS = {
    LAST_DEVICE: 'midi_last_device',
    CONNECTION_HISTORY: 'midi_connection_history',
    PREFERENCES: 'midi_preferences'
  };
  
  /**
   * Save the ID of the last connected MIDI device
   * @param {string} deviceId - MIDI device ID
   */
  export const saveMidiDevicePreference = (deviceId) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_DEVICE, deviceId);
    } catch (error) {
      console.error('Error saving MIDI device preference:', error);
    }
  };
  
  /**
   * Get the ID of the last connected MIDI device
   * @returns {string|null} Device ID or null if not found
   */
  export const getLastMidiDevice = () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_DEVICE);
    } catch (error) {
      console.error('Error retrieving last MIDI device:', error);
      return null;
    }
  };
  
  /**
   * Save the connection history of MIDI devices
   * @param {Array} devices - Array of device objects with id, name and lastConnected properties
   */
  export const saveMidiConnectionHistory = (devices) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONNECTION_HISTORY, JSON.stringify(devices));
    } catch (error) {
      console.error('Error saving MIDI connection history:', error);
    }
  };
  
  /**
   * Get the connection history of MIDI devices
   * @returns {Array} Array of device objects or empty array if not found
   */
  export const getMidiConnectionHistory = () => {
    try {
      const historyData = localStorage.getItem(STORAGE_KEYS.CONNECTION_HISTORY);
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      console.error('Error retrieving MIDI connection history:', error);
      return [];
    }
  };
  
  /**
   * Save user preferences for MIDI behavior
   * @param {Object} preferences - User preferences object
   */
  export const saveMidiPreferences = (preferences) => {
    try {
      const existingPrefs = getMidiPreferences();
      const updatedPrefs = { ...existingPrefs, ...preferences };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPrefs));
    } catch (error) {
      console.error('Error saving MIDI preferences:', error);
    }
  };
  
  /**
   * Get user preferences for MIDI behavior
   * @returns {Object} User preferences or default values
   */
  export const getMidiPreferences = () => {
    try {
      const prefsData = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return prefsData ? JSON.parse(prefsData) : {
        autoConnect: true,
        showDebugInfo: false,
        velocitySensitive: true,
        autoRetry: true,
        midiInputChannel: 'all' // 'all' or specific channel number
      };
    } catch (error) {
      console.error('Error retrieving MIDI preferences:', error);
      return {
        autoConnect: true,
        showDebugInfo: false,
        velocitySensitive: true,
        autoRetry: true,
        midiInputChannel: 'all'
      };
    }
  };
  
  /**
   * Clear all stored MIDI preferences and history
   */
  export const clearMidiStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.LAST_DEVICE);
      localStorage.removeItem(STORAGE_KEYS.CONNECTION_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    } catch (error) {
      console.error('Error clearing MIDI storage:', error);
    }
  };