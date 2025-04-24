import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service
    this.setState({ error, errorInfo });
    
    // Example of logging to a monitoring service
    if (process.env.REACT_APP_MONITORING_URL) {
      fetch(process.env.REACT_APP_MONITORING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          location: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch(err => console.error('Failed to log error:', err));
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                We're sorry, but there was an error loading this page. Our team has been notified.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
                <Button variant="contained" onClick={() => window.location.href = '/'}>
                  Go to Home
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;