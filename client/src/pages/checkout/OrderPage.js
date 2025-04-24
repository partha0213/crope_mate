import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { getOrderDetails, payOrder } from '../../redux/slices/orderSlice';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  
  const { order, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    
    if (!order || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, order, user, navigate]);
  
  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      dispatch(payOrder(orderId));
      setPaymentProcessed(true);
    }, 2000);
  };
  
  if (loading) return <Loader />;
  if (error) return <Message severity="error">{error}</Message>;
  if (!order) return null;
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CheckoutSteps activeStep={3} />
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <SuccessIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Thank You for Your Order!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your order has been placed successfully. Order ID: #{order._id}
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShippingIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Shipping Information
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {order.shippingAddress.fullName}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {order.shippingAddress.phoneNumber}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={order.isDelivered ? 'Delivered' : 'Not Delivered'} 
                color={order.isDelivered ? 'success' : 'default'}
                size="small"
              />
              {order.isDelivered && (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  on {new Date(order.deliveredAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaymentIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Payment Information
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Method:</strong> {order.paymentMethod}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={order.isPaid ? 'Paid' : 'Not Paid'} 
                color={order.isPaid ? 'success' : 'default'}
                size="small"
              />
              {order.isPaid ? (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  on {new Date(order.paidAt).toLocaleDateString()}
                </Typography>
              ) : (
                order.paymentMethod !== 'COD' && (
                  <Button 
                    variant="contained" 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 2 }}
                    onClick={handlePayment}
                    disabled={paymentProcessed}
                  >
                    {paymentProcessed ? 'Processing...' : 'Pay Now'}
                  </Button>
                )
              )}
            </Box>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReceiptIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Order Items
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {order.orderItems.length === 0 ? (
              <Message severity="info">Your order is empty</Message>
            ) : (
              <>
                {isMobile ? (
                  <Box>
                    {order.orderItems.map((item, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < order.orderItems.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex' }}>
                          <Box
                            component={Link}
                            to={`/products/${item.product}`}
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
                              to={`/products/${item.product}`}
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
                        {order.orderItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  component={Link}
                                  to={`/products/${item.product}`}
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
                                  to={`/products/${item.product}`}
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
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Items:</Typography>
                <Typography variant="body1">₹{order.itemsPrice.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">
                  {order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice.toFixed(2)}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tax (5%):</Typography>
                <Typography variant="body1">₹{order.taxPrice}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Total:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                ₹{order.totalPrice}
              </Typography>
            </Box>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PrintIcon />}
              sx={{ mb: 2 }}
              onClick={() => window.print()}
            >
              Print Invoice
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Order from CropMarket-Mate',
                    text: `Check out my order #${order._id} from CropMarket-Mate!`,
                    url: window.location.href,
                  });
                }
              }}
            >
              Share Order Details
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderPage;