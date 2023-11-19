import React, { createContext, useState } from 'react';
import { LightTheme, DarkTheme } from '../styles/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const themes = {
        light: LightTheme,
        dark: DarkTheme,
    };

    return (
        <ThemeContext.Provider value={{ isDarkTheme, setIsDarkTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};
