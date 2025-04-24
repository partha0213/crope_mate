import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
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
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getMyOrders } from '../../redux/slices/orderSlice';
import Loader from '../ui/Loader';
import Message from '../ui/Message';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const { orders, loading, error } = useSelector((state) => state.orders);
  
  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);
  
  const filteredOrders = orders?.filter((order) => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (isPaid, isDelivered) => {
    if (isDelivered) return 'success';
    if (isPaid) return 'info';
    return 'warning';
  };
  
  const getStatusLabel = (isPaid, isDelivered) => {
    if (isDelivered) return 'Delivered';
    if (isPaid) return 'Shipped';
    return 'Processing';
  };
  
  if (loading) return <Loader />;
  if (error) return <Message severity="error">{error}</Message>;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Order History
        </Typography>
        <TextField
          placeholder="Search by Order ID"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 250 } }}
        />
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {!orders || orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't placed any orders yet.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <>
          {isMobile ? (
            <Grid container spacing={2}>
              {filteredOrders.map((order) => (
                <Grid item xs={12} key={order._id}>
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Order #{order._id.substring(0, 8)}...
                      </Typography>
                      <Chip
                        label={getStatusLabel(order.isPaid, order.isDelivered)}
                        color={getStatusColor(order.isPaid, order.isDelivered)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Items: {order.orderItems.length}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{order.totalPrice}
                      </Typography>
                    </Box>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/order/${order._id}`}
                      startIcon={<ViewIcon />}
                      sx={{ mt: 1 }}
                    >
                      View Details
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Delivered</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id.substring(0, 10)}...</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>₹{order.totalPrice}</TableCell>
                      <TableCell>
                        {order.isPaid ? (
                          new Date(order.paidAt).toLocaleDateString()
                        ) : (
                          <Chip label="Not Paid" size="small" color="error" />
                        )}
                      </TableCell>
                      <TableCell>
                        {order.isDelivered ? (
                          new Date(order.deliveredAt).toLocaleDateString()
                        ) : (
                          <Chip label="Not Delivered" size="small" color="default" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(order.isPaid, order.isDelivered)}
                          color={getStatusColor(order.isPaid, order.isDelivered)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          component={Link}
                          to={`/order/${order._id}`}
                          startIcon={<ViewIcon />}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default OrderHistory;