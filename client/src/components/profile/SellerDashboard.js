import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  BarChart as AnalyticsIcon,
  ShoppingBag as OrdersIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { 
  getSellerProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../redux/slices/productSlice';
import Loader from '../ui/Loader';
import Message from '../ui/Message';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    brand: '',
    category: '',
    countInStock: '',
    description: '',
    isOrganic: false,
    quality: 'standard',
    harvestDate: '',
    origin: '',
  });
  
  const { products, loading, error, success } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(getSellerProducts());
  }, [dispatch]);
  
  useEffect(() => {
    if (success) {
      handleCloseDialog();
    }
  }, [success]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpenDialog = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        countInStock: product.countInStock,
        description: product.description,
        isOrganic: product.isOrganic || false,
        quality: product.quality || 'standard',
        harvestDate: product.harvestDate || '',
        origin: product.origin || '',
      });
      setEditProductId(product._id);
    } else {
      setFormData({
        name: '',
        price: '',
        image: '',
        brand: '',
        category: '',
        countInStock: '',
        description: '',
        isOrganic: false,
        quality: 'standard',
        harvestDate: '',
        origin: '',
      });
      setEditProductId(null);
    }
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = () => {
    const productData = {
      ...formData,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
    };
    
    if (editProductId) {
      dispatch(updateProduct({ id: editProductId, productData }));
    } else {
      dispatch(createProduct(productData));
    }
  };
  
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };
  
  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Spices',
    'Herbs',
    'Nuts',
    'Seeds',
    'Other',
  ];
  
  const qualityLevels = [
    { value: 'premium', label: 'Premium' },
    { value: 'standard', label: 'Standard' },
    { value: 'economy', label: 'Economy' },
  ];
  
  if (loading) return <Loader />;
  if (error) return <Message severity="error">{error}</Message>;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Seller Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Product
        </Button>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<InventoryIcon />} label="Products" iconPosition="start" />
          <Tab icon={<OrdersIcon />} label="Orders" iconPosition="start" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" iconPosition="start" />
        </Tabs>
      </Paper>
      
      {tabValue === 0 && (
        <>
          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Start adding products to your inventory.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add New Product
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Box
                          component="img"
                          src={product.image}
                          alt={product.name}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>₹{product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.countInStock > 0 ? (
                          <Chip 
                            label={`${product.countInStock} in stock`} 
                            color="success" 
                            size="small" 
                          />
                        ) : (
                          <Chip 
                            label="Out of stock" 
                            color="error" 
                            size="small" 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product.quality || 'Standard'} 
                          color={
                            product.quality === 'premium' 
                              ? 'primary' 
                              : product.quality === 'economy' 
                                ? 'default' 
                                : 'info'
                          }
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(product)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
      
      {tabValue === 1 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Order Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Coming soon! You'll be able to manage your orders here.
          </Typography>
        </Box>
      )}
      
      {tabValue === 2 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Sales Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Coming soon! You'll be able to view your sales analytics here.
          </Typography>
        </Box>
      )}
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editProductId ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
              
              <TextField
                fullWidth
                label="Stock Quantity"
                name="countInStock"
                type="number"
                value={formData.countInStock}
                onChange={handleChange}
                required
                margin="normal"
              />
              
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                margin="normal"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Quality</InputLabel>
                <Select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  label="Quality"
                >
                  {qualityLevels.map((quality) => (
                    <MenuItem key={quality.value} value={quality.value}>
                      {quality.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <ImageIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {formData.image && (
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    mt: 2,
                    mb: 2,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    component="img"
                    src={formData.image}
                    alt="Product Preview"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Preview';
                    }}
                  />
                </Box>
              )}
              
              <TextField
                fullWidth
                label="Origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                margin="normal"
                placeholder="e.g., Maharashtra, India"
              />
              
              <TextField
                fullWidth
                label="Harvest Date"
                name="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <input
                  type="checkbox"
                  id="isOrganic"
                  name="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleChange}
                  style={{ marginRight: 8 }}
                />
                <label htmlFor="isOrganic">Organic Product</label>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {editProductId ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SellerDashboard;