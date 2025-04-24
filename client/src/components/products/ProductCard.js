import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { addToCart } from '../../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product._id, quantity: 1 }));
  };

  return (
    <Card 
      className="product-card"
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
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
        {product.isVerified && (
          <Tooltip title="Blockchain Verified">
            <Chip
              icon={<VerifiedIcon fontSize="small" />}
              label="Verified"
              color="primary"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                fontWeight: 'bold',
              }}
            />
          </Tooltip>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 1 }}>
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
                ml: 1,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                color: 'text.secondary',
              }} 
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.numReviews})
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </Typography>
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="span" fontWeight="bold" color="primary.main">
              ₹{product.price.toFixed(2)}
            </Typography>
            {product.discount > 0 && (
              <Typography 
                variant="body2" 
                component="span" 
                sx={{ 
                  textDecoration: 'line-through', 
                  color: 'text.secondary',
                  ml: 1,
                }}
              >
                ₹{(product.price / (1 - product.discount / 100)).toFixed(2)}
              </Typography>
            )}
            <Box sx={{ ml: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                {product.unit}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              startIcon={<CartIcon />}
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              sx={{ flexGrow: 1, mr: 1 }}
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <IconButton 
              color="primary" 
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <FavoriteBorderIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;