import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '6rem', md: '10rem' },
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          fontWeight="bold"
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 500 }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/"
          startIcon={<HomeIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;