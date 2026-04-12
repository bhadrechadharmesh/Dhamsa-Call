import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, TextField, Typography, Container, Paper, Box, IconButton, InputAdornment
} from '@mui/material';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import { useThemeContext } from '../contexts/ThemeContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideocamIcon from '@mui/icons-material/Videocam';
import GroupsIcon from '@mui/icons-material/Groups';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

const PageWrapper = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.default,
    position: 'relative',
    overflow: 'hidden',
}));

const GlowOrb = styled('div')(({ size, top, left, right, bottom, color, delay }) => ({
    position: 'absolute',
    width: size || '400px',
    height: size || '400px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color || 'rgba(99,102,241,0.12)'} 0%, transparent 70%)`,
    top, left, right, bottom,
    pointerEvents: 'none',
    zIndex: 0,
    animation: `${pulse} 6s ease-in-out infinite`,
    animationDelay: delay || '0s',
    filter: 'blur(40px)',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
    padding: '40px',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '440px',
    background: theme.palette.mode === 'dark'
        ? 'rgba(17, 24, 39, 0.7)'
        : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark'
        ? '0 25px 50px rgba(0,0,0,0.4)'
        : '0 25px 50px rgba(0,0,0,0.08)',
    animation: `${fadeUp} 0.6s ease-out`,
    zIndex: 1,
}));

const TopBar = styled('div')({
    position: 'absolute',
    top: 0, left: 0, right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    zIndex: 10,
});

const Logo = styled('div')({
    fontSize: '1.2rem',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer',
});

export default function GuestJoin() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { mode, toggleColorMode } = useThemeContext();
    const [meetingCode, setMeetingCode] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleJoin = () => {
        if (!meetingCode.trim() || !name.trim()) {
            setError("Both fields are required to join.");
            return;
        }
        navigate(`/meet/${meetingCode}`);
    };

    return (
        <PageWrapper>
            <GlowOrb size="500px" top="-15%" left="-10%" color="rgba(6,182,212,0.1)" />
            <GlowOrb size="350px" bottom="-10%" right="-5%" color="rgba(99,102,241,0.08)" delay="2s" />

            <TopBar>
                <Logo onClick={() => navigate('/')}>
                    <VideocamIcon sx={{ fontSize: 22 }} /> Dhamsa Call
                </Logo>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton onClick={toggleColorMode} size="small"
                        sx={{ color: 'text.secondary' }}>
                        {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </IconButton>
                    <IconButton onClick={() => navigate('/')} size="small"
                        sx={{ color: 'text.secondary' }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                </Box>
            </TopBar>

            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', zIndex: 1 }}>
                <GlassCard elevation={0}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{
                            width: 56, height: 56,
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 2,
                            boxShadow: '0 4px 14px rgba(6,182,212,0.35)',
                        }}>
                            <GroupsIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Typography variant="h4" fontWeight="800">
                            Join as Guest
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Enter the meeting code to join instantly — no account needed.
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth label="Display Name" variant="outlined"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        placeholder="John Doe"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth label="Meeting Code" variant="outlined"
                        value={meetingCode}
                        onChange={(e) => { setMeetingCode(e.target.value); setError(""); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                        placeholder="abc-def-ghi"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <KeyboardIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{ mb: 1 }}
                    />

                    {error && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Button fullWidth variant="contained" onClick={handleJoin}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ py: 1.5, borderRadius: '12px', fontSize: '1rem', mt: 1 }}>
                        Join Meeting
                    </Button>

                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                        Want to create meetings?{' '}
                        <Box component="span"
                            onClick={() => navigate('/auth')}
                            sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                        >
                            Sign up free
                        </Box>
                    </Typography>
                </GlassCard>
            </Container>
        </PageWrapper>
    );
}