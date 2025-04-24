import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Box, Paper, Divider } from '@mui/material';
import { Agriculture, ShoppingCart, Analytics, Security, Speed, Devices } from '@mui/icons-material';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url('/images/hero-bg.jpg')`,
          height: '70vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography component="h1" variant="h2" color="inherit" gutterBottom>
            CropMarket-Mate
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            AI-Powered Blockchain-Based Crop Marketplace
          </Typography>
          <Typography variant="subtitle1" color="inherit" paragraph>
            Connect directly with farmers, get AI-powered insights, and secure transactions with blockchain technology.
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/marketplace" size="large">
            Explore Marketplace
          </Button>
          <Button variant="outlined" color="inherit" component={Link} to="/register" size="large" sx={{ ml: 2 }}>
            Join Now
          </Button>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Discover how CropMarket-Mate revolutionizes agricultural commerce
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Agriculture fontSize="large" color="primary" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Direct Farmer-Buyer Connection
                </Typography>
                <Typography align="center">
                  Eliminate middlemen and connect directly with farmers for fresher produce and better prices.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Analytics fontSize="large" color="primary" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  AI-Powered Insights
                </Typography>
                <Typography align="center">
                  Get crop quality grading, price predictions, and market trend analysis powered by advanced AI.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Security fontSize="large" color="primary" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Blockchain Security
                </Typography>
                <Typography align="center">
                  Secure transactions and agreements with blockchain technology for transparency and trust.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <ShoppingCart fontSize="large" color="primary" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Seamless Marketplace
                </Typography>
                <Typography align="center">
                  Browse, filter, and purchase crops with an intuitive Swiggy-style interface.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Speed fontSize="large" color="primary" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Real-time Updates
                </Typography>
                <Typography align="center">
                  Get alerts for price changes, market trends, and best times to buy or sell.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Devices fontSize="large" color="primary" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Fully Responsive
                </Typography>
                <Typography align="center">
                  Access the platform from any device with a fully responsive design.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            Simple steps to get started with CropMarket-Mate
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" color="primary" sx={{ mb: 2 }}>1</Typography>
                <Typography variant="h5" gutterBottom>Register & Create Profile</Typography>
                <Typography>
                  Sign up as a farmer or buyer and complete your profile with relevant details.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" color="primary" sx={{ mb: 2 }}>2</Typography>
                <Typography variant="h5" gutterBottom>List or Browse Products</Typography>
                <Typography>
                  Farmers can list their crops while buyers can browse and filter available products.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" color="primary" sx={{ mb: 2 }}>3</Typography>
                <Typography variant="h5" gutterBottom>Transact Securely</Typography>
                <Typography>
                  Complete transactions with secure payment methods and blockchain-backed agreements.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button variant="contained" color="primary" component={Link} to="/register" size="large">
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Success Stories
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Hear from our satisfied users
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  "CropMarket-Mate has transformed how I sell my produce. The AI predictions helped me increase my profits by 30% in just three months!"
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="primary">
                  Rajesh Kumar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Wheat Farmer, Punjab
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  "As a restaurant owner, I can now source the freshest ingredients directly from farmers. The quality grading system is incredibly accurate."
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="primary">
                  Priya Sharma
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Restaurant Owner, Mumbai
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  "The blockchain contracts give me peace of mind. No more payment disputes or quality issues. This platform is revolutionary!"
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="primary">
                  Arun Patel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fruit Exporter, Gujarat
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Ready to revolutionize your agricultural business?
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Join thousands of farmers and buyers already benefiting from CropMarket-Mate.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/register"
            sx={{ mt: 2 }}
          >
            Sign Up Now
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Home;