import React, { useState, useRef, useEffect } from 'react';
import {
    Box, IconButton, TextField, Typography
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const PanelContainer = styled('div')({
    position: 'fixed',
    right: '20px',
    bottom: '100px',
    width: '360px',
    height: '65vh',
    maxHeight: '600px',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 90,
    animation: `${slideIn} 0.3s ease-out forwards`,
    border: '1px solid rgba(148,163,184,0.08)',
});

const Header = styled(Box)({
    padding: '16px 20px',
    borderBottom: '1px solid rgba(148,163,184,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(99,102,241,0.04)',
});

const MessageList = styled(Box)({
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    '&::-webkit-scrollbar': { width: '4px' },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(99,102,241,0.2)',
        borderRadius: '2px',
    },
});

const Bubble = styled(Box)(({ isMe }) => ({
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '14px',
    borderBottomRightRadius: isMe ? '4px' : '14px',
    borderBottomLeftRadius: isMe ? '14px' : '4px',
    backgroundColor: isMe
        ? 'rgba(99,102,241,0.2)'
        : 'rgba(148,163,184,0.08)',
    color: isMe ? '#c7d2fe' : '#e2e8f0',
    alignSelf: isMe ? 'flex-end' : 'flex-start',
    position: 'relative',
    wordWrap: 'break-word',
    border: isMe
        ? '1px solid rgba(99,102,241,0.15)'
        : '1px solid rgba(148,163,184,0.06)',
}));

const SenderName = styled(Typography)({
    fontSize: '0.7rem',
    color: '#64748b',
    marginBottom: '3px',
    marginLeft: '4px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
});

const InputArea = styled(Box)({
    padding: '14px 16px',
    borderTop: '1px solid rgba(148,163,184,0.08)',
    display: 'flex',
    gap: '10px',
    background: 'rgba(10,14,26,0.5)',
});

export default function ChatPanel({ messages, sendMessage, onClose, username }) {
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    return (
        <PanelContainer>
            <Header>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#a5b4fc' }} />
                    <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#f1f5f9' }}>
                        Messages
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small"
                    sx={{ color: '#94a3b8', '&:hover': { color: '#f1f5f9' } }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Header>

            <MessageList>
                {messages.length === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 6, opacity: 0.5 }}>
                        <ChatBubbleOutlineIcon sx={{ fontSize: 40, color: '#475569', mb: 1 }} />
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            No messages yet
                        </Typography>
                    </Box>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.sender === username || msg.sender === "You";
                    return (
                        <Box key={index} sx={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start'
                        }}>
                            {!isMe && <SenderName>{msg.sender}</SenderName>}
                            <Bubble isMe={isMe}>
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{msg.data}</Typography>
                            </Bubble>
                        </Box>
                    );
                })}
                <div ref={bottomRef} />
            </MessageList>

            <InputArea>
                <TextField
                    fullWidth variant="outlined" placeholder="Type a message..."
                    size="small" value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            backgroundColor: 'rgba(17,24,39,0.8)',
                            color: '#f1f5f9',
                            fontSize: '0.875rem',
                            '& fieldset': { borderColor: 'rgba(148,163,184,0.1)' },
                            '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.3)' },
                            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                        },
                        '& .MuiInputBase-input::placeholder': { color: '#475569' },
                    }}
                />
                <IconButton onClick={handleSend}
                    sx={{
                        backgroundColor: 'rgba(99,102,241,0.15)',
                        color: '#a5b4fc',
                        borderRadius: '12px',
                        '&:hover': { backgroundColor: 'rgba(99,102,241,0.25)' }
                    }}>
                    <SendIcon fontSize="small" />
                </IconButton>
            </InputArea>
        </PanelContainer>
    );
}