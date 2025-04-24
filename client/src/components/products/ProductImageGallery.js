import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';

const ProductImageGallery = ({ images }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const handlePrev = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleZoom = () => {
    setZoomed(!zoomed);
  };

  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
          height: { xs: 300, sm: 400, md: 500 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <Box
          component="img"
          src={images[selectedImage]}
          alt="Product"
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: zoomed ? 'cover' : 'contain',
            transition: 'transform 0.3s ease',
            transform: zoomed ? 'scale(1.5)' : 'scale(1)',
            cursor: zoomed ? 'zoom-out' : 'zoom-in',
          }}
          onClick={toggleZoom}
        />
        
        <IconButton
          sx={{
            position: 'absolute',
            top: '50%',
            left: 8,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
            zIndex: 1,
          }}
          onClick={handlePrev}
        >
          <PrevIcon />
        </IconButton>
        
        <IconButton
          sx={{
            position: 'absolute',
            top: '50%',
            right: 8,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
            zIndex: 1,
          }}
          onClick={handleNext}
        >
          <NextIcon />
        </IconButton>
        
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
            zIndex: 1,
          }}
          onClick={toggleZoom}
        >
          <ZoomInIcon />
        </IconButton>
      </Paper>
      
      {images.length > 1 && (
        <Grid container spacing={1}>
          {images.map((image, index) => (
            <Grid item key={index} xs={3} sm={2} md={2}>
              <Paper
                elevation={selectedImage === index ? 3 : 1}
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: selectedImage === index ? `2px solid ${theme.palette.primary.main}` : 'none',
                  opacity: selectedImage === index ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
                onClick={() => setSelectedImage(index)}
              >
                <Box
                  component="img"
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 70,
                    objectFit: 'cover',
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductImageGallery;