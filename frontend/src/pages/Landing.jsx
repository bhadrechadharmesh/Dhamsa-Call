import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Button, Container, Typography, Grid, IconButton, Paper
} from '@mui/material';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import { useThemeContext } from '../contexts/ThemeContext';

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

// --- ANIMATIONS ---
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-12px) rotate(1deg); }
  66% { transform: translateY(-6px) rotate(-1deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// --- STYLED COMPONENTS ---
const PageWrapper = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    width: '100%',
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    position: 'relative',
}));

const GlowOrb = styled('div')(({ size, top, left, right, color, delay }) => ({
    position: 'absolute',
    width: size || '500px',
    height: size || '500px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color || 'rgba(99,102,241,0.12)'} 0%, transparent 70%)`,
    top: top || 'auto',
    left: left || 'auto',
    right: right || 'auto',
    pointerEvents: 'none',
    zIndex: 0,
    animation: `${pulse} 8s ease-in-out infinite`,
    animationDelay: delay || '0s',
    filter: 'blur(40px)',
}));

const Navbar = styled('nav')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    zIndex: 10,
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    background: theme.palette.mode === 'dark'
        ? 'rgba(10, 14, 26, 0.8)'
        : 'rgba(240, 242, 248, 0.8)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    '@media (max-width: 600px)': {
        padding: '12px 20px',
    }
}));

const Logo = styled('div')(({ theme }) => ({
    fontSize: '1.4rem',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
}));

const HeroSection = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '85vh',
    position: 'relative',
    zIndex: 1,
    padding: '40px 20px',
});

const HeroContent = styled('div')({
    textAlign: 'center',
    maxWidth: '800px',
    animation: `${fadeUp} 0.8s ease-out`,
});

const GradientText = styled('span')({
    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #6366f1 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${shimmer} 4s linear infinite`,
});

const MeshSphere = styled('div')(({ theme }) => ({
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.3), rgba(6,182,212,0.15), rgba(99,102,241,0.05))'
        : 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.2), rgba(6,182,212,0.1), rgba(99,102,241,0.03))',
    position: 'absolute',
    right: '-80px',
    top: '50%',
    transform: 'translateY(-50%)',
    animation: `${float} 8s ease-in-out infinite`,
    filter: 'blur(1px)',
    border: theme.palette.mode === 'dark'
        ? '1px solid rgba(99,102,241,0.15)'
        : '1px solid rgba(99,102,241,0.1)',
    '@media (max-width: 900px)': {
        display: 'none',
    },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
    padding: '32px 28px',
    borderRadius: '20px',
    background: theme.palette.mode === 'dark'
        ? 'rgba(17, 24, 39, 0.6)'
        : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    cursor: 'default',
    '&:hover': {
        transform: 'translateY(-6px)',
        borderColor: 'rgba(99,102,241,0.3)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(99,102,241,0.08)'
            : '0 20px 40px rgba(0,0,0,0.08), 0 0 30px rgba(99,102,241,0.06)',
    }
}));

const IconBox = styled('div')(({ gradient }) => ({
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: gradient || 'linear-gradient(135deg, #6366f1, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
}));

const StatsBar = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: '48px',
    justifyContent: 'center',
    marginTop: '48px',
    flexWrap: 'wrap',
    animation: `${fadeUp} 0.8s ease-out 0.4s backwards`,
    '@media (max-width: 600px)': {
        gap: '24px',
    },
}));

const StatItem = styled('div')(({ theme }) => ({
    textAlign: 'center',
}));

