import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  Security,
  Speed,
  Psychology,
  Agriculture,
  ShoppingCart,
} from '@mui/icons-material';
import { fetchProducts } from '../redux/slices/productSlice';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import ProductCard from '../components/products/ProductCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #1a237e 30%, #4caf50 90%)'
            : 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="slide-up" sx={{ animation: 'slideUp 0.5s ease-out' }}>
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                >
                  AI-Powered Crop Marketplace
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mb: 4, opacity: 0.9 }}
                >
                  Connect directly with farmers, get fair prices, and make data-driven decisions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/products"
                    startIcon={<ShoppingCart />}
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Shop Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/register?role=seller"
                    startIcon={<Agriculture />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Sell Your Crops
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="/images/hero-image.png"
                alt="Farmer with crops"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transform: 'perspective(1000px) rotateY(-10deg)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          Why Choose CropMarket-Mate?
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: <TrendingUp fontSize="large" color="primary" />,
              title: 'AI Price Predictions',
              description: 'Get accurate price predictions based on market trends, seasonal patterns, and demand forecasts.',
            },
            {
              icon: <Security fontSize="large" color="primary" />,
              title: 'Blockchain Verified',
              description: 'Every transaction is secured and verified using blockchain technology for complete transparency.',
            },
            {
              icon: <Speed fontSize="large" color="primary" />,
              title: 'Real-time Analytics',
              description: 'Access real-time market data and analytics to make informed decisions about buying and selling.',
            },
            {
              icon: <Psychology fontSize="large" color="primary" />,
              title: 'Quality Assessment',
              description: 'AI-powered quality assessment helps determine the grade and value of your crops.',
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" fontWeight="bold">
              Featured Products
            </Typography>
            <Button
              variant="outlined"
              component={Link}
              to="/products"
              sx={{ borderRadius: 4 }}
            >
              View All
            </Button>
          </Box>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message severity="error">{error}</Message>
          ) : (
            <Grid container spacing={3}>
              {products.slice(0, 4).map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={3}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          How It Works
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              step: '01',
              title: 'Create an Account',
              description: 'Sign up as a buyer or seller to access all features of the platform.',
              image: '/images/step1.png',
            },
            {
              step: '02',
              title: 'List or Browse Products',
              description: 'Sellers can list their crops while buyers can browse the marketplace.',
              image: '/images/step2.png',
            },
            {
              step: '03',
              title: 'Use AI Insights',
              description: 'Get AI-powered insights on pricing, quality, and market trends.',
              image: '/images/step3.png',
            },
            {
              step: '04',
              title: 'Complete Secure Transactions',
              description: 'Finalize deals with our secure blockchain-based payment system.',
              image: '/images/step4.png',
            },
          ].map((step, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Typography
                  variant="h1"
                  sx={{
                    position: 'absolute',
                    top: -30,
                    left: -10,
                    fontSize: '6rem',
                    fontWeight: 'bold',
                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    zIndex: 0,
                  }}
                >
                  {step.step}
                </Typography>
                <Box
                  component="img"
                  src={step.image}
                  alt={step.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 2,
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                {step.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {step.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 6 }}
          >
            What Our Users Say
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Farmer, Punjab',
                image: '/images/testimonial1.jpg',
                quote: 'CropMarket-Mate has transformed how I sell my wheat. The AI price predictions helped me increase my profits by 30% this season!',
              },
              {
                name: 'Priya Sharma',
                role: 'Wholesale Buyer',
                image: '/images/testimonial2.jpg',
                quote: 'The quality assessment feature ensures I always get the best produce. The direct connection with farmers has cut my costs significantly.',
              },
              {
                name: 'Amit Patel',
                role: 'Rice Farmer, Gujarat',
                image: '/images/testimonial3.jpg',
                quote: 'I was skeptical at first, but the blockchain verification gives me peace of mind for every transaction. Highly recommended!',
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    borderRadius: 4,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" component="h3" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ flex: 1, fontStyle: 'italic' }}>
                    "{testimonial.quote}"
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a237e 0%, #4caf50 100%)'
            : 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Ready to Transform Your Crop Business?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of farmers and buyers already using CropMarket-Mate
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                px: 4,
                py: 1.5,
              }}
            >
              Get Started Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/contact"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                px: 4,
                py: 1.5,
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;