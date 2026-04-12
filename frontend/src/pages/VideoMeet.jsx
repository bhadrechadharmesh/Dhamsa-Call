import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button, Tooltip, Snackbar, Alert, Typography, Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';

import VideoComponent from '../components/VideoComponent';
import ChatPanel from '../components/ChatPanel';
import server from '../environment';
import { useNavigate } from 'react-router-dom';

const server_url = server;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- STYLES ---
const MainContainer = styled('div')({
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0a0e1a',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

const VideoGrid = styled('div')(({ total }) => {
    let columns = '1fr';
    if (total === 2) columns = '1fr 1fr';
    if (total >= 3) columns = 'repeat(auto-fit, minmax(380px, 1fr))';
    return {
        flex: 1,
        display: 'grid',
        gridTemplateColumns: columns,
        gap: '16px',
        padding: '16px',
        justifyContent: 'center',
        alignContent: 'center',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        overflowY: 'auto',
    };
});

const ControlBar = styled('div')({
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    padding: '10px 20px',
    borderRadius: '50px',
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.1)',
    border: '1px solid rgba(148,163,184,0.08)',
    zIndex: 100,
    alignItems: 'center',
});

const ControlButton = styled(IconButton)(({ active, variant }) => ({
    backgroundColor: active
        ? 'rgba(148,163,184,0.15)'
        : variant === 'danger'
            ? '#ef4444'
            : 'rgba(99,102,241,0.15)',
    color: active
        ? '#94a3b8'
        : variant === 'danger'
            ? 'white'
            : '#a5b4fc',
    width: '48px',
    height: '48px',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    '&:hover': {
        backgroundColor: active
            ? 'rgba(148,163,184,0.25)'
            : variant === 'danger'
                ? '#dc2626'
                : 'rgba(99,102,241,0.25)',
        transform: 'scale(1.08)',
    }
}));

const Divider = styled('div')({
    width: '1px',
    height: '28px',
    background: 'rgba(148,163,184,0.15)',
    margin: '0 4px',
});

const LobbyContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#f1f5f9',
    gap: '2rem',
    background: 'radial-gradient(ellipse at center, #111827 0%, #0a0e1a 100%)',
    animation: `${fadeUp} 0.6s ease-out`,
});

