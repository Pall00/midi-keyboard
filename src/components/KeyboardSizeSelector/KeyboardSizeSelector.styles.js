// src/components/KeyboardSizeSelector/KeyboardSizeSelector.styles.js
import styled from 'styled-components';

/**
 * Container for the keyboard size selector
 */
export const SelectorContainer = styled.div`
  display: flex;
  flex-direction: ${props => (props.$vertical ? 'column' : 'row')};
  gap: 0.75rem;
  align-items: center;
`;

/**
 * Label for the selector
 */
export const SelectorLabel = styled.label`
  color: #ddd;
  font-size: 0.875rem;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Select dropdown for keyboard layouts
 */
export const SizeSelect = styled.select`
  background-color: #444;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
  min-width: 150px;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};

  &:focus {
    outline: none;
    border-color: #4568dc;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * Container for button-style selectors
 */
export const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

/**
 * Individual size selector button
 */
export const SizeButton = styled.button`
  background-color: ${props => (props.$selected ? '#4568dc' : '#444')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};

  &:hover {
    background-color: ${props => (props.$selected ? '#3a57c4' : '#555')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * Helper text showing key count and range
 */
export const LayoutInfo = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  margin-top: ${props => (props.$vertical ? '0.25rem' : '0')};
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;