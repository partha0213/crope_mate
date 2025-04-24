import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProductById, clearProduct } from '../../redux/slices/productSlice';
import { createTransaction } from '../../redux/slices/transactionSlice';
import { toast } from 'react-toastify';
import { Container, Grid, Typography, Box, Button, Divider, Paper, Chip, Avatar, Rating, TextField, Card, CardContent, IconButton, Tabs, Tab, Breadcrumbs, Stepper, Step, StepLabel } from '@mui/material';
import { LocationOn, Person, ShoppingCart, Favorite, FavoriteBorder, ArrowBack, Share, VerifiedUser, LocalShipping, Payment, Receipt, TrendingUp, TrendingDown, Info } from '@mui/icons-material';
import Spinner from '../../components/layout/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { product, loading } = useSelector(state => state.product);
  const { user } = useSelector(state => state.auth);
  const { connected } = useSelector(state => state.blockchain);
  
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    dispatch(getProductById(id));
    
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleBuyNow = () => {
    if (!user) {
      toast.info('Please login to purchase this product');
      navigate('/login');
      return;
    }
    
    const transactionData = {
      product: product._id,
      seller: product.farmer._id,
      buyer: user._id,
      quantity,
      totalAmount: product.price * quantity,
      paymentMethod: 'online',
      shippingAddress: {
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'India'
      }
    };
    
    dispatch(createTransaction(transactionData))
      .unwrap()
      .then((result) => {
        toast.success('Order placed successfully!');
        navigate(`/transactions/${result._id}`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to place order');
      });
  };
  
  if (loading || !product) {
    return <Spinner />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Link to="/marketplace" style={{ textDecoration: 'none', color: 'inherit' }}>
          Marketplace
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Button 
        component={Link} 
        to="/marketplace" 
        startIcon={<ArrowBack />} 
        sx={{ mb: 3 }}
      >
        Back to Marketplace
      </Button>
      
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Swiper
              spaceBetween={10}
              navigation={true}
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[Navigation, Pagination, Thumbs]}
              style={{ borderRadius: '8px', height: '400px' }}
            >
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={image} 
                      alt={`${product.name} - ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img 
                    src="/images/product-placeholder.jpg" 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </SwiperSlide>
              )}
            </Swiper>
          </Paper>
          
          {product.images && product.images.length > 1 && (
            <Box sx={{ mt: 2 }}>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Thumbs]}
                style={{ height: '80px' }}
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index} style={{ cursor: 'pointer' }}>
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          )}
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <IconButton color="primary">
                <FavoriteBorder />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating || 0} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.numReviews || 0} reviews)
              </Typography>
            </Box>
            
            <Typography variant="h5" color="primary" gutterBottom>
              ₹{product.price} / {product.unit}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {product.isOrganic && (
                <Chip 
                  label="Organic" 
                  color="success" 
                  size="small" 
                  icon={<VerifiedUser fontSize="small" />} 
                />
              )}
              <Chip 
                label={product.category} 
                variant="outlined" 
                size="small" 
              />
              {product.subCategory && (
                <Chip 
                  label={product.subCategory} 
                  variant="outlined" 
                  size="small" 
                />
              )}
              {product.aiPredictions?.marketTrend === 'rising' ? (
                <Chip 
                  icon={<TrendingUp fontSize="small" />} 
                  label="Rising Demand" 
                  size="small" 
                  color="primary" 
                />
              ) : product.aiPredictions?.marketTrend === 'falling' ? (
                <Chip 
                  icon={<TrendingDown fontSize="small" />} 
                  label="Falling Demand" 
                  size="small" 
                  color="error" 
                />
              ) : null}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Availability:
              </Typography>
              <Typography variant="body1" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                {product.stock > 0 ? `In Stock (${product.stock} ${product.unit} available)` : 'Out of Stock'}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Harvest Date:
              </Typography>
              <Typography variant="body1">
                {new Date(product.harvestDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {product.location?.city}, {product.location?.state}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Sold by: {product.farmer?.name || 'Unknown Farmer'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {product.stock > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity:
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.stock }}
                  sx={{ width: '100px' }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Total: ₹{(product.price * quantity).toFixed(2)}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCart />}
                fullWidth
                disabled={product.stock <= 0}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Share />}
              >
                Share
              </Button>
            </Box>
            
            {!connected && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  Connect your wallet to enable secure blockchain transactions
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Product Information Tabs */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ mt: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Description" />
              <Tab label="Specifications" />
              <Tab label="Farmer Info" />
              <Tab label="Reviews" />
              <Tab label="AI Insights" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Typography variant="body1">
                  {product.description}
                </Typography>
              )}
              
              {tabValue === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Category:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {product.category}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Sub-Category:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {product.subCategory || 'Not specified'}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Organic:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {product.isOrganic ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Cultivation Method:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {product.cultivationMethod || 'Not specified'}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Certifications:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {product.certifications?.join(', ') || 'None'}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Shelf Life:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {product.shelfLife || 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              
              {tabValue === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      src={product.farmer?.profileImage} 
                      alt={product.farmer?.name}
                      sx={{ width: 64, height: 64, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">
                        {product.farmer?.name || 'Unknown Farmer'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Member since {new Date(product.farmer?.createdAt || Date.now()).getFullYear()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" paragraph>
                    {product.farmer?.bio || 'No farmer information available.'}
                  </Typography>
                  
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to={`/farmers/${product.farmer?._id}`}
                  >
                    View Farmer Profile
                  </Button>
                </Box>
              )}
              
              {tabValue === 3 && (
                <Box>
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar 
                              src={review.user?.profileImage} 
                              alt={review.user?.name}
                              sx={{ mr: 2 }}
                            />
                            <Box>
                              <Typography variant="subtitle1">
                                {review.user?.name || 'Anonymous User'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {review.comment}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body1">
                      No reviews yet. Be the first to review this product!
                    </Typography>
                  )}
                </Box>
              )}
              
              {tabValue === 4 && (
                <Box>
                  {product.aiPredictions ? (
                    <>
                      <Typography variant="h6" gutterBottom>
                        AI-Powered Market Insights
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom>
                                Quality Assessment
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Rating 
                                  value={product.aiPredictions.qualityScore / 2} 
                                  precision={0.5} 
                                  readOnly 
                                />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  ({product.aiPredictions.qualityScore}/10)
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {product.aiPredictions.qualityAssessment || 'No quality assessment available'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom>
                                Price Prediction
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {product.aiPredictions.marketTrend === 'rising' ? (
                                  <TrendingUp color="success" sx={{ mr: 1 }} />
                                ) : product.aiPredictions.marketTrend === 'falling' ? (
                                  <TrendingDown color="error" sx={{ mr: 1 }} />
                                ) : (
                                  <Info color="info" sx={{ mr: 1 }} />
                                )}
                                <Typography variant="body1">
                                  {product.aiPredictions.pricePrediction || 'No price prediction available'}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Card sx={{ bgcolor: 'background.paper' }}>
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom>
                                Market Analysis
                              </Typography>
                              <Typography variant="body2">
                                {product.aiPredictions.marketAnalysis || 'No market analysis available'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <Typography variant="body1">
                      No AI insights available for this product.
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Purchase Process */}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          How Purchasing Works
        </Typography>
        <Stepper alternativeLabel sx={{ mt: 3 }}>
          <Step active>
            <StepLabel>Select Quantity</StepLabel>
          </Step>
          <Step active>
            <StepLabel>Secure Payment</StepLabel>
          </Step>
          <Step active>
            <StepLabel>Blockchain Contract</StepLabel>
          </Step>
          <Step active>
            <StepLabel>Delivery</StepLabel>
          </Step>
        </Stepper>
      </Paper>
      
      {/* Related Products */}
      {/* This would be implemented with a separate API call for related products */}
    </Container>
  );
};

export default ProductDetails;