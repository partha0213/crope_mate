import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Rating,
  TextField,
  Divider,
  Chip,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Assignment as CertificateIcon,
  Star as StarIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { fetchProductDetails, createReview } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';
import ProductImageGallery from '../../components/products/ProductImageGallery';
import RelatedProducts from '../../components/products/RelatedProducts';
import BlockchainVerification from '../../components/products/BlockchainVerification';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showVerification, setShowVerification] = useState(false);

  const { product, loading, error, reviewSuccess } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (reviewSuccess) {
      setRating(0);
      setComment('');
    }
  }, [reviewSuccess]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.countInStock, quantity + value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product._id, quantity }));
    navigate('/cart');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(createReview({
      productId: id,
      rating,
      comment,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) return <Loader />;
  if (error) return <Message severity="error">{error}</Message>;
  if (!product) return <Message severity="info">Product not found</Message>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: theme.palette.text.secondary }}>
          Home
        </Link>
        <Link to="/products" style={{ textDecoration: 'none', color: theme.palette.text.secondary }}>
          Products
        </Link>
        <Link 
          to={`/products?category=${product.category}`} 
          style={{ textDecoration: 'none', color: theme.palette.text.secondary }}
        >
          {product.category}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <ProductImageGallery images={product.images || ['/images/placeholder.jpg']} />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip 
                label={product.category} 
                size="small" 
                sx={{ 
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: 'text.secondary',
                }} 
              />
              {product.qualityGrade && (
                <Chip 
                  label={`Grade ${product.qualityGrade}`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: 'text.secondary',
                  }} 
                />
              )}
              {product.isVerified && (
                <Chip
                  icon={<VerifiedIcon fontSize="small" />}
                  label="Blockchain Verified"
                  color="primary"
                  size="small"
                  onClick={() => setShowVerification(true)}
                />
              )}
            </Box>

            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {product.rating.toFixed(1)} ({product.numReviews} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
              <Typography variant="h4" component="span" fontWeight="bold" color="primary.main">
                ₹{product.price.toFixed(2)}
              </Typography>
              <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                per {product.unit}
              </Typography>
              {product.discount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="span" 
                    sx={{ 
                      textDecoration: 'line-through', 
                      color: 'text.secondary',
                      mr: 1,
                    }}
                  >
                    ₹{(product.price / (1 - product.discount / 100)).toFixed(2)}
                  </Typography>
                  <Chip
                    label={`${product.discount}% OFF`}
                    color="error"
                    size="small"
                  />
                </Box>
              )}
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Availability
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Seller
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {product.seller?.name || 'Unknown'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Harvest Date
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(product.harvestDate).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {product.countInStock > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Quantity:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      size="small"
                      sx={{ border: `1px solid ${theme.palette.divider}` }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0 && value <= product.countInStock) {
                          setQuantity(value);
                        }
                      }}
                      inputProps={{ min: 1, max: product.countInStock }}
                      sx={{ width: 60, mx: 1, '& input': { textAlign: 'center' } }}
                    />
                    <IconButton 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.countInStock}
                      size="small"
                      sx={{ border: `1px solid ${theme.palette.divider}` }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CartIcon />}
                    onClick={handleAddToCart}
                    disabled={product.countInStock === 0}
                    sx={{ flex: 1 }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton 
                    color="primary" 
                    sx={{ 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                    }}
                  >
                    <FavoriteBorderIcon />
                  </IconButton>
                  <IconButton 
                    color="primary" 
                    sx={{ 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ShippingIcon color="primary" />
                <Typography variant="body2">
                  Free delivery for orders above ₹1000
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SecurityIcon color="primary" />
                <Typography variant="body2">
                  Secure payment with blockchain verification
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CertificateIcon color="primary" />
                <Typography variant="body2">
                  Quality certified by our AI assessment system
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Product Tabs */}
      <Paper sx={{ mt: 6, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Details & Specifications" />
          <Tab label="Reviews" />
          <Tab label="Shipping & Returns" />
          {product.isVerified && <Tab label="Blockchain Verification" />}
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Category" 
                        secondary={product.category} 
                        primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Quality Grade" 
                        secondary={product.qualityGrade || 'N/A'} 
                        primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Harvest Date" 
                        secondary={new Date(product.harvestDate).toLocaleDateString()} 
                        primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Cultivation Method" 
                        secondary={product.cultivationMethod || 'Traditional'} 
                        primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Origin" 
                        secondary={product.origin || 'India'} 
                        primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Storage Instructions" 
                        secondary={product.storageInstructions || 'Store in a cool, dry place'} 
                        primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              
              {product.nutritionalInfo && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Nutritional Information
                  </Typography>
                  <Typography variant="body1">
                    {product.nutritionalInfo}
                  </Typography>
                </>
              )}
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>
              
              {product.reviews && product.reviews.length > 0 ? (
                <List>
                  {product.reviews.map((review) => (
                    <ListItem key={review._id} alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar alt={review.name}>
                          {review.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {review.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              {review.comment}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" sx={{ my: 2 }}>
                  No reviews yet. Be the first to review this product!
                </Typography>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              {user ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Write a Review
                  </Typography>
                  <form onSubmit={handleReviewSubmit}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Your Rating:
                      </Typography>
                      <Rating
                        value={rating}
                        onChange={(event, newValue) => {
                          setRating(newValue);
                        }}
                        precision={0.5}
                      />
                    </Box>
                    <TextField
                      label="Your Review"
                      multiline
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!rating}
                    >
                      Submit Review
                    </Button>
                  </form>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Please sign in to write a review
                  </Typography>
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/login?redirect=/products/${id}`}
                    sx={{ mt: 1 }}
                  >
                    Sign In
                  </Button>
                </Box>
              )}
            </Box>
          )}
          
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Shipping Information
              </Typography>
              <Typography variant="body1" paragraph>
                We offer fast and reliable shipping across India. Orders are typically processed within 24 hours and delivered within 2-5 business days, depending on your location.
              </Typography>
              <Typography variant="body1" paragraph>
                Free shipping is available for orders above ₹1000. For orders below this amount, a shipping fee of ₹100 will be applied.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Return Policy
              </Typography>
              <Typography variant="body1" paragraph>
                We stand behind the quality of our products. If you're not satisfied with your purchase, you can return it within 24 hours of delivery for a full refund or replacement.
              </Typography>
              <Typography variant="body1" paragraph>
                To initiate a return, please contact our customer service team with your order details and reason for return.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Quality Guarantee
              </Typography>
              <Typography variant="body1" paragraph>
                All products on CropMarket-Mate undergo rigorous quality checks. Our AI-powered quality assessment system ensures that you receive only the best produce.
              </Typography>
            </Box>
          )}
          
          {activeTab === 3 && product.isVerified && (
            <BlockchainVerification product={product} />
          )}
        </Box>
      </Paper>

      {/* Related Products */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Related Products
        </Typography>
        <RelatedProducts category={product.category} currentProductId={product._id} />
      </Box>
    </Container>
  );
};

export default ProductDetailPage;