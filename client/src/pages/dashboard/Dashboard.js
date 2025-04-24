import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Divider, Card, CardContent, CardActions, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Chip, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Add, ArrowForward, Inventory, ShoppingCart, AttachMoney, People, Visibility, Edit, Delete, Refresh } from '@mui/icons-material';
import { getSellerStats, getSellerProducts, getSellerOrders } from '../../redux/slices/dashboardSlice';
import Spinner from '../../components/layout/Spinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.auth);
  const { stats, products, orders, loading, error } = useSelector(state => state.dashboard);
  
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (user?.role === 'seller') {
      dispatch(getSellerStats());
      dispatch(getSellerProducts());
      dispatch(getSellerOrders());
    }
  }, [dispatch, user]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    Promise.all([
      dispatch(getSellerStats()),
      dispatch(getSellerProducts()),
      dispatch(getSellerOrders())
    ]).finally(() => {
      setRefreshing(false);
    });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
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
  
  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 }
  ];
  
  const categoryData = [
    { name: 'Vegetables', value: 400 },
    { name: 'Fruits', value: 300 },
    { name: 'Grains', value: 300 },
    { name: 'Dairy', value: 200 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  if (user?.role !== 'seller') {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Seller Dashboard Access Restricted
        </Typography>
        <Typography variant="body1" paragraph>
          You need a seller account to access this page.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/profile"
        >
          Go to Profile
        </Button>
      </Container>
    );
  }
  
  if (loading && !stats) {
    return <Spinner />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Seller Dashboard
        </Typography>
        <Button
          startIcon={refreshing ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          Refresh
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total Revenue
              </Typography>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <AttachMoney />
              </Avatar>
            </Box>
            <Typography component="p" variant="h4">
              ₹{stats?.totalRevenue?.toFixed(2) || '0.00'}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Lifetime earnings
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total Orders
              </Typography>
              <Avatar sx={{ bgcolor: '#ff9800' }}>
                <ShoppingCart />
              </Avatar>
            </Box>
            <Typography component="p" variant="h4">
              {stats?.totalOrders || 0}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              {stats?.pendingOrders || 0} pending
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Products
              </Typography>
              <Avatar sx={{ bgcolor: '#4caf50' }}>
                <Inventory />
              </Avatar>
            </Box>
            <Typography component="p" variant="h4">
              {stats?.totalProducts || 0}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              {stats?.outOfStockProducts || 0} out of stock
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Customers
              </Typography>
              <Avatar sx={{ bgcolor: '#9c27b0' }}>
                <People />
              </Avatar>
            </Box>
            <Typography component="p" variant="h4">
              {stats?.totalCustomers || 0}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Unique buyers
            </Typography>
          </Paper>
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Sales Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={stats?.salesOverTime || salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.salesByCategory || categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(stats?.salesByCategory || categoryData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary">
                Recent Orders
              </Typography>
              <Button
                component={Link}
                to="/seller/orders"
                endIcon={<ArrowForward />}
                size="small"
              >
                View All
              </Button>
            </Box>
            
            {orders?.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No orders found
                </Typography>
              </Box>
            ) : (
              <List>
                {(orders || []).slice(0, 5).map((order) => (
                  <Paper key={order._id} sx={{ mb: 2 }}>
                    <ListItem sx={{ py: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1">
                            Order #{order._id.substring(order._id.length - 8)}
                          </Typography>
                          <Chip 
                            label={order.status.toUpperCase()} 
                            color={getStatusColor(order.status)} 
                            size="small"
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(order.createdAt)} • {order.orderItems.length} items • ₹{order.totalPrice.toFixed(2)}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            to={`/orders/${order._id}`}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Box>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Products */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary">
                Your Products
              </Typography>
              <Box>
                <Button
                  component={Link}
                  to="/seller/products"
                  endIcon={<ArrowForward />}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  View All
                </Button>
                <Button
                  component={Link}
                  to="/seller/products/new"
                  startIcon={<Add />}
                  variant="contained"
                  size="small"
                >
                  Add Product
                </Button>
              </Box>
            </Box>
            
            {products?.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No products found
                </Typography>
                <Button
                  component={Link}
                  to="/seller/products/new"
                  startIcon={<Add />}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Add Your First Product
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {(products || []).slice(0, 4).map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product._id}>
                    <Card>
                      <Box sx={{ position: 'relative', pt: '100%' }}>
                        <Avatar
                          src={product.images?.[0] || '/images/products/default.jpg'}
                          alt={product.name}
                          variant="square"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {product.countInStock === 0 && (
                          <Chip
                            label="Out of Stock"
                            color="error"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8
                            }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ pb: 1 }}>
                        <Typography variant="subtitle1" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {product.category}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ₹{product.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton
                          component={Link}
                          to={`/products/${product._id}`}
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          component={Link}
                          to={`/seller/products/edit/${product._id}`}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;