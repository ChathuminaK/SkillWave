import { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ThemeToggler({ size = 'medium', tooltip = true }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  const button = (
    <IconButton
      onClick={toggleDarkMode}
      size={size}
      sx={{ 
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        color: darkMode ? '#fff' : '#000',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        '&:hover': {
          backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          transform: 'rotate(30deg)'
        }
      }}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <LightModeIcon className="theme-switch-icon" />
      ) : (
        <DarkModeIcon className="theme-switch-icon dark" />
      )}
    </IconButton>
  );

  return tooltip ? (
    <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      {button}
    </Tooltip>
  ) : button;
}
