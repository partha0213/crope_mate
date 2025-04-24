import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, CardActions, Button, IconButton, Chip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, InputAdornment, Divider, Paper } from '@mui/material';
import { Edit, Delete, MoreVert, Add, Search, FilterList, Sort, Visibility, ShoppingCart, TrendingUp, TrendingDown } from '@mui/icons-material';
import { getMyProducts, deleteProduct, updateProductStock } from '../../redux/slices/productSlice';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';

const MyProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.product);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [newStock, setNewStock] = useState('');
  
  useEffect(() => {
    dispatch(getMyProducts());
  }, [dispatch]);
  
  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  const handleDeleteConfirm = () => {
    dispatch(deleteProduct(selectedProduct._id))
      .unwrap()
      .then(() => {
        toast.success('Product deleted successfully');
        setDeleteDialogOpen(false);
      })
      .catch(err => {
        toast.error(err || 'Failed to delete product');
      });
  };
  
  const handleUpdateStockClick = () => {
    setNewStock(selectedProduct.stock.toString());
    setStockDialogOpen(true);
    handleMenuClose();
  };
  
  const handleStockUpdate = () => {
    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }
    
    dispatch(updateProductStock({ id: selectedProduct._id, stock: stockValue }))
      .unwrap()
      .then(() => {
        toast.success('Stock updated successfully');
        setStockDialogOpen(false);
      })
      .catch(err => {
        toast.error(err || 'Failed to update stock');
      });
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Filter and sort products
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
  
  if (loading && products.length === 0) {
    return <Spinner />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          My Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          component={Link}
          to="/products/add"
        >
          Add New Product
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={handleSortChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Sort />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="priceAsc">Price: Low to High</MenuItem>
              <MenuItem value="priceDesc">Price: High to Low</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>
      
      {sortedProducts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {searchTerm ? 'Try a different search term' : 'You haven\'t added any products yet'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            component={Link}
            to="/products/add"
          >
            Add Your First Product
          </Button>
        </Paper>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Showing {sortedProducts.length} products
          </Typography>
          
          <Grid container spacing={3}>
            {sortedProducts.map(product => (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images[0] || '/images/product-placeholder.jpg'}
                      alt={product.name}
                    />
                    <IconButton
                      sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255, 255, 255, 0.7)' }}
                      onClick={(e) => handleMenuOpen(e, product)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {product.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {product.isOrganic && (
                        <Chip label="Organic" size="small" color="success" />
                      )}
                      <Chip label={product.category} size="small" variant="outlined" />
                      {product.aiPredictions?.marketTrend === 'rising' ? (
                        <Chip 
                          icon={<TrendingUp fontSize="small" />} 
                          label="Rising" 
                          size="small" 
                          color="primary" 
                        />
                      ) : product.aiPredictions?.marketTrend === 'falling' ? (
                        <Chip 
                          icon={<TrendingDown fontSize="small" />} 
                          label="Falling" 
                          size="small" 
                          color="error" 
                        />
                      ) : null}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description.substring(0, 100)}
                      {product.description.length > 100 && '...'}
                    </Typography>
                    
                    <Typography variant="h6" color="primary" gutterBottom>
                      ₹{product.price} / {product.unit}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        Stock: {product.stock} {product.unit}
                      </Typography>
                      <Chip 
                        label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
                        size="small" 
                        color={product.stock > 0 ? 'success' : 'error'} 
                      />
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<Visibility />}
                      component={Link}
                      to={`/products/${product._id}`}
                    >
                      View
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<Edit />}
                      component={Link}
                      to={`/products/edit/${product._id}`}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      startIcon={<Delete />}
                      onClick={handleDeleteClick}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {/* Product Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          component={Link} 
          to={`/products/${selectedProduct?._id}`}
          onClick={handleMenuClose}
        >
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem 
          component={Link} 
          to={`/products/edit/${selectedProduct?._id}`}
          onClick={handleMenuClose}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Product
        </MenuItem>
        <MenuItem onClick={handleUpdateStockClick}>
          <ShoppingCart fontSize="small" sx={{ mr: 1 }} /> Update Stock
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Product
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Update Stock Dialog */}
      <Dialog
        open={stockDialogOpen}
        onClose={() => setStockDialogOpen(false)}
      >
        <DialogTitle>Update Stock</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update available stock for "{selectedProduct?.name}".
          </DialogContentText>
          <TextField
            autoFocus
            label="Available Stock"
            type="number"
            fullWidth
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">{selectedProduct?.unit}</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStockUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyProducts;