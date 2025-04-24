import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ size = 40, text = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <CircularProgress size={size} />
      {text && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;