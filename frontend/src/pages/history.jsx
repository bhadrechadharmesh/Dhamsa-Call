import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Card, CardContent, Typography, IconButton, Grid, Chip, Button, Box,
    Snackbar, Alert, Paper
} from '@mui/material';
import { styled, keyframes, useTheme  } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideocamIcon from '@mui/icons-material/Videocam';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
`;

const PageWrapper = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    padding: '0',
    position: 'relative',
    overflow: 'hidden',
}));

const GlowOrb = styled('div')(({ size, top, right, color, delay }) => ({
    position: 'absolute',
    width: size || '400px',
    height: size || '400px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color || 'rgba(99,102,241,0.1)'} 0%, transparent 70%)`,
    top, right,
    pointerEvents: 'none',
    zIndex: 0,
    animation: `${pulse} 6s ease-in-out infinite`,
    animationDelay: delay || '0s',
    filter: 'blur(40px)',
}));

const TopBar = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(12px)',
    background: theme.palette.mode === 'dark'
        ? 'rgba(10, 14, 26, 0.8)'
        : 'rgba(240, 242, 248, 0.8)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    '@media (max-width: 600px)': {
        padding: '16px 20px',
    }
}));

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

const HistoryCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    background: theme.palette.mode === 'dark'
        ? 'rgba(17, 24, 39, 0.6)'
        : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    '&:hover': {
        transform: 'translateY(-4px)',
        borderColor: 'rgba(99,102,241,0.3)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 32px rgba(0,0,0,0.35)'
            : '0 12px 32px rgba(0,0,0,0.08)',
    }
}));

const EmptyState = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    opacity: 0.6,
    animation: `${fadeUp} 0.6s ease-out`,
});

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // handle error
            }
        }
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setSnackbarOpen(true);
    };

    return (
        <PageWrapper>
            <GlowOrb size="500px" top="-10%" right="-10%" color="rgba(99,102,241,0.08)" />

            <TopBar>
                <Logo onClick={() => navigate('/home')}>
                    <VideocamIcon sx={{ fontSize: 22 }} /> Dhamsa Call
                </Logo>
                <Button variant="outlined" startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/home")}
                    sx={{ borderRadius: '50px' }}>
                    Dashboard
                </Button>
            </TopBar>

            <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: '24px 16px', md: '40px' }, position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <Box sx={{ mb: 4, animation: `${fadeUp} 0.5s ease-out` }}>
                    <Typography variant="h4" fontWeight="800">Meeting History</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {meetings.length > 0
                            ? `${meetings.length} meeting${meetings.length > 1 ? 's' : ''} recorded`
                            : 'Track and rejoin your past sessions'}
                    </Typography>
                </Box>

                {meetings.length === 0 ? (
                    <EmptyState>
                        <Box sx={{
                            width: 80, height: 80, borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3,
                        }}>
                            <VideoCameraFrontIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        </Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>No meetings yet</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Your meeting history will appear here.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/home")}
                            endIcon={<ArrowForwardIcon />}
                            sx={{ borderRadius: '50px' }}>
                            Start a Meeting
                        </Button>
                    </EmptyState>
                ) : (
                    <Grid container spacing={2.5}>
                        {meetings.map((e, i) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                <HistoryCard elevation={0}
                                    sx={{ animation: `${fadeUp} 0.5s ease-out ${0.05 * i}s backwards` }}>
                                    <CardContent sx={{ p: '24px !important' }}>
                                        <Chip
                                            icon={<CalendarTodayIcon sx={{ fontSize: '13px !important' }} />}
                                            label={formatDate(e.date)}
                                            size="small"
                                            sx={{
                                                mb: 2,
                                                background: theme.palette.mode === 'dark'
                                                    ? 'rgba(99,102,241,0.1)'
                                                    : 'rgba(99,102,241,0.06)',
                                                color: 'text.secondary',
                                                border: `1px solid ${theme.palette.divider}`,
                                                fontSize: '0.75rem',
                                            }}
                                        />

                                        <Typography variant="h5" fontWeight="700"
                                            sx={{
                                                mb: 0.5, letterSpacing: '0.5px',
                                                fontFamily: 'monospace',
                                            }}>
                                            {e.meetingCode}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2.5, display: 'block' }}>
                                            Dhamsa Call
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button variant="contained" fullWidth size="small"
                                                onClick={() => navigate(`/meet/${e.meetingCode}`)}
                                                sx={{ py: 1 }}>
                                                Rejoin
                                            </Button>
                                            <IconButton size="small"
                                                onClick={() => handleCopy(e.meetingCode)}
                                                sx={{
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    borderRadius: '10px',
                                                    '&:hover': { borderColor: 'primary.main' }
                                                }}>
                                                <ContentCopyIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </HistoryCard>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" sx={{ borderRadius: '12px' }}>Meeting code copied!</Alert>
            </Snackbar>
        </PageWrapper>
    );
}