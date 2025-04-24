import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Divider, Card, CardContent, CardActions, CardMedia, IconButton, TextField, InputAdornment, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip, CircularProgress } from '@mui/material';
import { Add, Search, FilterList, Sort, Visibility, Edit, Delete, MoreVert } from '@mui/icons-material';
import { getSellerProducts, deleteProduct } from '../../redux/slices/productSlice';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';

const ProductList = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.auth);
  const { products, loading, error } = useSelector(state => state.products);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  
  useEffect(() => {
    if (user?.role === 'seller') {
      dispatch(getSellerProducts());
    }
  }, [dispatch, user]);
  
  const handleMenuOpen = (event, productId) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProductId(null);
  };
  
  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedProductId) return;
    
    setDeletingProduct(true);
    
    try {
      await dispatch(deleteProduct(selectedProductId)).unwrap();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error || 'Failed to delete product');
    } finally {
      setDeletingProduct(false);
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };
  
  const filterProducts = () => {
    let filteredProducts = [...(products || [])];
    
    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (filterCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === filterCategory
      );
    }
    
    // Sort products
    if (sortOption === 'newest') {
      filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'oldest') {
      filteredProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === 'price-high') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'price-low') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'name-asc') {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    return filteredProducts;
  };
  
  if (user?.role !== 'seller') {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Seller Access Required
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
  
  if (loading && !products) {
    return <Spinner />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          My Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/seller/products/new"
        >
          Add New Product
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1, color: 'text.secondary' }} />
              <TextField
                select
                fullWidth
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                size="small"
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="vegetables">Vegetables</MenuItem>
                <MenuItem value="fruits">Fruits</MenuItem>
                <MenuItem value="grains">Grains</MenuItem>
                <MenuItem value="pulses">Pulses</MenuItem>
                <MenuItem value="dairy">Dairy</MenuItem>
                <MenuItem value="spices">Spices</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Sort sx={{ mr: 1, color: 'text.secondary' }} />
              <TextField
                select
                fullWidth
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                size="small"
                label="Sort By"
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="name-asc">Name: A to Z</MenuItem>
                <MenuItem value="name-desc">Name: Z to A</MenuItem>
              </TextField>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {error ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error loading products
          </Typography>
          <Typography variant="body1">
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => dispatch(getSellerProducts())}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      ) : filterProducts().length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {products?.length === 0
              ? "You haven't added any products yet."
              : "No products match your search criteria."}
          </Typography>
          {products?.length === 0 && (
            <Button
              variant="contained"
              component={Link}
              to="/seller/products/new"
              startIcon={<Add />}
              sx={{ mt: 2 }}
            >
              Add Your First Product
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filterProducts().map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.images?.[0] || '/images/products/default.jpg'}
                    alt={product.name}
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
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" noWrap>
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Typography>
                    <Chip
                      label={`${product.countInStock} in stock`}
                      size="small"
                      color={product.countInStock > 0 ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    ₹{product.price.toFixed(2)} / {product.unit}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 1
                    }}
                  >
                    {product.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {product.tags.length > 3 && (
                      <Chip
                        label={`+${product.tags.length - 3}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton
                      component={Link}
                      to={`/products/${product._id}`}
                      size="small"
                      title="View Product"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/seller/products/edit/${product._id}`}
                      size="small"
                      title="Edit Product"
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                  
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, product._id)}
                    title="More Options"
                  >
                    <MoreVert />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Product Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          component={Link}
          to={`/products/${selectedProductId}`}
          onClick={handleMenuClose}
        >
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem
          component={Link}
          to={`/seller/products/edit/${selectedProductId}`}
          onClick={handleMenuClose}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Product
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Product
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deletingProduct && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deletingProduct}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deletingProduct}
            startIcon={deletingProduct ? <CircularProgress size={20} /> : <Delete />}
          >
            {deletingProduct ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductList;