import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Card, CardContent, CardMedia, CardActions, Button, TextField, InputAdornment, IconButton, Chip, Divider, FormControl, InputLabel, Select, MenuItem, Pagination, Rating, Avatar } from '@mui/material';
import { Search, FilterList, LocationOn, Sort, Favorite, FavoriteBorder, ShoppingCart, VerifiedUser, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { getProducts, addToFavorites, removeFromFavorites } from '../../redux/slices/productSlice';
import Spinner from '../../components/layout/Spinner';

const Marketplace = () => {
  const dispatch = useDispatch();
  const { products, loading, totalPages } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const queryParams = {
      page: currentPage,
      limit: 12,
      ...filters
    };
    
    if (searchTerm) {
      queryParams.search = searchTerm;
    }
    
    dispatch(getProducts(queryParams));
  }, [dispatch, currentPage, filters, searchTerm]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };
  
  const handleToggleFavorite = (productId, isFavorite) => {
    if (!user) {
      // Redirect to login or show login prompt
      return;
    }
    
    if (isFavorite) {
      dispatch(removeFromFavorites(productId));
    } else {
      dispatch(addToFavorites(productId));
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };
  
  const handleClearFilters = () => {
    setFilters({
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'newest'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  const categories = [
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'pulses', label: 'Pulses & Legumes' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'spices', label: 'Spices & Herbs' },
    { value: 'nuts', label: 'Nuts & Seeds' },
    { value: 'organic', label: 'Organic Products' }
  ];
  
  const locations = [
    { value: 'punjab', label: 'Punjab' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'up', label: 'Uttar Pradesh' },
    { value: 'mp', label: 'Madhya Pradesh' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'andhra', label: 'Andhra Pradesh' }
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' }
  ];
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Marketplace
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/products/add"
        >
          Sell Your Produce
        </Button>
      </Box>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder="Search for products, crops, etc."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button type="submit" variant="contained" size="small">
                        Search
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </form>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  label="Sort By"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  size="small"
                >
                  {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </Box>
          </Grid>
          
          {showFilters && (
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        label="Category"
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                      >
                        <MenuItem value="">All Categories</MenuItem>
                        {categories.map(category => (
                          <MenuItem key={category.value} value={category.value}>
                            {category.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="location-label">Location</InputLabel>
                      <Select
                        labelId="location-label"
                        label="Location"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                      >
                        <MenuItem value="">All Locations</MenuItem>
                        {locations.map(location => (
                          <MenuItem key={location.value} value={location.value}>
                            {location.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Min Price"
                      name="minPrice"
                      type="number"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Max Price"
                      name="maxPrice"
                      type="number"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="rating-label">Min Rating</InputLabel>
                      <Select
                        labelId="rating-label"
                        label="Min Rating"
                        name="rating"
                        value={filters.rating}
                        onChange={handleFilterChange}
                      >
                        <MenuItem value="">Any Rating</MenuItem>
                        <MenuItem value="5">5 Stars</MenuItem>
                        <MenuItem value="4">4+ Stars</MenuItem>
                        <MenuItem value="3">3+ Stars</MenuItem>
                        <MenuItem value="2">2+ Stars</MenuItem>
                        <MenuItem value="1">1+ Stars</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button onClick={handleClearFilters}>
                        Clear Filters
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Product Listings */}
      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Try adjusting your search or filter criteria
          </Typography>
          <Button
            variant="contained"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {products.length} of {totalPages * 12} products
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {products.map(product => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255, 255, 255, 0.7)' }}
                    onClick={() => handleToggleFavorite(product._id, product.isFavorite)}
                  >
                    {product.isFavorite ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                  
                  <CardMedia
                    component="img"
                    height="160"
                    image={product.images?.[0] || '/images/products/default.jpg'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component={Link} to={`/products/${product._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                        {product.name}
                      </Typography>
                      {product.seller?.isVerified && (
                        <Chip 
                          icon={<VerifiedUser fontSize="small" />} 
                          label="Verified" 
                          color="success" 
                          size="small" 
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.category}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating || 0} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.numReviews || 0})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {product.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="h6" color="primary">
                        ₹{product.price}/{product.unit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.quantity} {product.unit} available
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Avatar
                        src={product.seller?.profileImage || '/images/default-avatar.jpg'}
                        alt={product.seller?.name}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {product.seller?.name}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/products/${product._id}`}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained" 
                      startIcon={<ShoppingCart />}
                      sx={{ ml: 'auto' }}
                    >
                      Buy Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Marketplace;