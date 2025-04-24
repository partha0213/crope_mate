import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionById, updateTransactionStatus } from '../../redux/slices/transactionSlice';
import { toast } from 'react-toastify';
import { Container, Typography, Box, Paper, Grid, Divider, Chip, Button, Stepper, Step, StepLabel, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import { ArrowBack, LocalShipping, CheckCircle, Cancel, Receipt, Visibility, LocationOn, Person, ShoppingCart, VerifiedUser } from '@mui/icons-material';
import Spinner from '../../components/layout/Spinner';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { transaction, loading } = useSelector(state => state.transaction);
  const { user } = useSelector(state => state.auth);
  const { connected } = useSelector(state => state.blockchain);
  
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  useEffect(() => {
    dispatch(getTransactionById(id));
  }, [dispatch, id]);
  
  const handleCancelTransaction = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    
    dispatch(updateTransactionStatus({ 
      id: transaction._id, 
      status: 'cancelled',
      notes: cancelReason
    }))
      .unwrap()
      .then(() => {
        toast.success('Transaction cancelled successfully');
        setCancelDialogOpen(false);
      })
      .catch(err => {
        toast.error(err || 'Failed to cancel transaction');
      });
  };
  
  const handleCompleteTransaction = () => {
    dispatch(updateTransactionStatus({ 
      id: transaction._id, 
      status: 'completed'
    }))
      .unwrap()
      .then(() => {
        toast.success('Transaction completed successfully');
        setCompleteDialogOpen(false);
      })
      .catch(err => {
        toast.error(err || 'Failed to complete transaction');
      });
  };
  
  // Get current step based on status
  const getCurrentStep = (status) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'shipped':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };
  
  // Get status chip
  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'warning', icon: <LocalShipping />, label: 'Pending' };
      case 'shipped':
        return { color: 'info', icon: <LocalShipping />, label: 'Shipped' };
      case 'completed':
        return { color: 'success', icon: <CheckCircle />, label: 'Completed' };
      case 'cancelled':
        return { color: 'error', icon: <Cancel />, label: 'Cancelled' };
      default:
        return { color: 'default', icon: null, label: status };
    }
  };
  
  if (loading || !transaction) {
    return <Spinner />;
  }
  
  const statusChip = getStatusChip(transaction.status);
  const currentStep = getCurrentStep(transaction.status);
  const isBuyer = user?._id === transaction.buyer?._id;
  const isSeller = user?._id === transaction.seller?._id;
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button 
        component={Link} 
        to="/transactions" 
        startIcon={<ArrowBack />} 
        sx={{ mb: 3 }}
      >
        Back to Transactions
      </Button>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4">
                Transaction Details
              </Typography>
              <Chip
                icon={statusChip.icon}
                label={statusChip.label}
                color={statusChip.color}
                size="medium"
              />
            </Box>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Transaction ID: {transaction._id}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Created on {new Date(transaction.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
            
            {transaction.status === 'cancelled' && transaction.notes && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="error.contrastText">
                  Cancellation Reason:
                </Typography>
                <Typography variant="body2" color="error.contrastText">
                  {transaction.notes}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Transaction Progress */}
        {transaction.status !== 'cancelled' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Transaction Progress
              </Typography>
              <Stepper activeStep={currentStep} alternativeLabel sx={{ mt: 3 }}>
                <Step>
                  <StepLabel>Order Placed</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Processing</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Shipped</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Delivered</StepLabel>
                </Step>
              </Stepper>
            </Paper>
          </Grid>
        )}
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Box 
                component="img" 
                src={transaction.product?.images?.[0] || '/images/product-placeholder.jpg'} 
                alt={transaction.product?.name} 
                sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">
                  {transaction.product?.name || 'Unknown Product'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 1 }}>
                  {transaction.product?.isOrganic && (
                    <Chip 
                      label="Organic" 
                      size="small" 
                      color="success" 
                      icon={<VerifiedUser fontSize="small" />} 
                    />
                  )}
                  <Chip 
                    label={transaction.product?.category} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  component={Link}
                  to={`/products/${transaction.product?._id}`}
                >
                  View Product
                </Button>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Unit Price:
                </Typography>
                <Typography variant="body1">
                  ₹{(transaction.totalAmount / transaction.quantity).toFixed(2)} / {transaction.product?.unit || 'unit'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Quantity:
                </Typography>
                <Typography variant="body1">
                  {transaction.quantity} {transaction.product?.unit || 'units'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Amount:
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{transaction.totalAmount.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Buyer and Seller Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {isBuyer ? 'Seller Information' : 'Buyer Information'}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {isBuyer 
                  ? transaction.seller?.name || 'Unknown Seller'
                  : transaction.buyer?.name || 'Unknown Buyer'
                }
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <LocationOn color="action" sx={{ mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="body1">
                  Shipping Address:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {transaction.shippingAddress?.address}, {transaction.shippingAddress?.city}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {transaction.shippingAddress?.state}, {transaction.shippingAddress?.postalCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {transaction.shippingAddress?.country}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Payment Method:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {transaction.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
            </Typography>
            
            {connected && transaction.blockchainData && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Blockchain Transaction:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {transaction.blockchainData.transactionHash}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Action Buttons */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Actions
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Receipt />}
              >
                Download Receipt
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {transaction.status === 'pending' && (
                <>
                  {isSeller && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LocalShipping />}
                      onClick={() => setCompleteDialogOpen(true)}
                    >
                      Mark as Shipped
                    </Button>
                  )}
                  
                  {(isBuyer || isSeller) && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => setCancelDialogOpen(true)}
                    >
                      Cancel Transaction
                    </Button>
                  )}
                </>
              )}
              
              {transaction.status === 'shipped' && isBuyer && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => setCompleteDialogOpen(true)}
                >
                  Confirm Delivery
                </Button>
              )}
              
              {transaction.status === 'completed' && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ShoppingCart />}
                  component={Link}
                  to="/marketplace"
                >
                  Shop More
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Cancel Transaction Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to cancel this transaction? This action cannot be undone.
          </DialogContentText>
          <TextField
            autoFocus
            label="Reason for Cancellation"
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            No, Keep Transaction
          </Button>
          <Button onClick={handleCancelTransaction} color="error">
            Yes, Cancel Transaction
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Complete Transaction Dialog */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
      >
        <DialogTitle>
          {isSeller ? 'Mark as Shipped' : 'Confirm Delivery'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isSeller 
              ? 'Are you sure you want to mark this transaction as shipped? This will notify the buyer that their order is on the way.'
              : 'Are you sure you want to confirm delivery? This will complete the transaction and release payment to the seller.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCompleteTransaction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransactionDetails;