import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  ShowChart as ChartIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Message from '../ui/Message';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PricePrediction = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [timeframe, setTimeframe] = useState('3months');
  const [loadingCrops, setLoadingCrops] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoadingCrops(true);
        const { data } = await axios.get('/api/ai/price-prediction/crops');
        setCrops(data);
        if (data.length > 0) {
          setSelectedCrop(data[0].value);
        }
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to load crop data. Please try again.'
        );
      } finally {
        setLoadingCrops(false);
      }
    };

    fetchCrops();
  }, []);

  const handleCropChange = (event) => {
    setSelectedCrop(event.target.value);
    setResult(null);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!selectedCrop) {
      setError('Please select a crop');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`/api/ai/price-prediction?crop=${selectedCrop}&timeframe=${timeframe}`);
      setResult(data);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error making price prediction. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!result || !result.priceHistory) return null;

    return {
      labels: result.priceHistory.map(item => item.date),
      datasets: [
        {
          label: 'Historical Price',
          data: result.priceHistory.map(item => item.price),
          borderColor: theme.palette.info.main,
          backgroundColor: theme.palette.info.main,
          pointRadius: 3,
        },
        {
          label: 'Predicted Price',
          data: result.priceForecast.map(item => item.price),
          borderColor: theme.palette.warning.main,
          backgroundColor: theme.palette.warning.main,
          borderDash: [5, 5],
          pointRadius: 3,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y} per kg`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        },
        title: {
          display: true,
          text: 'Price per kg (₹)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          mb: 4,
          background: `linear-gradient(45deg, ${theme.palette.info.light}, ${theme.palette.info.main})`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Crop Price Prediction
        </Typography>
        <Typography variant="body1">
          Forecast market prices for your crops to make informed selling decisions.
          Our AI analyzes historical data, market trends, and seasonal patterns to predict future prices.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Select Crop & Timeframe
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {loadingCrops ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Crop</InputLabel>
                  <Select
                    value={selectedCrop}
                    onChange={handleCropChange}
                    label="Crop"
                    disabled={loading}
                  >
                    {crops.map((crop) => (
                      <MenuItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Prediction Timeframe</InputLabel>
                  <Select
                    value={timeframe}
                    onChange={handleTimeframeChange}
                    label="Prediction Timeframe"
                    disabled={loading}
                  >
                    <MenuItem value="1month">1 Month</MenuItem>
                    <MenuItem value="3months">3 Months</MenuItem>
                    <MenuItem value="6months">6 Months</MenuItem>
                  </Select>
                </FormControl>

                {error && <Message severity="error" sx={{ mt: 2 }}>{error}</Message>}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <ChartIcon />}
                  onClick={handleSubmit}
                  disabled={loading || !selectedCrop}
                  sx={{ mt: 3 }}
                >
                  {loading ? 'Predicting...' : 'Predict Prices'}
                </Button>
              </>
            )}

            {result && (
              <Card sx={{ mt: 4 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Market Insights
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {result.insights.map((insight, index) => (
                      <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                        <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
                        <Typography variant="body2">{insight}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Price Forecast
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  flex: 1,
                }}
              >
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Analyzing market data and generating price forecast...
                </Typography>
              </Box>
            ) : result ? (
              <Box sx={{ flex: 1 }}>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ bgcolor: 'background.default' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle1" fontWeight="medium">
                            Current Price
                          </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ color: 'text.primary' }}>
                          ₹{result.currentPrice}/kg
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          As of {result.asOfDate}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card sx={{ bgcolor: result.priceDirection === 'up' ? 'success.light' : 'error.light' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {result.priceDirection === 'up' ? (
                            <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                          ) : (
                            <TrendingDownIcon sx={{ mr: 1, color: 'error.main' }} />
                          )}
                          <Typography variant="subtitle1" fontWeight="medium" color={result.priceDirection === 'up' ? 'success.main' : 'error.main'}>
                            Predicted Trend
                          </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ color: result.priceDirection === 'up' ? 'success.main' : 'error.main' }}>
                          {result.priceDirection === 'up' ? '+' : ''}{result.priceChangePercent}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Expected in {timeframe === '1month' ? '1 month' : timeframe === '3months' ? '3 months' : '6 months'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ height: 350, mb: 3 }}>
                  {getChartData() && <Line data={getChartData()} options={chartOptions} />}
                </Box>

                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Selling Recommendations
                    </Typography>
                    <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                      {result.recommendations.map((recommendation, index) => (
                        <li key={index}>
                          <Typography variant="body2">{recommendation}</Typography>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  flex: 1,
                  color: 'text.secondary',
                }}
              >
                <TimelineIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="body1" align="center">
                  Select a crop and timeframe, then click "Predict Prices" to see the forecast
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PricePrediction;