import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPredictions, requestPrediction } from '../../redux/slices/predictionSlice';
import { toast } from 'react-toastify';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardMedia, CardActions, Button, TextField, MenuItem, Divider, Chip, CircularProgress, Tabs, Tab, IconButton } from '@mui/material';
import { TrendingUp, TrendingDown, Info, Add, Refresh, BarChart, ShowChart, PieChart, TableChart, Visibility } from '@mui/icons-material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Spinner from '../../components/layout/Spinner';

const Predictions = () => {
  const dispatch = useDispatch();
  const { predictions, loading } = useSelector(state => state.prediction);
  const { user } = useSelector(state => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [newPrediction, setNewPrediction] = useState({
    crop: '',
    location: '',
    season: '',
    quantity: '',
    additionalInfo: ''
  });
  const [chartType, setChartType] = useState('line');
  
  useEffect(() => {
    dispatch(getPredictions());
  }, [dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrediction(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRequestPrediction = () => {
    // Validate inputs
    if (!newPrediction.crop || !newPrediction.location || !newPrediction.season) {
      toast.error('Please fill all required fields');
      return;
    }
    
    dispatch(requestPrediction(newPrediction))
      .unwrap()
      .then(() => {
        toast.success('Prediction request submitted successfully');
        setNewPrediction({
          crop: '',
          location: '',
          season: '',
          quantity: '',
          additionalInfo: ''
        });
      })
      .catch(err => {
        toast.error(err || 'Failed to submit prediction request');
      });
  };
  
  const refreshPredictions = () => {
    dispatch(getPredictions());
    toast.info('Refreshing predictions...');
  };
  
  // Crops
  const crops = [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'maize', label: 'Maize' },
    { value: 'potato', label: 'Potato' },
    { value: 'tomato', label: 'Tomato' },
    { value: 'onion', label: 'Onion' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'sugarcane', label: 'Sugarcane' }
  ];
  
  // Locations
  const locations = [
    { value: 'punjab', label: 'Punjab' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'uttarpradesh', label: 'Uttar Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamilnadu', label: 'Tamil Nadu' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'andhrapradesh', label: 'Andhra Pradesh' }
  ];
  
  // Seasons
  const seasons = [
    { value: 'kharif', label: 'Kharif (Monsoon)' },
    { value: 'rabi', label: 'Rabi (Winter)' },
    { value: 'zaid', label: 'Zaid (Summer)' }
  ];
  
  // Prepare chart data
  const prepareChartData = () => {
    // Sample data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Price trends
    const priceTrends = {
      labels: months,
      datasets: [
        {
          label: 'Market Price (₹/kg)',
          data: months.map(() => Math.floor(Math.random() * 50) + 20),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Predicted Price (₹/kg)',
          data: months.map(() => Math.floor(Math.random() * 50) + 20),
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.4,
          borderDash: [5, 5],
          fill: true
        }
      ]
    };
    
    // Demand distribution
    const demandDistribution = {
      labels: ['Local Market', 'Export', 'Processing', 'Direct Consumer'],
      datasets: [
        {
          label: 'Demand Distribution',
          data: [40, 20, 25, 15],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    // Yield comparison
    const yieldComparison = {
      labels: ['Your Farm', 'District Avg', 'State Avg', 'National Avg'],
      datasets: [
        {
          label: 'Yield (Quintal/Hectare)',
          data: [42, 38, 35, 32],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    return { priceTrends, demandDistribution, yieldComparison };
  };
  
  const { priceTrends, demandDistribution, yieldComparison } = prepareChartData();
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Market Predictions'
      }
    }
  };
  
  if (loading && predictions.length === 0) {
    return <Spinner />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          AI Market Predictions
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshPredictions}
        >
          Refresh
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="My Predictions" />
          <Tab label="Request New Prediction" />
          <Tab label="Market Insights" />
        </Tabs>
      </Paper>
      
      {tabValue === 0 && (
        <>
          {predictions.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No predictions found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You haven't requested any AI predictions yet
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => setTabValue(1)}
              >
                Request New Prediction
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {predictions.map((prediction, index) => (
                <Grid item key={prediction._id || index} xs={12} md={6}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`/images/crops/${prediction.crop || 'default'}.jpg`}
                      alt={prediction.crop}
                      onError={(e) => {
                        e.target.src = '/images/crops/default.jpg';
                      }}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" gutterBottom>
                          {prediction.crop.charAt(0).toUpperCase() + prediction.crop.slice(1)}
                        </Typography>
                        <Chip
                          label={prediction.status}
                          color={prediction.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {prediction.location} | {prediction.season}
                      </Typography>
                      
                      {prediction.status === 'completed' && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="subtitle2" gutterBottom>
                            Price Prediction:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {prediction.priceTrend === 'rising' ? (
                              <TrendingUp color="success" sx={{ mr: 1 }} />
                            ) : prediction.priceTrend === 'falling' ? (
                              <TrendingDown color="error" sx={{ mr: 1 }} />
                            ) : (
                              <Info color="info" sx={{ mr: 1 }} />
                            )}
                            <Typography variant="body1">
                              {prediction.priceRange || '₹20 - ₹30 per kg'}
                            </Typography>
                          </Box>
                          
                          <Typography variant="subtitle2" gutterBottom>
                            Market Analysis:
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {prediction.marketAnalysis || 'Based on current trends, demand is expected to increase in the coming months. Consider timing your harvest accordingly.'}
                          </Typography>
                          
                          <Typography variant="subtitle2" gutterBottom>
                            Recommended Action:
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {prediction.recommendation || 'Optimal selling time would be next month when prices are expected to peak.'}
                          </Typography>
                        </>
                      )}
                      
                      {prediction.status === 'processing' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 3 }}>
                          <CircularProgress size={40} />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            AI is analyzing market data...
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<Visibility />}>
                        View Details
                      </Button>
                      {prediction.status === 'completed' && (
                        <Button size="small" startIcon={<BarChart />}>
                          View Charts
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
      
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Request New AI Prediction
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Our AI will analyze market trends, weather patterns, and historical data to provide personalized predictions for your crops.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Crop Type *"
                name="crop"
                value={newPrediction.crop}
                onChange={handleInputChange}
                helperText="Select the crop you want predictions for"
                required
              >
                {crops.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Location *"
                name="location"
                value={newPrediction.location}
                onChange={handleInputChange}
                helperText="Select your farming location"
                required
              >
                {locations.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Growing Season *"
                name="season"
                value={newPrediction.season}
                onChange={handleInputChange}
                helperText="Select the growing season"
                required
              >
                {seasons.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expected Quantity"
                name="quantity"
                value={newPrediction.quantity}
                onChange={handleInputChange}
                helperText="Estimated harvest quantity (optional)"
                placeholder="e.g., 500 kg, 5 quintals"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Information"
                name="additionalInfo"
                value={newPrediction.additionalInfo}
                onChange={handleInputChange}
                multiline
                rows={4}
                helperText="Any additional details about your crop, farming methods, etc."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRequestPrediction}
                  disabled={loading}
                >
                  Request Prediction
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {tabValue === 2 && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Market Insights Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Comprehensive market analysis and predictions based on AI-powered data analytics
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <IconButton 
                color={chartType === 'line' ? 'primary' : 'default'} 
                onClick={() => setChartType('line')}
              >
                <ShowChart />
              </IconButton>
              <IconButton 
                color={chartType === 'bar' ? 'primary' : 'default'} 
                onClick={() => setChartType('bar')}
              >
                <BarChart />
              </IconButton>
              <IconButton 
                color={chartType === 'pie' ? 'primary' : 'default'} 
                onClick={() => setChartType('pie')}
              >
                <PieChart />
              </IconButton>
            </Box>
          </Paper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Price Trends & Predictions
                </Typography>
                <Box sx={{ height: 300 }}>
                  {chartType === 'line' && <Line data={priceTrends} options={chartOptions} />}
                  {chartType === 'bar' && <Bar data={priceTrends} options={chartOptions} />}
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Demand Distribution
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Pie data={demandDistribution} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Yield Comparison
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar data={yieldComparison} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Market Insights
                </Typography>
                <Typography variant="body1" paragraph>
                  Based on our AI analysis of current market trends, weather patterns, and historical data, we predict the following for the upcoming season:
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          Price Outlook
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TrendingUp color="success" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            5-10% increase expected
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Due to lower production estimates and increased export demand, prices are expected to rise in the coming months.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          Demand Forecast
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Strong domestic and export demand expected. Processing industry demand is also projected to increase by 15% compared to last year.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          Recommended Actions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Consider staggered selling approach to maximize returns. Focus on quality to command premium prices. Explore direct marketing channels to increase profit margins.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
);
};

export default Predictions;