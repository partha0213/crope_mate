import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  LocalAtm as CashIcon,
  CurrencyRupee as UPIIcon,
} from '@mui/icons-material';
import { savePaymentMethod } from '../../redux/slices/cartSlice';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { shippingAddress, paymentMethod: savedPaymentMethod } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [paymentMethod, setPaymentMethod] = useState(savedPaymentMethod || 'UPI');
  
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=payment');
    }
    
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, user, shippingAddress]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };
  
  const paymentOptions = [
    {
      id: 'UPI',
      label: 'UPI Payment',
      description: 'Pay using UPI apps like Google Pay, PhonePe, or Paytm',
      icon: <UPIIcon />,
    },
    {
      id: 'CreditCard',
      label: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      icon: <CreditCardIcon />,
    },
    {
      id: 'NetBanking',
      label: 'Net Banking',
      description: 'Pay directly from your bank account',
      icon: <BankIcon />,
    },
    {
      id: 'COD',
      label: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: <CashIcon />,
    },
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CheckoutSteps activeStep={1} />
      
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PaymentIcon color="primary" sx={{ mr: 2, fontSize: 30 }} />
          <Typography variant="h5" component="h1" fontWeight="bold">
            Payment Method
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              name="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Grid container spacing={2}>
                {paymentOptions.map((option) => (
                  <Grid item xs={12} key={option.id}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderColor: paymentMethod === option.id ? 'primary.main' : 'divider',
                        borderWidth: paymentMethod === option.id ? 2 : 1,
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                      onClick={() => setPaymentMethod(option.id)}
                    >
                      <FormControlLabel
                        value={option.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'action.hover',
                                mr: 2,
                              }}
                            >
                              {option.icon}
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {option.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {option.description}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/shipping')}
            >
              Back to Shipping
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Continue to Review
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PaymentPage;