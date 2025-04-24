import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Divider, Chip, Avatar, Rating, TextField, IconButton, Tabs, Tab, List, ListItem, ListItemText, ListItemAvatar, Card, CardContent, CircularProgress, ImageList, ImageListItem } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Share, VerifiedUser, LocationOn, LocalShipping, AccessTime, ArrowBack, Send, Add, Remove, CheckCircle, Info, Warning, Error } from '@mui/icons-material';
import { getProductDetails, addReview, addToFavorites, removeFromFavorites } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { product, loading, error } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [mainImage, setMainImage] = useState(0);
  
  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.quantity, quantity + value));
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({
      productId: product._id,
      quantity,
      price: product.price,
      name: product.name,
      image: product.images?.[0],
      seller: product.seller?._id,
      unit: product.unit
    }))
      .unwrap()
      .then(() => {
        toast.success('Added to cart successfully');
      })
      .catch(err => {
        toast.error(err || 'Failed to add to cart');
      });
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };
  
  const handleToggleFavorite = () => {
    if (!user) {
      toast.info('Please login to add to favorites');
      navigate('/login');
      return;
    }
    
    if (product.isFavorite) {
      dispatch(removeFromFavorites(product._id));
    } else {
      dispatch(addToFavorites(product._id));
    }
  };
  
  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} on CropMarket-Mate!`,
        url: window.location.href
      })
        .then(() => console.log('Shared successfully'))
        .catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please login to submit a review');
      navigate('/login');
      return;
    }
    
    if (!reviewComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    dispatch(addReview({
      productId: product._id,
      rating: reviewRating,
      comment: reviewComment
    }))
      .unwrap()
      .then(() => {
        toast.success('Review submitted successfully');
        setReviewComment('');
      })
      .catch(err => {
        toast.error(err || 'Failed to submit review');
      });
  };
  
  if (loading && !product) {
    return <Spinner />;
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error loading product
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/marketplace"
          startIcon={<ArrowBack />}
        >
          Back to Marketplace
        </Button>
      </Container>
    );
  }
  
  if (!product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/marketplace"
          startIcon={<ArrowBack />}
        >
          Back to Marketplace
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
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
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box
              component="img"
              src={product.images?.[mainImage] || '/images/products/default.jpg'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'contain',
                mb: 2
              }}
            />
            
            {product.images?.length > 1 && (
              <ImageList cols={5} rowHeight={80} sx={{ mt: 1 }}>
                {product.images.map((image, index) => (
                  <ImageListItem 
                    key={index}
                    onClick={() => setMainImage(index)}
                    sx={{ 
                      cursor: 'pointer',
                      border: index === mainImage ? '2px solid #1976d2' : 'none',
                      borderRadius: 1
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      loading="lazy"
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Paper>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Box>
                <IconButton onClick={handleToggleFavorite} color={product.isFavorite ? 'error' : 'default'}>
                  {product.isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton onClick={handleShareProduct}>
                  <Share />
                </IconButton>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating || 0} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {product.rating?.toFixed(1) || '0.0'} ({product.numReviews || 0} reviews)
              </Typography>
            </Box>
            
            <Typography variant="h5" color="primary" gutterBottom>
              ₹{product.price}/{product.unit}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={product.inStock ? 'In Stock' : 'Out of Stock'} 
                color={product.inStock ? 'success' : 'error'} 
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2">
                {product.quantity} {product.unit} available
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {product.location}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTime color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Listed on {new Date(product.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocalShipping color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {product.deliveryOptions || 'Pickup and delivery available'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={product.seller?.profileImage || '/images/default-avatar.jpg'}
                alt={product.seller?.name}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Box>
                <Typography variant="subtitle2">
                  {product.seller?.name}
                  {product.seller?.isVerified && (
                    <VerifiedUser fontSize="small" color="primary" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seller
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ ml: 'auto' }}
                component={Link}
                to={`/seller/${product.seller?._id}`}
              >
                View Profile
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Quantity Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Remove />
                </IconButton>
                <TextField
                  value={quantity}
                  inputProps={{ 
                    readOnly: true,
                    style: { textAlign: 'center' }
                  }}
                  sx={{ width: 60, mx: 1 }}
                />
                <IconButton 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantity}
                >
                  <Add />
                </IconButton>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  {product.unit}
                </Typography>
              </Box>
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                fullWidth
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                fullWidth
              >
                Buy Now
              </Button>
            </Box>
            
            {/* Product Quality Indicators */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Product Quality
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <CheckCircle color="success" />
                    <Typography variant="body2">
                      Quality Checked
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Info color="primary" />
                    <Typography variant="body2">
                      {product.farmingType || 'Organic'}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Warning color="warning" />
                    <Typography variant="body2">
                      Seasonal
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        {/* Product Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Details" />
              <Tab label="Reviews" />
              <Tab label="Shipping" />
              <Tab label="Seller Info" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Product Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Specifications
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Category" 
                            secondary={product.category} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Variety" 
                            secondary={product.variety || 'Standard'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Harvest Date" 
                            secondary={product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'Recent'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Shelf Life" 
                            secondary={product.shelfLife || 'Varies based on storage'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Storage Instructions" 
                            secondary={product.storageInstructions || 'Store in a cool, dry place'} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Additional Information
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {product.additionalInfo || 'This product is grown using sustainable farming practices. Our farmers take pride in delivering high-quality produce that is fresh and nutritious.'}
                      </Typography>
                      
                      <Typography variant="subtitle1" gutterBottom>
                        Certifications
                      </Typography>
                      {product.certifications?.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {product.certifications.map((cert, index) => (
                            <Chip 
                              key={index}
                              label={cert} 
                              color="primary" 
                              variant="outlined" 
                              size="small" 
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2">
                          No certifications specified
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Customer Reviews
                  </Typography>
                  
                  {/* Review Form */}
                  <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Write a Review
                    </Typography>
                    <form onSubmit={handleSubmitReview}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Your Rating
                        </Typography>
                        <Rating
                          name="review-rating"
                          value={reviewRating}
                          onChange={(event, newValue) => {
                            setReviewRating(newValue);
                          }}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        label="Your Review"
                        multiline
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        sx={{ mb: 2 }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        endIcon={<Send />}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Submit Review'}
                      </Button>
                    </form>
                  </Paper>
                  
                  {/* Reviews List */}
                  {product.reviews?.length > 0 ? (
                    <List>
                      {product.reviews.map((review, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar 
                                src={review.user?.profileImage || '/images/default-avatar.jpg'}
                                alt={review.user?.name}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle2">
                                    {review.user?.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <React.Fragment>
                                  <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.5, mb: 0.5 }} />
                                  <Typography variant="body2" color="text.primary">
                                    {review.comment}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          {index < product.reviews.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      No reviews yet. Be the first to review this product!
                    </Typography>
                  )}
                </Box>
              )}
              
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Shipping & Delivery
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Delivery Options
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Local Pickup" 
                            secondary="Available at seller's location" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Standard Delivery" 
                            secondary="2-3 business days" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Express Delivery" 
                            secondary="Next day delivery (additional charges apply)" 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Shipping Policy
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Shipping costs are calculated based on weight and delivery location. For bulk orders, special shipping arrangements can be made directly with the seller.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        All products are carefully packed to ensure they arrive in optimal condition. Perishable items are shipped with appropriate packaging to maintain freshness.
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    About the Seller
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              src={product.seller?.profileImage || '/images/default-avatar.jpg'}
                              alt={product.seller?.name}
                              sx={{ width: 64, height: 64, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="h6">
                                {product.seller?.name}
                                {product.seller?.isVerified && (
                                  <VerifiedUser fontSize="small" color="primary" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Member since {new Date(product.seller?.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="body2" paragraph>
                            {product.seller?.bio || 'This seller is committed to providing high-quality agricultural products directly from their farm to your table.'}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {product.seller?.location || product.location}
                            </Typography>
                          </Box>
                          
                          <Button 
                            variant="outlined" 
                            fullWidth
                            component={Link}
                            to={`/seller/${product.seller?._id}`}
                            sx={{ mt: 2 }}
                          >
                            View Full Profile
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={8}>
                      <Typography variant="subtitle1" gutterBottom>
                        Other Products from this Seller
                      </Typography>
                      
                      {product.sellerProducts?.length > 0 ? (
                        <Grid container spacing={2}>
                          {product.sellerProducts.slice(0, 4).map((prod, index) => (
                            <Grid item xs={6} sm={3} key={index}>
                              <Card>
                                <CardContent sx={{ p: 1 }}>
                                  <Box
                                    component="img"
                                    src={prod.images?.[0] || '/images/products/default.jpg'}
                                    alt={prod.name}
                                    sx={{
                                      width: '100%',
                                      height: 100,
                                      objectFit: 'cover',
                                      mb: 1
                                    }}
                                  />
                                  <Typography variant="body2" noWrap>
                                    {prod.name}
                                  </Typography>
                                  <Typography variant="subtitle2" color="primary">
                                    ₹{prod.price}/{prod.unit}
                                  </Typography>
                                  <Button 
                                    size="small" 
                                    fullWidth
                                    component={Link}
                                    to={`/products/${prod._id}`}
                                    sx={{ mt: 1 }}
                                  >
                                    View
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                          No other products from this seller
                        </Typography>
                      )}
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                        Seller Ratings & Reviews
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ mr: 2 }}>
                          {product.seller?.rating?.toFixed(1) || '0.0'}
                        </Typography>
                        <Box>
                          <Rating value={product.seller?.rating || 0} precision={0.5} readOnly />
                          <Typography variant="body2" color="text.secondary">
                            Based on {product.seller?.numReviews || 0} reviews
                          </Typography>
                        </Box>
                      </Box>
                      
                      {product.seller?.reviews?.length > 0 ? (
                        <List>
                          {product.seller?.reviews.slice(0, 2).map((review, index) => (
                            <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar 
                                  src={review.user?.profileImage || '/images/default-avatar.jpg'}
                                  alt={review.user?.name}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2">
                                      {review.user?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <React.Fragment>
                                    <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.5, mb: 0.5 }} />
                                    <Typography variant="body2" color="text.primary">
                                      {review.comment}
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No seller reviews yet
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Product Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Details" />
              <Tab label="Reviews" />
              <Tab label="Shipping" />
              <Tab label="Seller Info" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Product Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Specifications
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Category" 
                            secondary={product.category} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Variety" 
                            secondary={product.variety || 'Standard'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Harvest Date" 
                            secondary={product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'Recent'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Shelf Life" 
                            secondary={product.shelfLife || 'Varies based on storage'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Storage Instructions" 
                            secondary={product.storageInstructions || 'Store in a cool, dry place'} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Additional Information
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {product.additionalInfo || 'This product is grown using sustainable farming practices. Our farmers take pride in delivering high-quality produce that is fresh and nutritious.'}
                      </Typography>
                      
                      <Typography variant="subtitle1" gutterBottom>
                        Certifications
                      </Typography>
                      {product.certifications?.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {product.certifications.map((cert, index) => (
                            <Chip 
                              key={index}
                              label={cert} 
                              color="primary" 
                              variant="outlined" 
                              size="small" 
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2">
                          No certifications specified
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Customer Reviews
                  </Typography>
                  
                  {/* Review Form */}
                  <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Write a Review
                    </Typography>
                    <form onSubmit={handleSubmitReview}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Your Rating
                        </Typography>
                        <Rating
                          name="review-rating"
                          value={reviewRating}
                          onChange={(event, newValue) => {
                            setReviewRating(newValue);
                          }}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        label="Your Review"
                        multiline
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        sx={{ mb: 2 }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        endIcon={<Send />}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Submit Review'}
                      </Button>
                    </form>
                  </Paper>
                  
                  {/* Reviews List */}
                  {product.reviews?.length > 0 ? (
                    <List>
                      {product.reviews.map((review, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar 
                                src={review.user?.profileImage || '/images/default-avatar.jpg'}
                                alt={review.user?.name}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle2">
                                    {review.user?.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <React.Fragment>
                                  <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.5, mb: 0.5 }} />
                                  <Typography variant="body2" color="text.primary">
                                    {review.comment}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          {index < product.reviews.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      No reviews yet. Be the first to review this product!
                    </Typography>
                  )}
                </Box>
              )}
              
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Shipping & Delivery
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Delivery Options
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Local Pickup" 
                            secondary="Available at seller's location" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Standard Delivery" 
                            secondary="2-3 business days" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Express Delivery" 
                            secondary="Next day delivery (additional charges apply)" 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Shipping Policy
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Shipping costs are calculated based on weight and delivery location. For bulk orders, special shipping arrangements can be made directly with the seller.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        All products are carefully packed to ensure they arrive in optimal condition. Perishable items are shipped with appropriate packaging to maintain freshness.
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    About the Seller
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              src={product.seller?.profileImage || '/images/default-avatar.jpg'}
                              alt={product.seller?.name}
                              sx={{ width: 64, height: 64, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="h6">
                                {product.seller?.name}
                                {product.seller?.isVerified && (
                                  <VerifiedUser fontSize="small" color="primary" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Member since {new Date(product.seller?.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="body2" paragraph>
                            {product.seller?.bio || 'This seller is committed to providing high-quality agricultural products directly from their farm to your table.'}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {product.seller?.location || product.location}
                            </Typography>
                          </Box>
                          
                          <Button 
                            variant="outlined" 
                            fullWidth
                            component={Link}
                            to={`/seller/${product.seller?._id}`}
                            sx={{ mt: 2 }}
                          >
                            View Full Profile
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={8}>
                      <Typography variant="subtitle1" gutterBottom>
                        Other Products from this Seller
                      </Typography>
                      
                      {product.sellerProducts?.length > 0 ? (
                        <Grid container spacing={2}>
                          {product.sellerProducts.slice(0, 4).map((prod, index) => (
                            <Grid item xs={6} sm={3} key={index}>
                              <Card>
                                <CardContent sx={{ p: 1 }}>
                                  <Box
                                    component="img"
                                    src={prod.images?.[0] || '/images/products/default.jpg'}
                                    alt={prod.name}
                                    sx={{
                                      width: '100%',
                                      height: 100,
                                      objectFit: 'cover',
                                      mb: 1
                                    }}
                                  />
                                  <Typography variant="body2" noWrap>
                                    {prod.name}
                                  </Typography>
                                  <Typography variant="subtitle2" color="primary">
                                    ₹{prod.price}/{prod.unit}
                                  </Typography>
                                  <Button 
                                    size="small" 
                                    fullWidth
                                    component={Link}
                                    to={`/products/${prod._id}`}
                                    sx={{ mt: 1 }}
                                  >
                                    View
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                          No other products from this seller
                        </Typography>
                      )}
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                        Seller Ratings & Reviews
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ mr: 2 }}>
                          {product.seller?.rating?.toFixed(1) || '0.0'}
                        </Typography>
                        <Box>
                          <Rating value={product.seller?.rating || 0} precision={0.5} readOnly />
                          <Typography variant="body2" color="text.secondary">
                            Based on {product.seller?.numReviews || 0} reviews
                          </Typography>
                        </Box>
                      </Box>
                      
                      {product.seller?.reviews?.length > 0 ? (
                        <List>
                          {product.seller?.reviews.slice(0, 2).map((review, index) => (
                            <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar 
                                  src={review.user?.profileImage || '/images/default-avatar.jpg'}
                                  alt={review.user?.name}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2">
                                      {review.user?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <React.Fragment>
                                    <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.5, mb: 0.5 }} />
                                    <Typography variant="body2" color="text.primary">
                                      {review.comment}
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No seller reviews yet
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Related Products */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Related Products
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {product.relatedProducts?.length > 0 ? (
              <Grid container spacing={3}>
                {product.relatedProducts.map((relatedProduct, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={relatedProduct.images?.[0] || '/images/products/default.jpg'}
                        alt={relatedProduct.name}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" noWrap>
                          {relatedProduct.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {relatedProduct.category}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={relatedProduct.rating || 0} precision={0.5} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({relatedProduct.numReviews || 0})
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary">
                          ₹{relatedProduct.price}/{relatedProduct.unit}
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          component={Link}
                          to={`/products/${relatedProduct._id}`}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No related products found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;