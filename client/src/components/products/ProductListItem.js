import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Rating,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { addToCart } from '../../redux/slices/cartSlice';

const ProductListItem = ({ product }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product._id, quantity: 1 }));
  };

  return (
    <Card 
      sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box
        component={Link}
        to={`/products/${product._id}`}
        sx={{
          width: { xs: '100%', sm: 200 },
          height: { xs: 200, sm: 'auto' },
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'}
          alt={product.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {product.discount > 0 && (
          <Chip
            label={`${product.discount}% OFF`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              fontWeight: 'bold',
            }}
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={product.category} 
                  size="small" 
                  sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: 'text.secondary',
                  }} 
                />
                {product.qualityGrade && (
                  <Chip 
                    label={`Grade ${product.qualityGrade}`} 
                    size="small" 
                    sx={{ 
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      color: 'text.secondary',
                    }} 
                  />
                )}
                {product.isVerified && (
                  <Chip
                    icon={<VerifiedIcon fontSize="small" />}
                    label="Verified"
                    color="primary"
                    size="small"
                  />
                )}
              </Box>
              <Typography 
                variant="h6" 
                component={Link} 
                to={`/products/${product._id}`}
                sx={{ 
                  textDecoration: 'none', 
                  color: 'text.primary',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                <Rating value={product.rating} precision={0.5} size="small" readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.numReviews})
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {product.description.length > 150
                  ? `${product.description.substring(0, 150)}...`
                  : product.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seller: {product.seller?.name || 'Unknown'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" component="span" fontWeight="bold" color="primary.main">
                ₹{product.price.toFixed(2)}
              </Typography>
              {product.discount > 0 && (
                <Typography 
                  variant="body2" 
                  component="div" 
                  sx={{ 
                    textDecoration: 'line-through', 
                    color: 'text.secondary',
                  }}
                >
                  ₹{(product.price / (1 - product.discount / 100)).toFixed(2)}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                per {product.unit}
              </Typography>
              <Button
                variant="contained"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                sx={{ mt: 1 }}
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ProductListItem;