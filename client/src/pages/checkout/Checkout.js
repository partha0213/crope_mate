import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Divider, Stepper, Step, StepLabel, TextField, FormControl, FormControlLabel, RadioGroup, Radio, FormLabel, CircularProgress, Card, CardContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, Tooltip, Alert } from '@mui/material';
import { LocalShipping, Payment, CheckCircle, ArrowBack, ArrowForward, AccountBalanceWallet, Security, Info } from '@mui/icons-material';
import { createOrder } from '../../redux/slices/orderSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { verifyBlockchainTransaction } from '../../utils/blockchain';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.orders);
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India',
    phoneNumber: user?.phoneNumber || ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [addressErrors, setAddressErrors] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [blockchainVerified, setBlockchainVerified] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [connectingWallet, setConnectingWallet] = useState(false);
  
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info('Your cart is empty');
      navigate('/cart');
    }
    
    if (!user) {
      toast.info('Please login to proceed with checkout');
      navigate('/login', { state: { from: '/checkout' } });
    }
    
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      // Check if already connected
      if (window.ethereum.selectedAddress) {
        setWalletConnected(true);
        setWalletAddress(window.ethereum.selectedAddress);
      }
    }
  }, [cartItems, user, navigate]);
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (addressErrors[name]) {
      setAddressErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateShippingAddress = () => {
    const errors = {};
    
    if (!shippingAddress.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!shippingAddress.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!shippingAddress.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    } else if (!/^\d{6}$/.test(shippingAddress.postalCode.trim())) {
      errors.postalCode = 'Please enter a valid 6-digit postal code';
    }
    
    if (!shippingAddress.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(shippingAddress.phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      if (!validateShippingAddress()) {
        return;
      }
    }
    
    if (activeStep === 1 && paymentMethod === 'blockchain') {
      if (!walletConnected) {
        toast.error('Please connect your wallet to proceed with blockchain payment');
        return;
      }
      
      if (!blockchainVerified) {
        toast.error('Please verify your blockchain transaction');
        return;
      }
    }
    
    setActiveStep(prevStep => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.05;
  };
  
  const calculateShippingFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal < 500 ? 50 : 0;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShippingFee();
  };
  
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed. Please install MetaMask to use blockchain features.');
      return;
    }
    
    setConnectingWallet(true);
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet: ' + (error.message || 'Unknown error'));
    } finally {
      setConnectingWallet(false);
    }
  };
  
  const verifyTransaction = async () => {
    try {
      // This is a placeholder for actual blockchain verification
      // In a real implementation, this would interact with your smart contract
      const verified = await verifyBlockchainTransaction(walletAddress, calculateTotal());
      
      if (verified) {
        setBlockchainVerified(true);
        toast.success('Transaction verified on blockchain');
      } else {
        toast.error('Transaction verification failed');
      }
    } catch (error) {
      toast.error('Error verifying transaction: ' + (error.message || 'Unknown error'));
    }
  };
  
  const initializeRazorpay = () => {
    // This would be implemented to initialize Razorpay payment
    toast.info('Razorpay integration will be implemented in production');
  };
  
  const initializeStripe = () => {
    // This would be implemented to initialize Stripe payment
    toast.info('Stripe integration will be implemented in production');
  };
  
  const handlePlaceOrder = async () => {
    try {
      // For blockchain payments, ensure verification is complete
      if (paymentMethod === 'blockchain' && !blockchainVerified) {
        toast.error('Please verify your blockchain transaction before placing the order');
        return;
      }
      
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.productData?.images?.[0] || ''
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: calculateSubtotal(),
        taxPrice: calculateTax(),
        shippingPrice: calculateShippingFee(),
        totalPrice: calculateTotal(),
        blockchainVerified: paymentMethod === 'blockchain' ? true : false,
        blockchainTxHash: paymentMethod === 'blockchain' ? 'tx_' + Date.now() : null // Placeholder for actual transaction hash
      };
      
      const resultAction = await dispatch(createOrder(orderData)).unwrap();
      
      dispatch(clearCart());
      
      navigate(`/orders/${resultAction._id}`, { 
        state: { success: true, message: 'Order placed successfully!' } 
      });
    } catch (error) {
      toast.error(error || 'Failed to place order. Please try again.');
    }
  };
  
  const renderShippingAddressForm = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Street Address"
            name="address"
            value={shippingAddress.address}
            onChange={handleAddressChange}
            error={Boolean(addressErrors.address)}
            helperText={addressErrors.address}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            error={Boolean(addressErrors.city)}
            helperText={addressErrors.city}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="State"
            name="state"
            value={shippingAddress.state}
            onChange={handleAddressChange}
            error={Boolean(addressErrors.state)}
            helperText={addressErrors.state}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleAddressChange}
            error={Boolean(addressErrors.postalCode)}
            helperText={addressErrors.postalCode}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Country"
            name="country"
            value={shippingAddress.country}
            onChange={handleAddressChange}
            disabled
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={shippingAddress.phoneNumber}
            onChange={handleAddressChange}
            error={Boolean(addressErrors.phoneNumber)}
            helperText={addressErrors.phoneNumber}
          />
        </Grid>
      </Grid>
    </Box>
  );
  
  const renderPaymentMethodForm = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <FormControl component="fieldset">
        <FormLabel component="legend">Select a payment method</FormLabel>
        <RadioGroup
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="cod"
            control={<Radio />}
            label="Cash on Delivery (COD)"
          />
          <FormControlLabel
            value="razorpay"
            control={<Radio />}
            label="Razorpay (Credit/Debit Cards, UPI, Wallets)"
            onClick={initializeRazorpay}
          />
          <FormControlLabel
            value="stripe"
            control={<Radio />}
            label="Stripe (International Payments)"
            onClick={initializeStripe}
          />
          <FormControlLabel
            value="upi"
            control={<Radio />}
            label="Direct UPI Payment"
          />
          <FormControlLabel
            value="blockchain"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span>Blockchain Payment (MetaMask)</span>
                <Tooltip title="Secure, transparent payments using blockchain technology">
                  <Info fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>
      
      {paymentMethod === 'blockchain' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" gutterBottom>
            Blockchain Payment Setup
          </Typography>
          
          {!walletConnected ? (
            <Button
              variant="outlined"
              startIcon={<AccountBalanceWallet />}
              onClick={connectWallet}
              disabled={connectingWallet}
              sx={{ mt: 1 }}
            >
              {connectingWallet ? 'Connecting...' : 'Connect MetaMask Wallet'}
            </Button>
          ) : (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                Wallet connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </Alert>
              
              {!blockchainVerified ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Security />}
                  onClick={verifyTransaction}
                  sx={{ mt: 1 }}
                >
                  Verify Transaction on Blockchain
                </Button>
              ) : (
                <Alert severity="success">
                  Transaction verified on blockchain
                </Alert>
              )}
            </>
          )}
        </Box>
      )}
      
      {(paymentMethod === 'razorpay' || paymentMethod === 'stripe' || paymentMethod === 'upi') && (
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Note: Payment details will be collected in the next step after order review.
          </Typography>
        </Box>
      )}
      
      {paymentMethod === 'cod' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Note: You will pay when your order is delivered. Please keep the exact amount ready.
          </Typography>
        </Box>
      )}
    </Box>
  );
  
  const renderOrderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {cartItems.map((item) => (
          <ListItem key={item.product} alignItems="flex-start" sx={{ py: 2 }}>
            <ListItemAvatar sx={{ mr: 2 }}>
              <Avatar
                variant="rounded"
                src={item.productData?.images?.[0] || '/images/products/default.jpg'}
                alt={item.name}
                sx={{ width: 60, height: 60 }}
              />
            </ListItemAvatar>
            
            <ListItemText
              primary={item.name}
              secondary={
                <React.Fragment>
                  <Typography variant="body2" component="span">
                    ₹{item.price.toFixed(2)} x {item.quantity}
                  </Typography>
                </React.Fragment>
              }
            />
            
            <Typography variant="subtitle1">
              ₹{(item.price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Shipping Address
        </Typography>
        
        <Typography variant="body1">
          {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}, {shippingAddress.country}
        </Typography>
        
        <Typography variant="body1" sx={{ mt: 1 }}>
          Phone: {shippingAddress.phoneNumber}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        
        <Typography variant="body1">
          {paymentMethod === 'cod' && 'Cash on Delivery'}
          {paymentMethod === 'razorpay' && 'Razorpay'}
          {paymentMethod === 'stripe' && 'Stripe'}
          {paymentMethod === 'upi' && 'UPI Payment'}
          {paymentMethod === 'blockchain' && 'Blockchain Payment (MetaMask)'}
        </Typography>
        
        {paymentMethod === 'blockchain' && walletConnected && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Wallet: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </Typography>
        )}
      </Box>
      
      {paymentMethod !== 'cod' && paymentMethod !== 'blockchain' && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" gutterBottom>
            Payment Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be redirected to the payment gateway after placing your order.
          </Typography>
        </Box>
      )}
      
      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          By placing this order, you agree to CropMarket-Mate's terms and conditions. For blockchain payments, a smart contract will be created to secure your transaction.
        </Alert>
      </Box>
    </Box>
  );
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderShippingAddressForm();
      case 1:
        return renderPaymentMethodForm();
      case 2:
        return renderOrderSummary();
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlaceOrder}
                  disabled={loading || (paymentMethod === 'blockchain' && !blockchainVerified)}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                >
                  Next
                </Button>
              )}
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
                  <Typography variant="body1">Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</Typography>
                  <Typography variant="body1">₹{calculateSubtotal().toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Tax (5%)</Typography>
                  <Typography variant="body1">₹{calculateTax().toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1">
                    {calculateShippingFee() === 0 
                      ? 'Free' 
                      : `₹${calculateShippingFee().toFixed(2)}`}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">₹{calculateTotal().toFixed(2)}</Typography>
              </Box>
              
              {paymentMethod === 'blockchain' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px solid #bae6fd' }}>
                  <Typography variant="body2" color="primary">
                    Blockchain payments are secured by smart contracts, providing transparency and security for your transaction.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;