import React, { useState } from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { Palette } from 'lucide-react';

// Theme option component - shows a preview of the theme
const ThemeOption = ({ theme, active, onClick }) => {
  const themeColors = {
    [THEMES.DEFAULT]: ['bg-black', 'bg-gray-900', 'bg-zinc-900/20'],
    [THEMES.DARK]: ['bg-black', 'bg-gray-950', 'bg-gray-900'],
    [THEMES.PURPLE]: ['bg-zinc-950', 'bg-zinc-900', 'bg-zinc-900'],
    [THEMES.GRADIENT]: ['bg-gray-900', 'bg-zinc-900/30', 'bg-black'],
  };
  
  const colors = themeColors[theme] || themeColors[THEMES.DEFAULT];
  const themeNames = {
    [THEMES.DEFAULT]: 'Default',
    [THEMES.DARK]: 'Dark',
    [THEMES.PURPLE]: 'Purple',
    [THEMES.GRADIENT]: 'Gradient',
  };
  
  return (
    <button
      onClick={() => onClick(theme)}
      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
        active ? 'bg-white/10 scale-110' : 'hover:bg-white/5'
      }`}
    >
      <div className="w-12 h-6 rounded-md overflow-hidden flex mb-1">
        {colors.map((color, index) => (
          <div key={index} className={`flex-1 ${color}`} />
        ))}
      </div>
      <span className="text-xs text-gray-300">{themeNames[theme]}</span>
    </button>
  );
};

const ThemeSelector = () => {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    setIsOpen(false);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggleOpen}
        className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg"
        aria-label="Change theme"
      >
        <Palette size={20} />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 mb-2 bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-lg p-2 shadow-xl">
          <div className="flex gap-2">
            {Object.values(THEMES).map((themeName) => (
              <ThemeOption
                key={themeName}
                theme={themeName}
                active={theme === themeName}
                onClick={handleThemeChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector; 