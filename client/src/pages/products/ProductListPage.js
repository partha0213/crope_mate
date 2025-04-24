import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { fetchProducts } from '../../redux/slices/productSlice';
import { setActiveFilters, toggleFilterDrawer, setFilterDrawerOpen, setViewMode } from '../../redux/slices/uiSlice';
import ProductCard from '../../components/products/ProductCard';
import ProductListItem from '../../components/products/ProductListItem';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { products, loading, error, totalPages, page } = useSelector((state) => state.products);
  const { activeFilters, filterDrawerOpen, viewMode, searchQuery } = useSelector((state) => state.ui);

  const [localFilters, setLocalFilters] = useState({
    category: activeFilters.category || '',
    minPrice: activeFilters.minPrice || '',
    maxPrice: activeFilters.maxPrice || '',
    qualityGrade: activeFilters.qualityGrade || '',
    sortBy: activeFilters.sortBy || 'newest',
  });
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const search = params.get('search');
    const page = params.get('page');
    
    const filters = { ...activeFilters };
    if (category) filters.category = category;
    
    dispatch(setActiveFilters(filters));
    
    // Fetch products based on filters and search
    dispatch(fetchProducts({
      page: page || 1,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      qualityGrade: filters.qualityGrade,
      sortBy: filters.sortBy,
      search: search || searchQuery,
    }));
  }, [dispatch, location.search]);

  const handlePageChange = (event, value) => {
    navigate(`/products?page=${value}`);
  };

  const handleFilterChange = (name, value) => {
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setLocalFilters({
      ...localFilters,
      minPrice: newValue[0],
      maxPrice: newValue[1],
    });
  };

  const applyFilters = () => {
    dispatch(setActiveFilters(localFilters));
    dispatch(fetchProducts({
      page: 1,
      ...localFilters,
      search: searchQuery,
    }));
    if (isMobile) {
      dispatch(setFilterDrawerOpen(false));
    }
  };

  const resetFilters = () => {
    const resetFiltersData = {
      category: '',
      minPrice: '',
      maxPrice: '',
      qualityGrade: '',
      sortBy: 'newest',
    };
    setLocalFilters(resetFiltersData);
    setPriceRange([0, 10000]);
    dispatch(setActiveFilters(resetFiltersData));
    dispatch(fetchProducts({
      page: 1,
      ...resetFiltersData,
      search: searchQuery,
    }));
  };

  const toggleView = () => {
    dispatch(setViewMode(viewMode === 'grid' ? 'list' : 'grid'));
  };

  const filterContent = (
    <Box sx={{ p: isMobile ? 3 : 0 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Filters</Typography>
          <IconButton onClick={() => dispatch(setFilterDrawerOpen(false))}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Categories
      </Typography>
      <FormControl fullWidth margin="normal" size="small" sx={{ mb: 3 }}>
        <InputLabel>Select Category</InputLabel>
        <Select
          value={localFilters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          label="Select Category"
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="Grains">Grains</MenuItem>
          <MenuItem value="Vegetables">Vegetables</MenuItem>
          <MenuItem value="Fruits">Fruits</MenuItem>
          <MenuItem value="Pulses">Pulses</MenuItem>
          <MenuItem value="Oilseeds">Oilseeds</MenuItem>
          <MenuItem value="Spices">Spices</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Price Range
      </Typography>
      <Box sx={{ px: 1, mb: 3 }}>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={100}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            ₹{priceRange[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₹{priceRange[1]}
          </Typography>
        </Box>
      </Box>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Quality Grade
      </Typography>
      <FormControl fullWidth margin="normal" size="small" sx={{ mb: 3 }}>
        <InputLabel>Select Grade</InputLabel>
        <Select
          value={localFilters.qualityGrade}
          onChange={(e) => handleFilterChange('qualityGrade', e.target.value)}
          label="Select Grade"
        >
          <MenuItem value="">All Grades</MenuItem>
          <MenuItem value="A">Grade A</MenuItem>
          <MenuItem value="B">Grade B</MenuItem>
          <MenuItem value="C">Grade C</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Sort By
      </Typography>
      <FormControl fullWidth margin="normal" size="small" sx={{ mb: 3 }}>
        <InputLabel>Sort Products</InputLabel>
        <Select
          value={localFilters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          label="Sort Products"
        >
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="price_low">Price: Low to High</MenuItem>
          <MenuItem value="price_high">Price: High to Low</MenuItem>
          <MenuItem value="rating">Highest Rated</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={resetFilters}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Crop Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and buy high-quality crops directly from farmers
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Filters - Desktop */}
        <Grid item xs={12} md={3} lg={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            {filterContent}
          </Paper>
        </Grid>

        {/* Products */}
        <Grid item xs={12} md={9} lg={9.5}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              {searchQuery && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Search results for: <Chip label={searchQuery} onDelete={() => {}} />
                </Typography>
              )}
              {activeFilters.category && (
                <Typography variant="body1">
                  Category: <Chip label={activeFilters.category} onDelete={() => {}} />
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={toggleView}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                onClick={toggleView}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ListViewIcon />
              </IconButton>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => dispatch(toggleFilterDrawer())}
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                Filters
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message severity="error">{error}</Message>
          ) : products.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try changing your search criteria or filters
              </Typography>
              <Button
                variant="contained"
                onClick={resetFilters}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item key={product._id} xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} lg={viewMode === 'grid' ? 3 : 12}>
                    {viewMode === 'grid' ? (
                      <ProductCard product={product} />
                    ) : (
                      <ProductListItem product={product} />
                    )}
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => dispatch(setFilterDrawerOpen(false))}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 350,
            boxSizing: 'border-box',
          },
        }}
      >
        {filterContent}
      </Drawer>
    </Container>
  );
};

export default ProductListPage;