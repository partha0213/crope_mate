import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { fetchRelatedProducts } from '../../redux/slices/productSlice';
import ProductCard from './ProductCard';
import Loader from '../ui/Loader';
import Message from '../ui/Message';

const RelatedProducts = ({ category, currentProductId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { relatedProducts, loading, error } = useSelector((state) => state.products);
  
  useEffect(() => {
    if (category) {
      dispatch(fetchRelatedProducts({ category, productId: currentProductId }));
    }
  }, [dispatch, category, currentProductId]);
  
  if (loading) return <Loader />;
  if (error) return <Message severity="error">{error}</Message>;
  if (!relatedProducts || relatedProducts.length === 0) return null;
  
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {relatedProducts.slice(0, isMobile ? 2 : 4).map((product) => (
          <Grid item key={product._id} xs={6} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;