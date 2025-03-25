// src/components/ThemeSelector/ThemeSelector.styles.js
import styled from 'styled-components';

/**
 * Main container for the theme selector
 */
export const SelectorContainer = styled.div`
  padding: 1rem;
  background-color: #222;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Title for the selector
 */
export const Title = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Grid container for theme cards
 */
export const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

/**
 * Individual theme card
 */
export const ThemeCard = styled.div`
  background-color: ${props => props.$isSelected ? '#333' : '#2A2A2A'};
  border-radius: 6px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border: 2px solid ${props => props.$isSelected ? '#4568dc' : 'transparent'};
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
  
  &:hover {
    background-color: #333;
    transform: translateY(-2px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(69, 104, 220, 0.5);
  }
`;

/**
 * Theme name display
 */
export const ThemeName = styled.h4`
  color: #fff;
  font-size: 1rem;
  margin: 0.75rem 0 0.25rem;
  font-weight: 500;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Theme description
 */
export const ThemeDescription = styled.p`
  color: #aaa;
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.4;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
`;

/**
 * Visual preview of the theme
 */
export const ThemePreview = styled.div`
  height: 60px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: ${props => props.$theme?.colors?.blackKey || '#333'};
  border-radius: 4px;
  overflow: hidden;
  padding: 0.25rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
`;

/**
 * Preview white piano key
 */
export const WhiteKey = styled.div`
  width: 25px;
  height: 50px;
  background-color: ${props => 
    props.$isActive 
      ? props.$theme?.colors?.activeWhiteKey || '#E0E8FF'
      : props.$theme?.colors?.whiteKey || '#FFF'
  };
  border: 1px solid ${props => props.$theme?.colors?.keyBorder || '#DDD'};
  border-radius: 0 0 2px 2px;
  margin: 0 1px;
  position: relative;
  z-index: 1;
`;

/**
 * Preview black piano key
 */
export const BlackKey = styled.div`
  width: 16px;
  height: 35px;
  background-color: ${props => 
    props.$isActive 
      ? props.$theme?.colors?.activeBlackKey || '#555'
      : props.$theme?.colors?.blackKey || '#333'
  };
  border: 1px solid ${props => props.$theme?.colors?.blackKeyBorder || '#222'};
  border-radius: 0 0 2px 2px;
  margin: 0 -8px;
  position: relative;
  z-index: 2;
`;

/**
 * Selected theme indicator
 */
export const SelectedIndicator = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4568dc;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: white;
  }
`;

/**
 * Container for dropdown display mode
 */
export const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
  
  label {
    color: #ddd;
    font-size: 0.875rem;
  }
`;

/**
 * Theme selection dropdown
 */
export const ThemeDropdown = styled.select`
  background-color: #444;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  font-family: ${props => props.theme.typography?.fontFamily ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};
  
  &:focus {
    outline: none;
    border-color: #4568dc;
  }
`;