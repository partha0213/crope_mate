import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Divider, Chip, Avatar, List, ListItem, ListItemText, ListItemAvatar, Stepper, Step, StepLabel, StepContent, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating } from '@mui/material';
import { ArrowBack, LocalShipping, Payment, CheckCircle, LocationOn, Receipt, AccessTime, VerifiedUser, Star, Message, Download } from '@mui/icons-material';
import { getOrderDetails, updateOrderStatus, addOrderReview } from '../../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { order, loading, error } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);
  
  const getOrderStatusStep = () => {
    const statusMap = {
      'pending': 0,
      'processing': 1,
      'shipped': 2,
      'delivered': 3,
      'cancelled': -1
    };
    
    return statusMap[order?.status] || 0;
  };
  
  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'error'
    };
    
    return colorMap[status] || 'default';
  };
  
  const handleOpenReviewDialog = (product) => {
    setSelectedProduct(product);
    setReviewDialogOpen(true);
  };
  
  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setReviewRating(5);
    setReviewComment('');
    setSelectedProduct(null);
  };
  
  const handleSubmitReview = () => {
    if (!reviewComment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    
    dispatch(addOrderReview({
      orderId: order._id,
      productId: selectedProduct._id,
      rating: reviewRating,
      comment: reviewComment
    }))
      .unwrap()
      .then(() => {
        toast.success('Review submitted successfully');
        handleCloseReviewDialog();
      })
      .catch(err => {
        toast.error(err || 'Failed to submit review');
      });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading && !order) {
    return <Spinner />;
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error loading order
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/orders"
          startIcon={<ArrowBack />}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Order not found
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/orders"
          startIcon={<ArrowBack />}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button
        component={Link}
        to="/orders"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Order #{order._id.substring(order._id.length - 8)}
        </Typography>
        <Chip 
          label={order.status.toUpperCase()} 
          color={getStatusColor(order.status)} 
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Placed on {formatDate(order.createdAt)}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {order.orderItems.map((item) => (
                <ListItem key={item._id} sx={{ py: 2, px: 0 }}>
                  <ListItemAvatar sx={{ mr: 2 }}>
                    <Avatar
                      src={item.product?.images?.[0] || '/images/products/default.jpg'}
                      alt={item.product?.name}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component={Link} to={`/products/${item.product?._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                        {item.product?.name}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.secondary">
                          {item.product?.category}
                        </Typography>
                        <Typography variant="body2">
                          ₹{item.price} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  {order.status === 'delivered' && !item.isReviewed && (
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleOpenReviewDialog(item.product)}
                      startIcon={<Star />}
                    >
                      Review
                    </Button>
                  )}
                  {item.isReviewed && (
                    <Chip 
                      icon={<CheckCircle fontSize="small" />} 
                      label="Reviewed" 
                      color="success" 
                      size="small" 
                    />
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body1" gutterBottom>
                  {order.shippingAddress.address}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {order.shippingAddress.country}
                </Typography>
                <Typography variant="body1">
                  Phone: {order.shippingAddress.phone}
                </Typography>
                
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <LocalShipping color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {order.deliveryOption === 'standard' && 'Standard Delivery (2-3 days)'}
                    {order.deliveryOption === 'express' && 'Express Delivery (24 hours)'}
                    {order.deliveryOption === 'pickup' && 'Self Pickup'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Payment color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                    {order.paymentMethod === 'upi' && 'UPI Payment'}
                    {order.paymentMethod === 'card' && 'Credit/Debit Card'}
                    {order.paymentMethod === 'netbanking' && 'Net Banking'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Receipt color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Payment Status: {order.isPaid ? 'Paid' : 'Not Paid'}
                  </Typography>
                </Box>
                
                {order.isPaid && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Paid on {formatDate(order.paidAt)}
                  </Typography>
                )}
                
                {order.paymentMethod === 'cod' && order.status === 'delivered' && !order.isPaid && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Mark as Paid
                  </Button>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Items" secondary={`${order.orderItems.length} items`} />
                <Typography variant="body1">
                  ₹{order.itemsPrice.toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Shipping" />
                <Typography variant="body1">
                  ₹{order.shippingPrice.toFixed(2)}
                </Typography>
              </ListItem>
              {order.taxPrice > 0 && (
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Tax" />
                  <Typography variant="body1">
                    ₹{order.taxPrice.toFixed(2)}
                  </Typography>
                </ListItem>
              )}
              {order.discount > 0 && (
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Discount" />
                  <Typography variant="body1" color="error">
                    -₹{order.discount.toFixed(2)}
                  </Typography>
                </ListItem>
              )}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">₹{order.totalPrice.toFixed(2)}</Typography>
            </Box>
            
            {order.status === 'delivered' && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Download />}
                sx={{ mb: 2 }}
              >
                Download Invoice
              </Button>
            )}
            
            {user?.role === 'seller' && order.status !== 'delivered' && order.status !== 'cancelled' && (
              <Button
                variant="contained"
                fullWidth
                color={order.status === 'shipped' ? 'success' : 'primary'}
                onClick={() => {
                  const nextStatus = order.status === 'pending' ? 'processing' : 
                                    order.status === 'processing' ? 'shipped' : 'delivered';
                  dispatch(updateOrderStatus({ orderId: order._id, status: nextStatus }));
                }}
              >
                {order.status === 'pending' && 'Process Order'}
                {order.status === 'processing' && 'Mark as Shipped'}
                {order.status === 'shipped' && 'Mark as Delivered'}
              </Button>
            )}
            
            {user?.role === 'buyer' && order.status !== 'delivered' && order.status !== 'cancelled' && (
              <Button
                variant="outlined"
                fullWidth
                color="error"
                sx={{ mt: 2 }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this order?')) {
                    dispatch(updateOrderStatus({ orderId: order._id, status: 'cancelled' }));
                  }
                }}
              >
                Cancel Order
              </Button>
            )}
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stepper activeStep={getOrderStatusStep()} orientation="vertical">
              <Step>
                <StepLabel>Order Placed</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Your order has been placed successfully.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(order.createdAt)}
                  </Typography>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Processing</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Your order is being processed by the seller.
                  </Typography>
                  {order.processingDate && (
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.processingDate)}
                    </Typography>
                  )}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Shipped</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Your order has been shipped.
                  </Typography>
                  {order.shippedDate && (
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.shippedDate)}
                    </Typography>
                  )}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Delivered</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Your order has been delivered.
                  </Typography>
                  {order.deliveredDate && (
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.deliveredDate)}
                    </Typography>
                  )}
                </StepContent>
              </Step>
            </Stepper>
            
            {order.status === 'cancelled' && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="error">
                  Order Cancelled
                </Typography>
                {order.cancelledDate && (
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(order.cancelledDate)}
                  </Typography>
                )}
                {order.cancellationReason && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Reason: {order.cancellationReason}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={selectedProduct?.images?.[0] || '/images/products/default.jpg'}
              alt={selectedProduct?.name}
              variant="rounded"
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1">
                {selectedProduct?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedProduct?.category}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Rate this product
            </Typography>
            <Rating
              name="review-rating"
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue);
              }}
              size="large"
            />
          </Box>
          
          <TextField
            autoFocus
            margin="dense"
            label="Your Review"
            fullWidth
            multiline
            rows={4}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience with this product..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderDetail;