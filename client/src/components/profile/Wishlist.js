import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { getWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import Loader from '../ui/Loader';
import Message from '../ui/Message';

const Wishlist = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const { wishlistItems, loading, error } = useSelector((state) => state.wishlist);
  
  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);
  
  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
  };
  
  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      countInStock: item.countInStock,
      quantity: 1,
    }));
  };
  
  if (loading) return <Loader />;
  if (error) return <Message severity="error">{error}</Message>;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          My Wishlist
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {wishlistItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Save items you like for future reference.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
          >
            Explore Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.product}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      zIndex: 1,
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => handleRemoveFromWishlist(item.product)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  
                  <Box
                    component={Link}
                    to={`/products/${item.product}`}
                    sx={{
                      display: 'block',
                      width: '100%',
                      height: 200,
                      borderRadius: 1,
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    component={Link}
                    to={`/products/${item.product}`}
                    sx={{
                      fontWeight: 'medium',
                      textDecoration: 'none',
                      color: 'text.primary',
                      display: 'block',
                      mb: 1,
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.name}
                  </Typography>
                  
                  <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ mb: 2 }}>
                    ₹{item.price.toFixed(2)}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CartIcon />}
                  onClick={() => handleAddToCart(item)}
                  disabled={item.countInStock === 0}
                >
                  {item.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Wishlist;