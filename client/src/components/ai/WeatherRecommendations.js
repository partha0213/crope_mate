import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  WbSunny as SunnyIcon,
  Opacity as RainIcon,
  Air as WindIcon,
  Thermostat as TemperatureIcon,
  Warning as WarningIcon,
  Agriculture as FarmingIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Message from '../ui/Message';

const WeatherRecommendations = () => {
  const theme = useTheme();
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // If we have user's coordinates, get location name and weather data
    if (userLocation) {
      const fetchLocationName = async () => {
        try {
          const { data } = await axios.get(
            `/api/geocode?lat=${userLocation.lat}&lng=${userLocation.lng}`
          );
          setLocation(data.location);
          fetchWeatherData(data.location);
        } catch (err) {
          console.error('Error fetching location name:', err);
        }
      };

      fetchLocationName();
    }
  }, [userLocation]);

  const fetchWeatherData = async (locationQuery) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`/api/ai/weather?location=${locationQuery}`);
      setWeatherData(data.weather);
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error fetching weather data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }
    fetchWeatherData(location);
  };

  const getWeatherIcon = (condition) => {
      condition = condition.toLowerCase();
      if (condition.includes('rain') || condition.includes('shower')) {
        return <RainIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />;
      } else if (condition.includes('cloud')) {
        return <RainIcon sx={{ fontSize: 40, color: theme.palette.grey[500] }} />;
      } else {
        return <SunnyIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />;
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
            background: `linear-gradient(45deg, ${theme.palette.info.light}, ${theme.palette.info.dark})`,
            color: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Weather-Based Farming Recommendations
          </Typography>
          <Typography variant="body1">
            Get personalized farming advice based on current and forecasted weather conditions.
            Our AI analyzes weather patterns to help you make informed decisions about planting, irrigation, and crop protection.
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Enter Location"
                  value={location}
                  onChange={handleLocationChange}
                  placeholder="City, State or Pincode"
                  InputProps={{
                    startAdornment: (
                      <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Get Recommendations'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {error && <Message severity="error" sx={{ mb: 4 }}>{error}</Message>}

        {weatherData && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Current Weather
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  {getWeatherIcon(weatherData.current.condition)}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h4" fontWeight="medium">
                      {weatherData.current.temp_c}°C
                    </Typography>
                    <Typography variant="body1">
                      {weatherData.current.condition}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ bgcolor: 'background.default' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <RainIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                          <Typography variant="body2" color="text.secondary">
                            Humidity
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          {weatherData.current.humidity}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card sx={{ bgcolor: 'background.default' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WindIcon sx={{ mr: 1, color: theme.palette.grey[500] }} />
                          <Typography variant="body2" color="text.secondary">
                            Wind
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          {weatherData.current.wind_kph} km/h
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }} fontWeight="medium">
                  3-Day Forecast
                </Typography>

                {weatherData.forecast.map((day, index) => (
                  <Card key={index} sx={{ mb: 2, bgcolor: 'background.default' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            {day.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {day.condition}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getWeatherIcon(day.condition)}
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            {day.min_temp_c}° - {day.max_temp_c}°
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Farming Recommendations
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {recommendations && (
                  <>
                    {recommendations.alerts.length > 0 && (
                      <Card sx={{ mb: 3, bgcolor: 'error.light' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <WarningIcon sx={{ mr: 1, color: 'error.main' }} />
                            <Typography variant="subtitle1" fontWeight="medium" color="error.main">
                              Weather Alerts
                            </Typography>
                          </Box>
                          <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {recommendations.alerts.map((alert, index) => (
                              <li key={index}>
                                <Typography variant="body2">{alert}</Typography>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <FarmingIcon sx={{ mr: 1, color: 'success.main' }} />
                          <Typography variant="subtitle1" fontWeight="medium">
                            Crop Management
                          </Typography>
                        </Box>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {recommendations.cropManagement.map((rec, index) => (
                            <li key={index}>
                              <Typography variant="body2">{rec}</Typography>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <RainIcon sx={{ mr: 1, color: 'info.main' }} />
                          <Typography variant="subtitle1" fontWeight="medium">
                            Irrigation Advice
                          </Typography>
                        </Box>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {recommendations.irrigation.map((rec, index) => (
                            <li key={index}>
                              <Typography variant="body2">{rec}</Typography>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TemperatureIcon sx={{ mr: 1, color: 'warning.main' }} />
                          <Typography variant="subtitle1" fontWeight="medium">
                            Seasonal Planning
                          </Typography>
                        </Box>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {recommendations.seasonalPlanning.map((rec, index) => (
                            <li key={index}>
                              <Typography variant="body2">{rec}</Typography>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    );
};

export default WeatherRecommendations;