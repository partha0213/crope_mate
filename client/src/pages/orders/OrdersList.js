import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Divider, Chip, Tab, Tabs, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, IconButton, TextField, InputAdornment } from '@mui/material';
import { Search, FilterList, Sort, ArrowForward, LocalShipping, Receipt, CheckCircle, Cancel } from '@mui/icons-material';
import { getMyOrders } from '../../redux/slices/orderSlice';
import Spinner from '../../components/layout/Spinner';

const OrdersList = () => {
  const dispatch = useDispatch();
  
  const { orders, loading, error } = useSelector(state => state.orders);
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');
  
  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Receipt color="warning" />;
      case 'processing':
        return <LocalShipping color="info" />;
      case 'shipped':
        return <LocalShipping color="primary" />;
      case 'delivered':
        return <CheckCircle color="success" />;
      case 'cancelled':
        return <Cancel color="error" />;
      default:
        return <Receipt />;
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const filterOrders = () => {
    let filteredOrders = [...orders];
    
    // Filter by tab
    if (activeTab === 1) {
      filteredOrders = filteredOrders.filter(order => order.status === 'pending' || order.status === 'processing');
    } else if (activeTab === 2) {
      filteredOrders = filteredOrders.filter(order => order.status === 'shipped');
    } else if (activeTab === 3) {
      filteredOrders = filteredOrders.filter(order => order.status === 'delivered');
    } else if (activeTab === 4) {
      filteredOrders = filteredOrders.filter(order => order.status === 'cancelled');
    }
    
    // Filter by search term
    if (searchTerm) {
      filteredOrders = filteredOrders.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderItems.some(item => 
          item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Sort orders
    if (sortOption === 'date-desc') {
      filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'date-asc') {
      filteredOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === 'price-desc') {
      filteredOrders.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortOption === 'price-asc') {
      filteredOrders.sort((a, b) => a.totalPrice - b.totalPrice);
    }
    
    return filteredOrders;
  };
  
  if (loading && orders.length === 0) {
    return <Spinner />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                placeholder="Search orders..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 400, mr: 2 }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <Sort sx={{ mr: 1 }} />
                <TextField
                  select
                  size="small"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                </TextField>
              </Box>
            </Box>
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Orders" />
              <Tab label="Processing" />
              <Tab label="Shipped" />
              <Tab label="Delivered" />
              <Tab label="Cancelled" />
            </Tabs>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          {error ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="error" gutterBottom>
                Error loading orders
              </Typography>
              <Typography variant="body1">
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => dispatch(getMyOrders())}
                sx={{ mt: 2 }}
              >
                Try Again
              </Button>
            </Paper>
          ) : filterOrders().length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Receipt sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No orders found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {activeTab === 0 
                  ? "You haven't placed any orders yet." 
                  : "You don't have any orders with this status."}
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/marketplace"
                sx={{ mt: 2 }}
              >
                Browse Products
              </Button>
            </Paper>
          ) : (
            <List>
              {filterOrders().map((order) => (
                <Paper key={order._id} sx={{ mb: 2 }}>
                  <ListItem sx={{ py: 2 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(order.status)}
                          <Typography variant="subtitle1" sx={{ ml: 1 }}>
                            Order #{order._id.substring(order._id.length - 8)}
                          </Typography>
                          <Chip 
                            label={order.status.toUpperCase()} 
                            color={getStatusColor(order.status)} 
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Placed on {formatDate(order.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={7}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {order.orderItems.slice(0, 3).map((item) => (
                              <Box key={item._id} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                  src={item.product?.images?.[0] || '/images/products/default.jpg'}
                                  alt={item.product?.name}
                                  variant="rounded"
                                  sx={{ width: 40, height: 40, mr: 1 }}
                                />
                                <Box>
                                  <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                    {item.product?.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Qty: {item.quantity}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                            {order.orderItems.length > 3 && (
                              <Chip 
                                label={`+${order.orderItems.length - 3} more`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={5}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Total Amount
                              </Typography>
                              <Typography variant="h6">
                                ₹{order.totalPrice.toFixed(2)}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              component={Link}
                              to={`/orders/${order._id}`}
                              endIcon={<ArrowForward />}
                            >
                              View Details
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrdersList;