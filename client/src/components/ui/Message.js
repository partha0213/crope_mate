import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

const Message = ({ severity = 'info', title, children, sx = {} }) => {
  return (
    <Box sx={{ my: 2, ...sx }}>
      <Alert severity={severity} variant="outlined">
        {title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </Alert>
    </Box>
  );
};

export default Message;