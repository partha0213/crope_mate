import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Mic as MicIcon,
  Image as ImageIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Message from '../ui/Message';

const ChatbotAssistant = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your CropMate AI assistant. How can I help you with farming or shopping today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((!input.trim() && !selectedFile) || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      image: imagePreview,
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (userMessage) {
        formData.append('message', userMessage);
      }
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const { data } = await axios.post('/api/ai/chatbot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
        },
      ]);
      
      // Clear image after sending
      handleRemoveImage();
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error communicating with the assistant. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          mb: 4,
          background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          CropMate AI Assistant
        </Typography>
        <Typography variant="body1">
          Ask me anything about farming, crops, products, or get personalized recommendations.
          I can help with crop diseases, farming practices, product selection, and more.
        </Typography>
      </Paper>

      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '70vh',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              mr: 2,
            }}
          >
            <BotIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              CropMate AI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agricultural Assistant
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            overflowY: 'auto',
            flexGrow: 1,
            bgcolor: 'grey.50',
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              {message.role === 'assistant' && (
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 36,
                    height: 36,
                    mr: 1,
                    mt: 0.5,
                  }}
                >
                  <BotIcon fontSize="small" />
                </Avatar>
              )}

              <Card
                sx={{
                  maxWidth: '75%',
                  bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper',
                  color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  {message.image && (
                    <Box
                      component="img"
                      src={message.image}
                      alt="User uploaded"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        borderRadius: 1,
                        mb: 1,
                      }}
                    />
                  )}
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                </CardContent>
              </Card>

              {message.role === 'user' && (
                <Avatar
                  sx={{
                    bgcolor: 'primary.dark',
                    width: 36,
                    height: 36,
                    ml: 1,
                    mt: 0.5,
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
              )}
            </Box>
          ))}

          {loading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 36,
                  height: 36,
                  mr: 1,
                  mt: 0.5,
                }}
              >
                <BotIcon fontSize="small" />
              </Avatar>
              <Card
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 1,
                  px: 2,
                  py: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Thinking...
                  </Typography>
                </Box>
              </Card>
            </Box>
          )}

          {error && (
            <Box sx={{ mb: 2 }}>
              <Message severity="error">{error}</Message>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {imagePreview && (
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative', mr: 2 }}>
              <Box
                component="img"
                src={imagePreview}
                alt="Upload preview"
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'grey.200' },
                }}
                onClick={handleRemoveImage}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Image attached
            </Typography>
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask about farming, crops, or products..."
            value={input}
            onChange={handleInputChange}
            disabled={loading}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => fileInputRef.current.click()}
                    disabled={loading}
                  >
                    <ImageIcon />
                  </IconButton>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={(!input.trim() && !selectedFile) || loading}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatbotAssistant;