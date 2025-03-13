// src/components/ThemeSelector/ThemeSelector.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { pianoThemes } from '../../themes';

import {
  SelectorContainer,
  Title,
  ThemeGrid,
  ThemeCard,
  ThemeName,
  ThemeDescription,
  ThemePreview,
  WhiteKey,
  BlackKey,
  SelectedIndicator,
  DropdownContainer,
  ThemeDropdown,
} from './ThemeSelector.styles';

// LocalStorage key for saving the user's theme preference
const THEME_STORAGE_KEY = 'piano_theme_preference';

/**
 * Theme Selector Component
 *
 * Allows users to select from available piano themes with visual previews.
 */
const ThemeSelector = ({ onThemeChange, initialTheme = 'default', displayMode = 'grid' }) => {
  const [selectedThemeId, setSelectedThemeId] = useState(initialTheme);

  // On mount, try to load saved theme preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && pianoThemes[savedTheme]) {
        setSelectedThemeId(savedTheme);
        if (onThemeChange) {
          onThemeChange(pianoThemes[savedTheme].theme, savedTheme);
        }
      } else {
        // If no saved theme or theme not found, use the initial theme
        if (onThemeChange && pianoThemes[initialTheme]) {
          onThemeChange(pianoThemes[initialTheme].theme, initialTheme);
        }
      }
    } catch (error) {
      console.error('Error loading saved theme preference:', error);
      // Fall back to initial theme on error
      if (onThemeChange && pianoThemes[initialTheme]) {
        onThemeChange(pianoThemes[initialTheme].theme, initialTheme);
      }
    }
  }, [onThemeChange, initialTheme]);

  // Handle theme selection
  const handleThemeSelect = themeId => {
    console.log(`Theme selected: ${themeId}`);

    if (!pianoThemes[themeId]) {
      console.error(`Selected theme ID not found: ${themeId}`);
      return;
    }

    setSelectedThemeId(themeId);

    // Save preference to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }

    // Debug log theme colors
    console.log(`Applying theme: ${themeId}`, {
      colors: pianoThemes[themeId].theme.colors,
    });

    // Notify parent component
    if (onThemeChange) {
      onThemeChange(pianoThemes[themeId].theme, themeId);
    }
  };

  // Handle dropdown change
  const handleDropdownChange = e => {
    handleThemeSelect(e.target.value);
  };

  // Theme array from object for easier mapping
  const themeArray = Object.values(pianoThemes);

  // Grid display mode
  if (displayMode === 'grid') {
    return (
      <SelectorContainer>
        <Title>Piano Theme</Title>
        <ThemeGrid>
          {themeArray.map(themeItem => (
            <ThemeCard
              key={themeItem.id}
              $isSelected={selectedThemeId === themeItem.id}
              onClick={() => handleThemeSelect(themeItem.id)}
              role="button"
              tabIndex={0}
              aria-pressed={selectedThemeId === themeItem.id}
              aria-label={`${themeItem.name} theme`}
            >
              {/* Theme preview - mini piano keys */}
              <ThemePreview $theme={themeItem.theme}>
                <WhiteKey $theme={themeItem.theme} $isActive={false} />
                <BlackKey $theme={themeItem.theme} $isActive={false} />
                <WhiteKey $theme={themeItem.theme} $isActive={true} />
                <BlackKey $theme={themeItem.theme} $isActive={true} />
                <WhiteKey $theme={themeItem.theme} $isActive={false} />
              </ThemePreview>

              <ThemeName>{themeItem.name}</ThemeName>
              <ThemeDescription>{themeItem.description}</ThemeDescription>

              {selectedThemeId === themeItem.id && <SelectedIndicator />}
            </ThemeCard>
          ))}
        </ThemeGrid>
      </SelectorContainer>
    );
  }

  // Dropdown display mode
  return (
    <DropdownContainer>
      <label htmlFor="theme-select">Theme: </label>
      <ThemeDropdown id="theme-select" value={selectedThemeId} onChange={handleDropdownChange}>
        {themeArray.map(themeItem => (
          <option key={themeItem.id} value={themeItem.id}>
            {themeItem.name}
          </option>
        ))}
      </ThemeDropdown>
    </DropdownContainer>
  );
};

ThemeSelector.propTypes = {
  /** Handler for theme changes */
  onThemeChange: PropTypes.func.isRequired,
  /** Initial theme ID */
  initialTheme: PropTypes.string,
  /** Display mode: 'grid' or 'dropdown' */
  displayMode: PropTypes.oneOf(['grid', 'dropdown']),
};

export default ThemeSelector;
