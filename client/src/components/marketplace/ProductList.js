import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Rating,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  LocalOffer as PriceIcon,
  Eco as FreshnessIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { listProducts } from '../../actions/productActions';
import Message from '../ui/Message';
import ProductCard from './ProductCard';
import ProductListItem from './ProductListItem';
import FilterDrawer from './FilterDrawer';

const ProductList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    quality: [],
    priceRange: [0, 10000],
    freshness: 30, // days
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword } = useParams();
  
  const productsPerPage = 12;
  
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, count } = productList;
  
  useEffect(() => {
    dispatch(listProducts(keyword, page, productsPerPage, sortBy, filters));
  }, [dispatch, keyword, page, sortBy, filters]);
  
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    } else {
      navigate('/marketplace');
    }
  };
  
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };
  
  const handleFilterClear = () => {
    setFilters({
      category: '',
      quality: [],
      priceRange: [0, 10000],
      freshness: 30,
    });
    setPage(1);
  };
  
  const totalPages = Math.ceil(count / productsPerPage);
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Crop Marketplace
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search crops..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button type="submit" variant="contained">
                        Search
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterToggle}
            >
              Filters
            </Button>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
                startAdornment={<SortIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="price_low">Price: Low to High</MenuItem>
                <MenuItem value="price_high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
                <MenuItem value="freshness">Freshness</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              fullWidth
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ListViewIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Box>
      
      {/* Active filters display */}
      {(filters.category || filters.quality.length > 0 || filters.priceRange[0] > 0 || 
        filters.priceRange[1] < 10000 || filters.freshness < 30) && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Active Filters:
          </Typography>
          
          {filters.category && (
            <Chip 
              label={`Category: ${filters.category}`} 
              onDelete={() => setFilters({...filters, category: ''})}
              size="small"
            />
          )}
          
          {filters.quality.map((q) => (
            <Chip 
              key={q}
              label={`Quality: ${q}`} 
              onDelete={() => setFilters({
                ...filters, 
                quality: filters.quality.filter(quality => quality !== q)
              })}
              size="small"
            />
          ))}
          
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
            <Chip 
              label={`Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`} 
              onDelete={() => setFilters({...filters, priceRange: [0, 10000]})}
              size="small"
            />
          )}
          
          {filters.freshness < 30 && (
            <Chip 
              label={`Freshness: Last ${filters.freshness} days`} 
              onDelete={() => setFilters({...filters, freshness: 30})}
              size="small"
            />
          )}
          
          <Button 
            size="small" 
            variant="outlined" 
            startIcon={<CloseIcon />}
            onClick={handleFilterClear}
          >
            Clear All
          </Button>
        </Box>
      )}
      
      {error ? (
        <Message severity="error">{error}</Message>
      ) : (
        <>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={30} />
                      <Skeleton variant="text" />
                      <Skeleton variant="text" width="60%" />
                    </CardContent>
                    <CardActions>
                      <Skeleton variant="rectangular" width={100} height={36} />
                      <Skeleton variant="rectangular" width={100} height={36} sx={{ ml: 1 }} />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          ) : viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              {products.map((product) => (
                <ProductListItem key={product._id} product={product} />
              ))}
            </Box>
          )}
          
          {!loading && products.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
      
      <FilterDrawer 
        open={filterOpen} 
        onClose={handleFilterToggle}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleFilterClear}
      />
    </Container>
  );
};

export default ProductList;