export default function Landing() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { mode, toggleColorMode } = useThemeContext();

    const features = [
        {
            icon: <VideocamIcon sx={{ color: 'white', fontSize: 24 }} />,
            title: 'HD Video Calls',
            desc: 'Crystal-clear video & audio powered by WebRTC peer-to-peer technology.',
            gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
        },
        {
            icon: <SecurityIcon sx={{ color: 'white', fontSize: 24 }} />,
            title: 'End-to-End Secure',
            desc: 'Your conversations stay private with encrypted, secure connections.',
            gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
        },
        {
            icon: <SpeedIcon sx={{ color: 'white', fontSize: 24 }} />,
            title: 'Zero Latency',
            desc: 'Optimized signaling for instant connections with no setup delay.',
            gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
        },
        {
            icon: <DevicesIcon sx={{ color: 'white', fontSize: 24 }} />,
            title: 'Any Device',
            desc: 'Works seamlessly on desktop, tablet, and mobile browsers.',
            gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
        },
    ];

    return (
        <PageWrapper>
            {/* Background Glow Orbs */}
            <GlowOrb size="600px" top="-15%" right="-10%" color="rgba(99,102,241,0.1)" delay="0s" />
            <GlowOrb size="400px" top="60%" left="-5%" color="rgba(6,182,212,0.08)" delay="3s" />

            {/* ── NAVBAR ── */}
            <Navbar>
                <Logo>
                    <VideocamIcon sx={{ fontSize: 28 }} /> Dhamsa Call
                </Logo>
                <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <IconButton onClick={toggleColorMode} size="small"
                        sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                        {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </IconButton>
                    <Button onClick={() => navigate("/guest")}
                        sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' }, '&:hover': { color: 'primary.main' } }}>
                        Guest Join
                    </Button>
                    <Button onClick={() => navigate("/auth")}
                        sx={{ color: 'text.primary' }}>
                        Sign In
                    </Button>
                    <Button variant="contained" onClick={() => navigate("/auth")}
                        sx={{ borderRadius: '50px', px: 3 }}>
                        Get Started
                    </Button>
                </Box>
            </Navbar>

            {/* ── HERO ── */}
            <HeroSection>
                <MeshSphere />
                <HeroContent>
                    <Typography variant="h1" sx={{
                        fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' },
                        lineHeight: 1.08,
                        mb: 3,
                    }}>
                        Connect with <br />
                        <GradientText>Anyone, Instantly.</GradientText>
                    </Typography>

                    <Typography variant="h6" sx={{
                        color: 'text.secondary',
                        fontWeight: 400,
                        maxWidth: '560px',
                        mx: 'auto',
                        mb: 5,
                        lineHeight: 1.7,
                        fontSize: { xs: '1rem', md: '1.15rem' },
                    }}>
                        High-quality video meetings for everyone. Free, secure,
                        and ready in seconds — no downloads required.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button variant="contained" size="large"
                            onClick={() => navigate("/auth")}
                            endIcon={<ArrowForwardIcon />}
                            sx={{ borderRadius: '50px', px: 4, py: 1.5, fontSize: '1.05rem' }}>
                            Start a Meeting
                        </Button>
                        <Button variant="outlined" size="large"
                            onClick={() => navigate("/guest")}
                            sx={{ borderRadius: '50px', px: 4, py: 1.5, fontSize: '1.05rem' }}>
                            Join as Guest
                        </Button>
                    </Box>

                    <StatsBar>
                        <StatItem>
                            <Typography variant="h4" fontWeight="800" color="primary">10K+</Typography>
                            <Typography variant="body2" color="text.secondary">Active Users</Typography>
                        </StatItem>
                        <StatItem>
                            <Typography variant="h4" fontWeight="800" sx={{ background: 'linear-gradient(135deg, #06b6d4, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>99.9%</Typography>
                            <Typography variant="body2" color="text.secondary">Uptime</Typography>
                        </StatItem>
                        <StatItem>
                            <Typography variant="h4" fontWeight="800" color="primary">50+</Typography>
                            <Typography variant="body2" color="text.secondary">Countries</Typography>
                        </StatItem>
                    </StatsBar>
                </HeroContent>
            </HeroSection>

            {/* ── FEATURES ── */}
            <Container maxWidth="lg" sx={{ py: 10, position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" align="center" sx={{ mb: 1 }}>
                    Why <GradientText>Dhamsa Call</GradientText>?
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: '500px', mx: 'auto' }}>
                    Everything you need for seamless video conferencing, built with modern technology.
                </Typography>

                <Grid container spacing={3}>
                    {features.map((f, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <FeatureCard elevation={0} sx={{ animation: `${fadeUp} 0.6s ease-out ${0.1 * i}s backwards` }}>
                                <IconBox gradient={f.gradient}>
                                    {f.icon}
                                </IconBox>
                                <Typography variant="h6" sx={{ mb: 1 }}>{f.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{f.desc}</Typography>
                            </FeatureCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* ── FOOTER ── */}
            <Box sx={{
                textAlign: 'center',
                py: 4,
                borderTop: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                zIndex: 1,
            }}>
                <Typography variant="body2" color="text.secondary">
                    © 2026 Dhamsa Call. Built with ❤️ • Secure & Encrypted
                </Typography>
            </Box>
        </PageWrapper>
    );
}