const LobbyVideoWrapper = styled('div')({
    width: '600px',
    maxWidth: '90vw',
    aspectRatio: '16/10',
    background: '#111827',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid rgba(148,163,184,0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    position: 'relative',
});

// --- MAIN COMPONENT ---
export default function VideoMeetComponent() {
    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoRef = useRef();
    const connections = useRef({});
    const localStreamRef = useRef(null);
    const usernamesRef = useRef({});

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [showModal, setModal] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meetingLinkCopied, setMeetingLinkCopied] = useState(false);

    const usernameRef = useRef("");

    useEffect(() => {
        getPermissions();
        return () => {
            if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
            if (socketRef.current) socketRef.current.disconnect();
            Object.values(connections.current).forEach(pc => pc.close());
        };
    }, []);

    const getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setVideoAvailable(true); setAudioAvailable(true);
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Media permission error:", error);
            setVideoAvailable(false); setAudioAvailable(false);
        }
    };

    const connect = () => {
        if (!username) return;
        usernameRef.current = username;
        setAskForUsername(false);
        setLoading(true);
        connectToSocketServer();
    };

    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });
        socketRef.current.on('connect', () => {
            setLoading(false);
            socketIdRef.current = socketRef.current.id;
            socketRef.current.emit('join-call', window.location.href);
            socketRef.current.on('signal', gotMessageFromServer);
            socketRef.current.on('chat-message', addMessage);
            socketRef.current.on('user-left', (id) => {
                setVideos((prev) => prev.filter((v) => v.socketId !== id));
                if (connections.current[id]) { connections.current[id].close(); delete connections.current[id]; }
            });
            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    if (connections.current[socketListId]) return;
                    connections.current[socketListId] = new RTCPeerConnection({
                        iceServers: [
                            { urls: "stun:stun.l.google.com:19302" },
                            { urls: "stun:stun1.l.google.com:19302" },
                        ]
                    });
                    if (localStreamRef.current) {
                        localStreamRef.current.getTracks().forEach(track => {
                            connections.current[socketListId].addTrack(track, localStreamRef.current);
                        });
                    }
                    connections.current[socketListId].onicecandidate = (event) => {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    };
                    connections.current[socketListId].ontrack = (event) => {
                        setVideos(prev => {
                            if (prev.find(v => v.socketId === socketListId)) return prev;
                            const remoteName = usernamesRef.current[socketListId] || "Participant";
                            return [...prev, { socketId: socketListId, stream: event.streams[0], username: remoteName }];
                        });
                    };
                    if (socketIdRef.current === id) {
                        connections.current[socketListId].createOffer().then((description) => {
                            connections.current[socketListId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', socketListId, JSON.stringify({
                                    'sdp': connections.current[socketListId].localDescription,
                                    'username': usernameRef.current
                                }));
                            });
                        });
                    }
                });
            });
        });
    };

    const gotMessageFromServer = (fromId, message) => {
        const signal = JSON.parse(message);
        if (signal.username) {
            usernamesRef.current[fromId] = signal.username;
            setVideos(prev => prev.map(v => v.socketId === fromId ? { ...v, username: signal.username } : v));
        }
        if (fromId !== socketIdRef.current && connections.current[fromId]) {
            if (signal.sdp) {
                connections.current[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections.current[fromId].createAnswer().then((description) => {
                            connections.current[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({
                                    'sdp': connections.current[fromId].localDescription,
                                    'username': usernameRef.current
                                }));
                            });
                        });
                    }
                });
            }
            if (signal.ice) {
                connections.current[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(err => {
                    console.error("ICE candidate error:", err);
                });
            }
        }
    };

    const sendMessage = (msg) => {
        if (msg.trim()) {
            socketRef.current.emit('chat-message', msg, usernameRef.current);
            setMessages(prev => [...prev, { sender: "You", data: msg }]);
            setMessage("");
        }
    };

    const addMessage = (data, sender, socketIdSender) => {
        if (socketIdSender === socketIdRef.current) return;
        setMessages((prev) => [...prev, { sender, data }]);
        setNewMessages((prev) => prev + 1);
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) { videoTrack.enabled = !videoTrack.enabled; setVideo(videoTrack.enabled); }
        }
    };

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) { audioTrack.enabled = !audioTrack.enabled; setAudio(audioTrack.enabled); }
        }
    };

    const handleScreenShare = async () => {
        if (!screen) {
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
                const screenTrack = displayStream.getTracks()[0];
                Object.keys(connections.current).forEach((key) => {
                    const sender = connections.current[key].getSenders().find((s) => s.track?.kind === "video");
                    if (sender) sender.replaceTrack(screenTrack);
                });
                localStreamRef.current = displayStream;
                screenTrack.onended = () => { stopScreenShare(); };
                setScreen(true);
            } catch (err) { console.log("Screen share cancelled:", err); }
        } else { stopScreenShare(); }
    };

    const stopScreenShare = async () => {
        try {
            if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
            const userMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const videoTrack = userMedia.getVideoTracks()[0];
            Object.keys(connections.current).forEach((key) => {
                const sender = connections.current[key].getSenders().find((s) => s.track?.kind === "video");
                if (sender) sender.replaceTrack(videoTrack);
            });
            localStreamRef.current = userMedia;
            setScreen(false);
        } catch (err) { console.error("Error restoring camera:", err); }
    };

    const route = useNavigate();
    const handleEndCall = () => {
        if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
        Object.values(connections.current).forEach(pc => pc.close());
        connections.current = {};
        if (socketRef.current) socketRef.current.disconnect();
        route("/home");
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        setMeetingLinkCopied(true);
    };

    return (
        <MainContainer>
            {askForUsername ? (
                <LobbyContainer>
                    <Typography variant="h4" fontWeight="800" sx={{
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        Ready to join?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: -1 }}>
                        Preview your camera and enter your name
                    </Typography>

                    <LobbyVideoWrapper>
                        <video ref={localVideoRef} autoPlay muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                        {/* Overlay name tag */}
                        {username && (
                            <Box sx={{
                                position: 'absolute', bottom: 16, left: 16,
                                bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', px: 2, py: 0.5,
                                display: 'flex', alignItems: 'center', gap: 1,
                            }}>
                                <PersonIcon sx={{ fontSize: 14, color: '#a5b4fc' }} />
                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                                    {username}
                                </Typography>
                            </Box>
                        )}
                    </LobbyVideoWrapper>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            placeholder="Enter your name"
                            variant="outlined"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && connect()}
                            sx={{
                                width: '280px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '14px',
                                    bgcolor: 'rgba(17,24,39,0.8)',
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(148,163,184,0.15)' },
                                    '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                                },
                                '& .MuiInputBase-input::placeholder': { color: '#64748b' },
                            }}
                        />
                        <Button variant="contained" onClick={connect}
                            disabled={loading || !username} size="large"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ borderRadius: '14px', px: 4, py: 1.5 }}>
                            {loading ? "Connecting..." : "Join Now"}
                        </Button>
                    </Box>
                </LobbyContainer>
            ) : (
                <>
                    <VideoGrid total={videos.length + 1}>
                        <VideoComponent stream={localStreamRef.current} username={username} isLocal={!screen} isAudioEnabled={audio} />
                        {videos.map((v) => (
                            <VideoComponent key={v.socketId} stream={v.stream} username={v.username} isAudioEnabled={true} />
                        ))}
                    </VideoGrid>

                    <ControlBar>
                        <Tooltip title={video ? "Turn Off Camera" : "Turn On Camera"}>
                            <ControlButton onClick={toggleVideo} active={!video}>
                                {video ? <VideocamIcon /> : <VideocamOffIcon />}
                            </ControlButton>
                        </Tooltip>
                        <Tooltip title={audio ? "Mute" : "Unmute"}>
                            <ControlButton onClick={toggleAudio} active={!audio}>
                                {audio ? <MicIcon /> : <MicOffIcon />}
                            </ControlButton>
                        </Tooltip>
                        <Tooltip title={screen ? "Stop Sharing" : "Share Screen"}>
                            <ControlButton onClick={handleScreenShare} active={screen}>
                                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                            </ControlButton>
                        </Tooltip>
                        <Tooltip title="End Call">
                            <ControlButton onClick={handleEndCall} variant="danger">
                                <CallEndIcon />
                            </ControlButton>
                        </Tooltip>
                        <Divider />
                        <Tooltip title="Chat">
                            <Badge badgeContent={newMessages} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#6366f1' } }}>
                                <ControlButton onClick={() => { setModal(!showModal); setNewMessages(0); }} active={showModal}>
                                    <ChatIcon />
                                </ControlButton>
                            </Badge>
                        </Tooltip>
                        <Tooltip title="Copy Meeting Link">
                            <ControlButton onClick={copyUrl}>
                                <ContentCopyIcon />
                            </ControlButton>
                        </Tooltip>
                    </ControlBar>

                    {showModal && (
                        <ChatPanel messages={messages} sendMessage={sendMessage} onClose={() => setModal(false)} username={username} />
                    )}

                    <Snackbar open={meetingLinkCopied} autoHideDuration={2000}
                        onClose={() => setMeetingLinkCopied(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert severity="success" sx={{ borderRadius: '12px' }}>Link Copied!</Alert>
                    </Snackbar>
                </>
            )}
        </MainContainer>
    );
}