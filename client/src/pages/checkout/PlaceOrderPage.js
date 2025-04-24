import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingBag as OrderIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { createOrder } from '../../redux/slices/orderSlice';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';

const PlaceOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading, success, error, order } = useSelector((state) => state.orders);
  
  // Calculate prices
  cart.itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  cart.shippingPrice = cart.itemsPrice > 1000 ? 0 : 100;
  cart.taxPrice = Number((0.05 * cart.itemsPrice).toFixed(2));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);
  
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=placeorder');
    }
    
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
    
    if (success && order) {
      navigate(`/order/${order._id}`);
    }
  }, [navigate, user, cart, success, order]);
  
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CheckoutSteps activeStep={2} />
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Shipping
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body1">
                  <strong>Name:</strong> {cart.shippingAddress.fullName}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                  {cart.shippingAddress.state} {cart.shippingAddress.postalCode},{' '}
                  {cart.shippingAddress.country}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {cart.shippingAddress.phoneNumber}
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/shipping"
                startIcon={<EditIcon />}
                size="small"
              >
                Edit
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Payment Method
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                <strong>Method:</strong> {cart.paymentMethod}
              </Typography>
              <Button
                component={Link}
                to="/payment"
                startIcon={<EditIcon />}
                size="small"
              >
                Edit
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Order Items
            </Typography>
            
            {cart.cartItems.length === 0 ? (
              <Message severity="info">Your cart is empty</Message>
            ) : (
              <>
                {isMobile ? (
                  <Box>
                    {cart.cartItems.map((item, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < cart.cartItems.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex' }}>
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
                          <Box sx={{ flex: 1 }}>
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
                              {item.quantity} x ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cart.cartItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  component={Link}
                                  to={`/products/${item.id}`}
                                  sx={{
                                    width: 60,
                                    height: 60,
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
                                <Typography
                                  variant="body1"
                                  component={Link}
                                  to={`/products/${item.id}`}
                                  sx={{
                                    textDecoration: 'none',
                                    color: 'text.primary',
                                    '&:hover': {
                                      color: 'primary.main',
                                    },
                                  }}
                                >
                                  {item.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                            <TableCell align="right">₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Items:</Typography>
                <Typography variant="body1">₹{cart.itemsPrice.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">
                  {cart.shippingPrice === 0 ? 'Free' : `₹${cart.shippingPrice.toFixed(2)}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tax (5%):</Typography>
                <Typography variant="body1">₹{cart.taxPrice}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Total:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                ₹{cart.totalPrice}
              </Typography>
            </Box>
            
            {error && <Message severity="error" sx={{ mb: 2 }}>{error}</Message>}
            
            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              disabled={cart.cartItems.length === 0 || loading}
              onClick={placeOrderHandler}
              sx={{ py: 1.5 }}
            >
              {loading ? <Loader size={24} /> : 'Place Order'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlaceOrderPage;