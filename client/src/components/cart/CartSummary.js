import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ShoppingBag as CheckoutIcon,
  LocalShipping as ShippingIcon,
  Discount as CouponIcon,
} from '@mui/icons-material';

const CartSummary = ({ cartItems, onCheckout }) => {
  const theme = useTheme();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Calculate cart totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const discount = couponApplied ? couponDiscount : 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    // Mock coupon application
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setCouponApplied(true);
      setCouponDiscount(subtotal * 0.1); // 10% discount
    } else {
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Order Summary
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              ₹{subtotal.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Shipping
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
            </Typography>
          </Box>

          {couponApplied && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Discount (WELCOME10)
              </Typography>
              <Typography variant="body1" fontWeight="medium" color="error.main">
                -₹{discount.toFixed(2)}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              ₹{total.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel htmlFor="coupon-code">Coupon Code</InputLabel>
              <OutlinedInput
                id="coupon-code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <Button 
                      onClick={handleApplyCoupon}
                      disabled={!couponCode}
                      size="small"
                    >
                      Apply
                    </Button>
                  </InputAdornment>
                }
                label="Coupon Code"
                startAdornment={
                  <InputAdornment position="start">
                    <CouponIcon fontSize="small" />
                  </InputAdornment>
                }
              />
            </FormControl>
            {shipping > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShippingIcon fontSize="small" />
                Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<CheckoutIcon />}
            onClick={onCheckout}
            sx={{ 
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              boxShadow: theme.shadows[4],
            }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartSummary;