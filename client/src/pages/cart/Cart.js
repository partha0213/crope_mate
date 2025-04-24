import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Divider, IconButton, TextField, Card, CardContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, Stepper, Step, StepLabel, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, CircularProgress } from '@mui/material';
import { Delete, Add, Remove, ShoppingCart, ArrowBack, ArrowForward, LocalShipping, Payment, CheckCircle, LocationOn, Edit } from '@mui/icons-material';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../redux/slices/cartSlice';
import { createOrder } from '../../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, loading, totalAmount, totalItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { loading: orderLoading } = useSelector(state => state.orders);
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [deliveryCharge, setDeliveryCharge] = useState(50);
  
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);
  
  useEffect(() => {
    if (user?.address) {
      setShippingAddress({
        address: user.address.address || '',
        city: user.address.city || '',
        state: user.address.state || '',
        postalCode: user.address.postalCode || '',
        country: user.address.country || '',
        phone: user.phone || ''
      });
    }
  }, [user]);
  
  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };
  
  const handleRemoveItem = (itemId) => {
    dispatch(removeCartItem(itemId));
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };
  
  const handleNext = () => {
    if (activeStep === 0 && cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (activeStep === 1) {
      // Validate shipping address
      const { address, city, state, postalCode, country, phone } = shippingAddress;
      if (!address || !city || !state || !postalCode || !country || !phone) {
        toast.error('Please fill in all shipping details');
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDeliveryOptionChange = (e) => {
    const option = e.target.value;
    setDeliveryOption(option);
    
    // Set delivery charge based on option
    if (option === 'express') {
      setDeliveryCharge(150);
    } else if (option === 'standard') {
      setDeliveryCharge(50);
    } else {
      setDeliveryCharge(0); // pickup
    }
  };
  
  const handlePlaceOrder = () => {
    const orderData = {
      orderItems: cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingAddress,
      paymentMethod,
      deliveryOption,
      itemsPrice: totalAmount,
      shippingPrice: deliveryCharge,
      totalPrice: totalAmount + deliveryCharge
    };
    
    dispatch(createOrder(orderData))
      .unwrap()
      .then((order) => {
        toast.success('Order placed successfully!');
        navigate(`/orders/${order._id}`);
      })
      .catch(err => {
        toast.error(err || 'Failed to place order');
      });
  };
  
  const steps = ['Shopping Cart', 'Shipping Details', 'Payment Method', 'Review Order'];
  
  if (loading && cartItems.length === 0) {
    return <Spinner />;
  }
  
  // Assuming shipping fee is fixed at ₹50 for orders below ₹500, free above that
  const calculateShippingFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal < 500 ? 50 : 0;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShippingFee();
  };
  
  const handleCheckout = () => {
    if (!user) {
      toast.info('Please login to proceed with checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    navigate('/checkout');
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      
      {cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
            size="large"
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: { xs: 3, md: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Cart Items ({cartItems.length})
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => setClearCartDialogOpen(true)}
                >
                  Clear Cart
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List sx={{ width: '100%' }}>
                {cartItems.map((item) => (
                  <React.Fragment key={item.product}>
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveItem(item.product)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      }
                      sx={{ py: 2 }}
                    >
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <Avatar
                          variant="rounded"
                          src={item.productData?.images?.[0] || '/images/products/default.jpg'}
                          alt={item.name}
                          sx={{ width: 80, height: 80 }}
                        />
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" component={Link} to={`/products/${item.product}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Seller: {item.productData?.seller?.name || 'Unknown Seller'}
                            </Typography>
                            
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'medium', mb: 1 }}>
                              ₹{item.price.toFixed(2)} / {item.productData?.unit || 'unit'}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              
                              <TextField
                                size="small"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value)) {
                                    handleQuantityChange(item.product, value);
                                  }
                                }}
                                inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                sx={{ width: 60, mx: 1 }}
                              />
                              
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                                disabled={item.quantity >= item.productData?.countInStock}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                {item.productData?.countInStock > 0 
                                  ? `${item.productData?.countInStock} available` 
                                  : 'Out of stock'}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Typography variant="subtitle1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  component={Link}
                  to="/products"
                  startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
                >
                  Continue Shopping
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1">₹{calculateSubtotal().toFixed(2)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Tax (5%)</Typography>
                    <Typography variant="body1">₹{calculateTax().toFixed(2)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1">Shipping</Typography>
                      <IconButton size="small" sx={{ ml: 0.5 }}>
                        <Info fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body1">
                      {calculateShippingFee() === 0 
                        ? 'Free' 
                        : `₹${calculateShippingFee().toFixed(2)}`}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">₹{calculateTotal().toFixed(2)}</Typography>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  startIcon={<LocalShipping />}
                >
                  Proceed to Checkout
                </Button>
                
                {calculateShippingFee() > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    Add ₹{(500 - calculateSubtotal()).toFixed(2)} more to get free shipping!
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={clearCartDialogOpen}
        onClose={() => setClearCartDialogOpen(false)}
      >
        <DialogTitle>Clear Cart</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all items from your cart?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearCartDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearCart} color="error">
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;