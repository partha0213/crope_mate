import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { addToCart, removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';
import Message from '../../components/ui/Message';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateCartItemQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any products to your cart yet.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            {isMobile ? (
              // Mobile view - card list
              <Box>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </Box>
            ) : (
              // Desktop view - table
              <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 4 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              component={Link}
                              to={`/products/${item.id}`}
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 1,
                                overflow: 'hidden',
                                mr: 2,
                                flexShrink: 0,
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
                                }}
                              />
                            </Box>
                            <Box>
                              <Typography
                                variant="subtitle1"
                                component={Link}
                                to={`/products/${item.id}`}
                                sx={{
                                  textDecoration: 'none',
                                  color: 'text.primary',
                                  fontWeight: 'medium',
                                  '&:hover': {
                                    color: 'primary.main',
                                  },
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.category}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            ₹{item.price.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            per {item.unit}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                              sx={{ border: `1px solid ${theme.palette.divider}` }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0 && value <= item.countInStock) {
                                  handleQuantityChange(item.id, value);
                                }
                              }}
                              inputProps={{ min: 1, max: item.countInStock }}
                              sx={{ width: 60, mx: 1, '& input': { textAlign: 'center' } }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, Math.min(item.countInStock, item.quantity + 1))}
                              disabled={item.quantity >= item.countInStock}
                              sx={{ border: `1px solid ${theme.palette.divider}` }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" fontWeight="bold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="outlined"
                component={Link}
                to="/products"
                startIcon={<ArrowBackIcon />}
              >
                Continue Shopping
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            <CartSummary cartItems={cartItems} onCheckout={handleCheckout} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;