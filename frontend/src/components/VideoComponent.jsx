import React, { useRef, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import MicOffIcon from '@mui/icons-material/MicOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PersonIcon from '@mui/icons-material/Person';
import { IconButton, Typography } from '@mui/material';

const VideoWrapper = styled('div')({
    position: 'relative',
    background: '#111827',
    borderRadius: '16px',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(148,163,184,0.06)',
    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
    '&:hover': {
        border: '1px solid rgba(99,102,241,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        '& .video-controls': {
            opacity: 1,
        }
    },
    '&.fullscreen': {
        borderRadius: 0,
    }
});

const StyledVideo = styled('video')(({ isLocal }) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: isLocal ? 'scaleX(-1)' : 'none',
}));

const NameTag = styled('div')({
    position: 'absolute',
    bottom: '14px',
    left: '14px',
    backgroundColor: 'rgba(10, 14, 26, 0.6)',
    backdropFilter: 'blur(8px)',
    color: '#f1f5f9',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    zIndex: 10,
    maxWidth: '80%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    border: '1px solid rgba(148,163,184,0.08)',
});

const ControlsOverlay = styled('div')({
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to top, rgba(10,14,26,0.5) 0%, transparent 30%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '12px',
    zIndex: 5,
});

const MuteBadge = styled('div')({
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
    zIndex: 10,
});

const VideoComponent = ({ stream, username, isLocal = false, isAudioEnabled = true }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.log(`Fullscreen error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    if (!stream) return null;

    return (
        <VideoWrapper ref={containerRef} className={isFullscreen ? 'fullscreen' : ''}>
            <StyledVideo ref={videoRef} autoPlay playsInline muted={isLocal} isLocal={isLocal} />

            <ControlsOverlay className="video-controls">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={toggleFullscreen} size="small"
                        sx={{
                            backgroundColor: 'rgba(10,14,26,0.5)',
                            backdropFilter: 'blur(8px)',
                            color: '#f1f5f9',
                            border: '1px solid rgba(148,163,184,0.1)',
                            '&:hover': { backgroundColor: 'rgba(99,102,241,0.3)' }
                        }}>
                        {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                    </IconButton>
                </div>
            </ControlsOverlay>

            <NameTag>
                <PersonIcon sx={{ fontSize: 14, color: '#a5b4fc' }} />
                {username || "User"}{isLocal && " (You)"}
            </NameTag>

            {!isAudioEnabled && (
                <MuteBadge>
                    <MicOffIcon sx={{ fontSize: 14 }} />
                </MuteBadge>
            )}
        </VideoWrapper>
    );
};

export default React.memo(VideoComponent);