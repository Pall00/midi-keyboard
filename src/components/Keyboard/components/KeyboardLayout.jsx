// src/components/Keyboard/components/KeyboardLayout.jsx

import PropTypes from 'prop-types';

import { KeyboardContainer, KeyboardWrapper, KeysContainer } from '../Keyboard.styles';

/**
 * Component for overall keyboard layout and positioning
 * Handles the container, scrolling, and positioning context
 */
const KeyboardLayout = ({ children, width, height, totalWhiteKeys, whiteKeyWidth }) => {
  // Calculate the total keyboard width
  const totalKeyboardWidth = totalWhiteKeys * whiteKeyWidth;

  return (
    <KeyboardContainer>
      <KeyboardWrapper style={{ width: `${totalKeyboardWidth}px` }}>
        <KeysContainer
          style={{
            height: `${height}px`,
            width: `${totalKeyboardWidth}px`,
          }}
        >
          {children}
        </KeysContainer>
      </KeyboardWrapper>
    </KeyboardContainer>
  );
};

KeyboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number,
  height: PropTypes.number.isRequired,
  totalWhiteKeys: PropTypes.number.isRequired,
  whiteKeyWidth: PropTypes.number.isRequired,
};

export default KeyboardLayout;
