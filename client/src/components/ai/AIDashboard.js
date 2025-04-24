import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  SmartToy as AIIcon,
  BugReport as DiseaseIcon,
  Spa as SoilIcon,
  Recommend as RecommendIcon,
  TrendingUp as PriceIcon,
  WbSunny as WeatherIcon,
  CalendarMonth as CalendarIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

const FeatureCard = ({ title, description, icon, to, color }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={to}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            width: '100%',
            p: 2,
            bgcolor: color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
          <Typography variant="h6" fontWeight="medium" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <CardContent sx={{ flexGrow: 1, width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const AIDashboard = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'Disease Detection',
      description: 'Upload images of your crops to identify diseases and get treatment recommendations.',
      icon: <DiseaseIcon />,
      to: '/ai/disease-detection',
      color: theme.palette.error.main,
    },
    {
      title: 'Soil Analysis',
      description: 'Analyze soil images to determine soil type, nutrient content, and suitable crops.',
      icon: <SoilIcon />,
      to: '/ai/soil-analysis',
      color: theme.palette.success.main,
    },
    {
      title: 'Smart Recommendations',
      description: 'Get personalized product recommendations based on your farming profile and needs.',
      icon: <RecommendIcon />,
      to: '/ai/recommendations',
      color: theme.palette.primary.main,
    },
    {
      title: 'Price Prediction',
      description: 'Forecast market prices for your crops to make informed selling decisions.',
      icon: <PriceIcon />,
      to: '/ai/price-prediction',
      color: theme.palette.info.main,
    },
    {
      title: 'Weather Recommendations',
      description: 'Receive farming advice based on current and forecasted weather conditions.',
      icon: <WeatherIcon />,
      to: '/ai/weather',
      color: theme.palette.warning.main,
    },
    {
      title: 'Planting Calendar',
      description: 'Get a personalized planting schedule based on your location and selected crops.',
      icon: <CalendarIcon />,
      to: '/ai/planting-calendar',
      color: theme.palette.success.dark,
    },
    {
      title: 'AI Assistant',
      description: 'Chat with our AI assistant for instant answers to your farming questions.',
      icon: <ChatIcon />,
      to: '/ai/chatbot',
      color: theme.palette.secondary.main,
    },
  ];

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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AIIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            CropMate AI Hub
          </Typography>
        </Box>
        <Typography variant="body1">
          Leverage the power of artificial intelligence to optimize your farming operations.
          Our suite of AI tools helps you make data-driven decisions, identify problems early,
          and maximize your productivity and profits.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          mt: 4,
          bgcolor: 'background.default',
          border: `1px dashed ${theme.palette.primary.main}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <AIIcon sx={{ color: 'primary.main', mt: 0.5, mr: 2 }} />
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              How CropMate AI Works
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Our AI models are trained on vast datasets of agricultural information, including crop diseases,
              soil types, weather patterns, and market trends. By analyzing your specific data and images,
              our AI provides personalized insights and recommendations tailored to your farming needs.
            </Typography>
            <Button
              variant="outlined"
              component={Link}
              to="/about"
              sx={{ mt: 1 }}
            >
              Learn More About Our Technology
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AIDashboard;