import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

// ═══════════════════════════════════════════════
//  DESIGN SYSTEM: "Aura" — Dhamsa Call Brand
// ═══════════════════════════════════════════════
// Colors: Deep navy bg + Electric Indigo/Cyan accents
// Radius: 16px cards, 12px inputs, 50px buttons
// Glass: backdrop-blur with translucent surfaces
// Motion: smooth 300ms transitions

const BRAND = {
    indigo: '#6366f1',
    indigoLight: '#818cf8',
    indigoDark: '#4f46e5',
    cyan: '#06b6d4',
    cyanLight: '#22d3ee',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    gradientHover: 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)',
    gradientSubtle: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.15) 100%)',
};

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'dark';
    });

    const toggleColorMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            return newMode;
        });
    };

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: BRAND.indigo,
                light: BRAND.indigoLight,
                dark: BRAND.indigoDark,
            },
            secondary: {
                main: BRAND.cyan,
                light: BRAND.cyanLight,
            },
            background: {
                default: mode === 'dark' ? '#0a0e1a' : '#f0f2f8',
                paper: mode === 'dark' ? '#111827' : '#ffffff',
            },
            text: {
                primary: mode === 'dark' ? '#f1f5f9' : '#0f172a',
                secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
            },
            divider: mode === 'dark' ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.06)',
        },
        typography: {
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            h1: { fontWeight: 800, letterSpacing: '-0.02em' },
            h2: { fontWeight: 700, letterSpacing: '-0.01em' },
            h3: { fontWeight: 700 },
            h4: { fontWeight: 700 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
            button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
        },
        shape: {
            borderRadius: 16,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '12px',
                        padding: '10px 24px',
                        fontSize: '0.938rem',
                        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                    },
                    contained: {
                        background: BRAND.gradient,
                        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                        '&:hover': {
                            background: BRAND.gradientHover,
                            boxShadow: '0 6px 20px rgba(99,102,241,0.5)',
                            transform: 'translateY(-1px)',
                        },
                    },
                    outlined: {
                        borderColor: mode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(15,23,42,0.15)',
                        '&:hover': {
                            borderColor: BRAND.indigo,
                            backgroundColor: 'rgba(99,102,241,0.06)',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            transition: 'all 0.25s ease',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: BRAND.indigo,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: BRAND.indigo,
                                boxShadow: `0 0 0 3px rgba(99,102,241,0.15)`,
                            },
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        borderRadius: '16px',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        borderRadius: '16px',
                    },
                },
            },
        },
    }), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode, brand: BRAND }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};