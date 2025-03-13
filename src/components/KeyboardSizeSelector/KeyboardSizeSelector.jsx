// src/components/KeyboardSizeSelector/KeyboardSizeSelector.jsx
import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { getKeyboardLayoutsArray, getKeyboardLayout } from '../../utils/keyboardLayouts';

import {
  SelectorContainer,
  SelectorLabel,
  SizeSelect,
  ButtonsContainer,
  SizeButton,
  LayoutInfo,
} from './KeyboardSizeSelector.styles';

/**
 * Keyboard Size Selector Component
 *
 * Allows users to select from predefined keyboard layouts
 * with different key ranges and sizes.
 */
const KeyboardSizeSelector = ({
  selectedLayout,
  onChange,
  displayMode = 'dropdown',
  showInfo = true,
  vertical = false,
  disabled = false,
  className,
}) => {
  // Get all available layouts
  const layouts = getKeyboardLayoutsArray();

  // Get the current layout object based on the selected ID
  const currentLayout = getKeyboardLayout(selectedLayout);

  // Handle layout selection change
  const handleChange = useCallback(
    event => {
      const layoutId = event.target.value;
      if (onChange) {
        onChange(layoutId);
      }
    },
    [onChange]
  );

  // Handle button click for button mode
  const handleButtonClick = useCallback(
    layoutId => {
      if (onChange && !disabled) {
        onChange(layoutId);
      }
    },
    [onChange, disabled]
  );

  // Format for display as dropdown
  if (displayMode === 'dropdown') {
    return (
      <SelectorContainer $vertical={vertical} className={className}>
        <SelectorLabel htmlFor="keyboard-size-select">Keyboard Size</SelectorLabel>

        <div>
          <SizeSelect
            id="keyboard-size-select"
            value={selectedLayout}
            onChange={handleChange}
            disabled={disabled}
          >
            {layouts.map(layout => (
              <option key={layout.id} value={layout.id}>
                {layout.name}
              </option>
            ))}
          </SizeSelect>

          {showInfo && (
            <LayoutInfo $vertical={vertical}>
              {currentLayout.keyCount} keys | {currentLayout.startNote} to {currentLayout.endNote}
            </LayoutInfo>
          )}
        </div>
      </SelectorContainer>
    );
  }

  // Format for display as buttons
  return (
    <SelectorContainer $vertical className={className}>
      <SelectorLabel>Keyboard Size</SelectorLabel>

      <div>
        <ButtonsContainer>
          {layouts.map(layout => (
            <SizeButton
              key={layout.id}
              $selected={selectedLayout === layout.id}
              onClick={() => handleButtonClick(layout.id)}
              disabled={disabled}
              title={layout.description}
            >
              {layout.keyCount} Keys
            </SizeButton>
          ))}
        </ButtonsContainer>

        {showInfo && (
          <LayoutInfo>
            {currentLayout.name} | {currentLayout.startNote} to {currentLayout.endNote}
          </LayoutInfo>
        )}
      </div>
    </SelectorContainer>
  );
};

KeyboardSizeSelector.propTypes = {
  /** Currently selected layout ID */
  selectedLayout: PropTypes.string.isRequired,
  /** Handler for when layout selection changes */
  onChange: PropTypes.func.isRequired,
  /** How to display the selector: 'dropdown' or 'buttons' */
  displayMode: PropTypes.oneOf(['dropdown', 'buttons']),
  /** Whether to show additional info about the selected layout */
  showInfo: PropTypes.bool,
  /** Whether to layout the component vertically */
  vertical: PropTypes.bool,
  /** Whether the selector is disabled */
  disabled: PropTypes.bool,
  /** Optional className for custom styling */
  className: PropTypes.string,
};

export default KeyboardSizeSelector;
