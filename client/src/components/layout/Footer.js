import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'light' ? 'primary.main' : 'background.paper',
        color: theme.palette.mode === 'light' ? 'white' : 'text.primary',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              CropMarket-Mate
            </Typography>
            <Typography variant="body2" paragraph>
              AI-Powered Blockchain-Based Crop Marketplace connecting farmers directly with buyers.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Typography variant="body2" component={Link} to="/" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Home
            </Typography>
            <Typography variant="body2" component={Link} to="/products" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Marketplace
            </Typography>
            <Typography variant="body2" component={Link} to="/ai-insights" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              AI Insights
            </Typography>
            <Typography variant="body2" component={Link} to="/register" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Register
            </Typography>
            <Typography variant="body2" component={Link} to="/login" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Login
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              For Farmers
            </Typography>
            <Typography variant="body2" component={Link} to="/register?role=seller" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Become a Seller
            </Typography>
            <Typography variant="body2" component={Link} to="/seller/dashboard" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Seller Dashboard
            </Typography>
            <Typography variant="body2" component={Link} to="/seller/products" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Manage Products
            </Typography>
            <Typography variant="body2" component={Link} to="/ai-insights" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Price Predictions
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Help & Support
            </Typography>
            <Typography variant="body2" component={Link} to="/faq" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              FAQ
            </Typography>
            <Typography variant="body2" component={Link} to="/contact" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Contact Us
            </Typography>
            <Typography variant="body2" component={Link} to="/privacy-policy" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Privacy Policy
            </Typography>
            <Typography variant="body2" component={Link} to="/terms" sx={{ display: 'block', mb: 1, color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Terms of Service
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, borderColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }} />
        <Typography variant="body2" align="center">
          © {year} CropMarket-Mate. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;