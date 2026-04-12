import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Avatar, Button, TextField, Box, Typography, Container,
    Snackbar, Alert, CircularProgress, Paper, IconButton, InputAdornment
} from '@mui/material';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
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
    top: 0,
    left: 0,
    right: 0,
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

export default function Authentication() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { mode, toggleColorMode } = useThemeContext();

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [formState, setFormState] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({
        open: false, message: "", severity: "success"
    });

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handleAuth = async (e) => {
        e.preventDefault();
        if (!username || !password || (formState === 1 && !name)) {
            setSnackbar({ open: true, message: "Please fill in all fields", severity: "error" });
            return;
        }
        setLoading(true);
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else {
                let result = await handleRegister(name, username, password);
                setSnackbar({ open: true, message: result || "Registration Successful!", severity: "success" });
                setFormState(0);
                setUsername(""); setPassword(""); setName("");
            }
        } catch (err) {
            let errMsg = err.response?.data?.msg || err.response?.data?.message || err.message || "Something went wrong";
            setSnackbar({ open: true, message: errMsg, severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <GlowOrb size="500px" top="-20%" right="-10%" color="rgba(99,102,241,0.1)" />
            <GlowOrb size="350px" bottom="-10%" left="-5%" color="rgba(6,182,212,0.08)" delay="2s" />

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
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Avatar sx={{
                            mx: 'auto', mb: 2,
                            width: 56, height: 56,
                            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                        }}>
                            <LockOutlinedIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="h4" fontWeight="800">
                            {formState === 0 ? "Welcome back" : "Create account"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {formState === 0 ? "Sign in to continue to Dhamsa Call" : "Sign up to start connecting"}
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleAuth} noValidate>
                        {formState === 1 && (
                            <TextField
                                margin="normal" required fullWidth id="name"
                                label="Full Name" name="name" autoComplete="name"
                                value={name} onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        )}
                        <TextField
                            margin="normal" required fullWidth id="username"
                            label="Username" name="username" autoComplete="username"
                            autoFocus={formState === 0}
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            placeholder="cooluser123"
                        />
                        <TextField
                            margin="normal" required fullWidth id="password"
                            label="Password" name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />

                        <Button
                            type="submit" fullWidth variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '12px', fontSize: '1rem' }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : (formState === 0 ? "Sign In" : "Create Account")}
                        </Button>

                        <Typography variant="body2" color="text.secondary" align="center">
                            {formState === 0 ? "Don't have an account? " : "Already have an account? "}
                            <Box component="span"
                                onClick={() => { setFormState(f => f === 0 ? 1 : 0); setUsername(""); setPassword(""); setName(""); }}
                                sx={{
                                    color: 'primary.main', cursor: 'pointer', fontWeight: 600,
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {formState === 0 ? "Sign Up" : "Sign In"}
                            </Box>
                        </Typography>
                    </Box>
                </GlassCard>
            </Container>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: '12px' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </PageWrapper>
    );
}