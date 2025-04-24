import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
  Button,
} from '@mui/material';
import {
  Recommend as RecommendIcon,
  LocalOffer as OfferIcon,
  Eco as EcoIcon,
  CalendarMonth as SeasonIcon,
  LocationOn as LocationIcon,
  Bolt as TrendingIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Message from '../ui/Message';

const SmartRecommendations = () => {
  const theme = useTheme();
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState({
    personalized: [],
    seasonal: [],
    trending: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/ai/recommendations', {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        setRecommendations(data);
        setError(null);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to load recommendations. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userInfo]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getRecommendationsByTab = () => {
    switch (activeTab) {
      case 0:
        return recommendations.personalized;
      case 1:
        return recommendations.seasonal;
      case 2:
        return recommendations.trending;
      default:
        return [];
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          mb: 4,
          background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Smart Recommendations
        </Typography>
        <Typography variant="body1">
          Discover products tailored to your farming needs, seasonal opportunities, and market trends.
          Our AI analyzes your profile, location, and farming patterns to suggest the most relevant products.
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<RecommendIcon />}
            label="Personalized"
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab
            icon={<SeasonIcon />}
            label="Seasonal"
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab
            icon={<TrendingIcon />}
            label="Trending"
            iconPosition="start"
            sx={{ py: 2 }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
              }}
            >
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Generating smart recommendations...
              </Typography>
            </Box>
          ) : error ? (
            <Message severity="error">{error}</Message>
          ) : (
            <>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                {activeTab === 0 && (
                  <>
                    <RecommendIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="medium">
                      Personalized for Your Farm
                    </Typography>
                  </>
                )}
                {activeTab === 1 && (
                  <>
                    <SeasonIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6" fontWeight="medium">
                      Seasonal Recommendations
                    </Typography>
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    <TrendingIcon sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="h6" fontWeight="medium">
                      Trending Products
                    </Typography>
                  </>
                )}
              </Box>

              <Grid container spacing={3}>
                {getRecommendationsByTab().length > 0 ? (
                  getRecommendationsByTab().map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="180"
                          image={product.image}
                          alt={product.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ mb: 1 }}>
                            {product.isOrganic && (
                              <Chip
                                icon={<EcoIcon />}
                                label="Organic"
                                size="small"
                                color="success"
                                sx={{ mr: 1, mb: 1 }}
                              />
                            )}
                            {product.recommendationReason && (
                              <Chip
                                icon={
                                  activeTab === 0 ? (
                                    <RecommendIcon />
                                  ) : activeTab === 1 ? (
                                    <SeasonIcon />
                                  ) : (
                                    <TrendingIcon />
                                  )
                                }
                                label={product.recommendationReason}
                                size="small"
                                color={
                                  activeTab === 0
                                    ? 'primary'
                                    : activeTab === 1
                                    ? 'success'
                                    : 'warning'
                                }
                                sx={{ mb: 1 }}
                              />
                            )}
                          </Box>

                          <Typography variant="h6" component="div" gutterBottom>
                            {product.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {product.description}
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography variant="h6" color="primary.main">
                              ₹{product.price}
                            </Typography>
                            {product.discount > 0 && (
                              <Chip
                                icon={<OfferIcon />}
                                label={`${product.discount}% off`}
                                size="small"
                                color="error"
                              />
                            )}
                          </Box>

                          {product.location && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 1,
                              }}
                            >
                              <LocationIcon
                                fontSize="small"
                                sx={{ color: 'text.secondary', mr: 0.5 }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {product.location}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                          <Button
                            component={Link}
                            to={`/product/${product._id}`}
                            variant="contained"
                            fullWidth
                          >
                            View Details
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        py: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No recommendations available
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        We're still learning about your preferences.
                        <br />
                        Browse more products to get personalized recommendations.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SmartRecommendations;