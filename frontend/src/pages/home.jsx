import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, IconButton, TextField, Box, Typography, Grid, Paper, Avatar, Tooltip, InputAdornment
} from '@mui/material';
import { styled, alpha, keyframes, useTheme } from '@mui/material/styles';
import { useThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';

// Icons
import AddBoxIcon from '@mui/icons-material/AddBox';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import VideocamIcon from '@mui/icons-material/Videocam';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- STYLED COMPONENTS ---
const DashboardLayout = styled('div')(({ theme }) => ({
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    transition: 'background-color 0.3s',
}));

const Sidebar = styled('div')(({ theme }) => ({
    width: '72px',
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    gap: '8px',
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(17, 24, 39, 0.5)'
        : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    zIndex: 10,
    '@media (max-width: 768px)': {
        display: 'none'
    }
}));

const NavItem = styled(IconButton)(({ theme, active }) => ({
    borderRadius: '14px',
    padding: '12px',
    color: active ? '#6366f1' : theme.palette.text.secondary,
    backgroundColor: active ? alpha('#6366f1', 0.1) : 'transparent',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    '&:hover': {
        backgroundColor: alpha('#6366f1', 0.08),
        color: '#6366f1',
        transform: 'scale(1.05)',
    }
}));

const MainContent = styled('div')({
    flex: 1,
    padding: '32px 40px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    '@media (max-width: 768px)': {
        padding: '20px 16px'
    }
});

const ActionCard = styled(Paper)(({ theme }) => ({
    padding: '28px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '220px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.mode === 'dark'
        ? 'rgba(17, 24, 39, 0.5)'
        : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    '&:hover': {
        transform: 'translateY(-6px)',
        borderColor: 'rgba(99,102,241,0.3)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 16px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.06)'
            : '0 16px 40px rgba(0,0,0,0.08)',
        '& .card-icon-bg': {
            transform: 'scale(1.15) rotate(5deg)',
            opacity: 0.15,
        }
    }
}));

const CardIconBg = styled('div')({
    position: 'absolute',
    bottom: '-15px',
    right: '-15px',
    fontSize: '160px',
    opacity: 0.04,
    transition: 'all 0.4s ease',
    pointerEvents: 'none',
});

const IconBox = styled('div')(({ gradient }) => ({
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: gradient || 'linear-gradient(135deg, #6366f1, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
    flexShrink: 0,
}));

const TimeCard = styled(Paper)(({ theme }) => ({
    padding: '20px 28px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
}));

function HomeComponent() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [meetingCode, setMeetingCode] = useState("");
    const [dateTime, setDateTime] = useState(new Date());

    const { addToUserHistory, handleLogout } = useContext(AuthContext);
    const { mode, toggleColorMode } = useThemeContext();

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            await addToUserHistory(meetingCode);
            navigate(`/meet/${meetingCode}`);
        }
    };

    const handleCreateMeeting = async () => {
        const code = Math.random().toString(36).substring(2, 8);
        await addToUserHistory(code);
        navigate(`/meet/${code}`);
    }

    const timeString = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = dateTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <DashboardLayout>
            {/* ── SIDEBAR ── */}
            <Sidebar>
                <Avatar sx={{
                    width: 36, height: 36, mb: 2,
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    fontSize: '0.9rem', fontWeight: 700,
                }}>
                    D
                </Avatar>

                <Tooltip title="Home" placement="right">
                    <NavItem active={true}><VideocamIcon fontSize="small" /></NavItem>
                </Tooltip>
                <Tooltip title="History" placement="right">
                    <NavItem onClick={() => navigate("/history")}><HistoryIcon fontSize="small" /></NavItem>
                </Tooltip>

                <Box sx={{ flex: 1 }} />

                <Tooltip title="Toggle Theme" placement="right">
                    <NavItem onClick={toggleColorMode}>
                        {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </NavItem>
                </Tooltip>
                <Tooltip title="Sign Out" placement="right">
                    <NavItem onClick={handleLogout}><LogoutIcon fontSize="small" /></NavItem>
                </Tooltip>
            </Sidebar>

            {/* ── MAIN ── */}
            <MainContent>
                {/* Header */}
                <Box sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    mb: 4, animation: `${fadeUp} 0.5s ease-out`,
                }}>
                    <Box>
                        <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5 }}>
                            Dashboard
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Welcome back — let's connect with someone today.
                        </Typography>
                    </Box>
                </Box>

                {/* Time Card */}
                <TimeCard elevation={0} sx={{
                    mb: 4, animation: `${fadeUp} 0.5s ease-out 0.1s backwards`,
                }}>
                    <AccessTimeIcon sx={{ fontSize: 36, opacity: 0.8 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="700">{timeString}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>{dateString}</Typography>
                    </Box>
                </TimeCard>

                {/* Action Cards */}
                <Grid container spacing={3} sx={{ animation: `${fadeUp} 0.5s ease-out 0.2s backwards` }}>
                    {/* New Meeting */}
                    <Grid item xs={12} sm={6} md={4}>
                        <ActionCard onClick={handleCreateMeeting} elevation={0}>
                            <IconBox gradient="linear-gradient(135deg, #6366f1, #818cf8)">
                                <AddBoxIcon sx={{ color: 'white', fontSize: 22 }} />
                            </IconBox>
                            <Box>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>New Meeting</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Create a room and invite others instantly.
                                </Typography>
                            </Box>
                            <CardIconBg className="card-icon-bg">
                                <VideocamIcon sx={{ fontSize: 'inherit' }} />
                            </CardIconBg>
                        </ActionCard>
                    </Grid>

                    {/* Join Meeting */}
                    <Grid item xs={12} sm={6} md={5}>
                        <ActionCard sx={{ cursor: 'default' }} elevation={0}>
                            <IconBox gradient="linear-gradient(135deg, #06b6d4, #22d3ee)">
                                <KeyboardIcon sx={{ color: 'white', fontSize: 22 }} />
                            </IconBox>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>Join Meeting</Typography>
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <TextField
                                        fullWidth placeholder="Enter meeting code"
                                        variant="outlined" size="small"
                                        value={meetingCode}
                                        onChange={e => setMeetingCode(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleJoinVideoCall()}
                                    />
                                    <Button variant="contained" onClick={handleJoinVideoCall}
                                        disabled={!meetingCode}
                                        sx={{ px: 3, minWidth: 'auto' }}>
                                        <ArrowForwardIcon />
                                    </Button>
                                </Box>
                            </Box>
                            <CardIconBg className="card-icon-bg">
                                <SearchIcon sx={{ fontSize: 'inherit' }} />
                            </CardIconBg>
                        </ActionCard>
                    </Grid>

                    {/* History */}
                    <Grid item xs={12} sm={12} md={3}>
                        <ActionCard onClick={() => navigate("/history")} elevation={0}
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                                color: 'white', border: 'none',
                                '&:hover': {
                                    boxShadow: '0 16px 40px rgba(99,102,241,0.35)',
                                    borderColor: 'transparent',
                                }
                            }}>
                            <Box sx={{
                                width: 44, height: 44, borderRadius: '12px',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <HistoryIcon sx={{ color: 'white', fontSize: 22 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>History</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                    View past meetings & recordings.
                                </Typography>
                            </Box>
                        </ActionCard>
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box sx={{ mt: 'auto', pt: 4, opacity: 0.5, textAlign: 'center' }}>
                    <Typography variant="caption">
                        Dhamsa Call v1.0 • Secure & Encrypted
                    </Typography>
                </Box>
            </MainContent>
        </DashboardLayout>
    );
}

export default HomeComponent