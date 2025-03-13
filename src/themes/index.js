// src/themes/index.js
import { defaultTheme } from '../styles/theme';

import ClassicGrandTheme from './ClassicGrandTheme';
import NeonSynthwaveTheme from './NeonSynthwaveTheme';
import MinimalistMonochromeTheme from './MinimalistMonochromeTheme';
import VintageElectricTheme from './VintageElectricTheme';
import ChildFriendlyTheme from './ChildFriendlyTheme';
import NatureInspiredTheme from './NatureInspiredTheme';

// Theme collection with descriptive names and metadata
export const pianoThemes = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'Standard piano appearance',
    theme: defaultTheme,
  },
  classicGrand: {
    id: 'classicGrand',
    name: 'Classic Grand Piano',
    description: 'Elegant concert grand piano with ivory and gold accents',
    theme: ClassicGrandTheme,
  },
  neonSynthwave: {
    id: 'neonSynthwave',
    name: 'Neon Synthwave',
    description: 'Retro-futuristic with vibrant neon colors',
    theme: NeonSynthwaveTheme,
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist Monochrome',
    description: 'Clean, modern design with grayscale colors',
    theme: MinimalistMonochromeTheme,
  },
  vintageElectric: {
    id: 'vintageElectric',
    name: 'Vintage Electric Piano',
    description: 'Warm, nostalgic colors inspired by classic electric pianos',
    theme: VintageElectricTheme,
  },
  childFriendly: {
    id: 'childFriendly',
    name: 'Child-Friendly Rainbow',
    description: 'Colorful, playful design perfect for learning',
    theme: ChildFriendlyTheme,
  },
  natureInspired: {
    id: 'natureInspired',
    name: 'Nature-Inspired Organic',
    description: 'Earthy colors and organic feel',
    theme: NatureInspiredTheme,
  },
};

// Helper to get a theme by ID
export const getThemeById = themeId => {
  return pianoThemes[themeId]?.theme || defaultTheme;
};

// Export individual themes for direct import
export {
  ClassicGrandTheme,
  NeonSynthwaveTheme,
  MinimalistMonochromeTheme,
  VintageElectricTheme,
  ChildFriendlyTheme,
  NatureInspiredTheme,
};

// Default export for convenience
export default pianoThemes;
