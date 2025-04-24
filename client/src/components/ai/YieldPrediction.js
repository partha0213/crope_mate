import React, { useState } from 'react';
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  WaterDrop as WaterIcon,
  Thermostat as TemperatureIcon,
  Opacity as HumidityIcon,
  Landscape as SoilIcon,
  Timeline as PredictionIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Message from '../ui/Message';

const YieldPrediction = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cropType: '',
    soilType: '',
    area: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const cropTypes = [
    'Rice', 'Wheat', 'Maize', 'Chickpea', 'Kidney Beans', 'Pigeon Peas',
    'Moth Beans', 'Mung Bean', 'Black Gram', 'Lentil', 'Pomegranate',
    'Banana', 'Mango', 'Grapes', 'Watermelon', 'Muskmelon', 'Apple',
    'Orange', 'Papaya', 'Coconut', 'Cotton', 'Jute', 'Coffee'
  ];

  const soilTypes = [
    'Alluvial Soil', 'Black Soil', 'Red Soil', 'Laterite Soil',
    'Arid Soil', 'Forest Soil', 'Saline Soil', 'Peaty Soil',
    'Marshy Soil', 'Loamy Soil', 'Sandy Soil', 'Clay Soil'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    const requiredFields = Object.keys(formData);
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      setError(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/ai/yield-prediction', formData);
      setResult(data);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error making prediction. Please try again.'
      );
    } finally {
      setLoading(false);
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
          background: `linear-gradient(45deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Crop Yield Prediction
        </Typography>
        <Typography variant="body1">
          Predict your crop yield based on soil conditions, weather patterns, and farming practices.
          Our AI model analyzes multiple factors to provide accurate yield estimates to help you plan better.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Enter Crop Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required margin="normal">
                  <InputLabel>Crop Type</InputLabel>
                  <Select
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleChange}
                    label="Crop Type"
                  >
                    {cropTypes.map((crop) => (
                      <MenuItem key={crop} value={crop}>
                        {crop}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required margin="normal">
                  <InputLabel>Soil Type</InputLabel>
                  <Select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    label="Soil Type"
                  >
                    {soilTypes.map((soil) => (
                      <MenuItem key={soil} value={soil}>
                        {soil}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Area"
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">acres</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Soil Nutrients
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nitrogen"
                  name="nitrogen"
                  type="number"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg/ha</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Phosphorus"
                  name="phosphorus"
                  type="number"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg/ha</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Potassium"
                  name="potassium"
                  type="number"
                  value={formData.potassium}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg/ha</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Environmental Conditions
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Temperature"
                  name="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Humidity"
                  name="humidity"
                  type="number"
                  value={formData.humidity}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="pH Value"
                  name="ph"
                  type="number"
                  value={formData.ph}
                  onChange={handleChange}
                  required
                  margin="normal"
                  inputProps={{ step: 0.1, min: 0, max: 14 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rainfall"
                  name="rainfall"
                  type="number"
                  value={formData.rainfall}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>

            {error && <Message severity="error" sx={{ mt: 2 }}>{error}</Message>}

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <PredictionIcon />}
              onClick={handleSubmit}
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? 'Predicting...' : 'Predict Yield'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
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
              Yield Prediction Results
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
                  Analyzing data and generating prediction...
                </Typography>
              </Box>
            ) : result ? (
              <Box sx={{ flex: 1 }}>
                <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                      Predicted Yield
                    </Typography>
                    <Typography variant="h3" align="center" fontWeight="bold">
                      {result.predictedYield} {result.unit}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                      per acre
                    </Typography>
                  </CardContent>
                </Card>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AgricultureIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle1" fontWeight="medium">
                            Total Yield
                          </Typography>
                        </Box>
                        <Typography variant="h6">
                          {(result.predictedYield * parseFloat(formData.area)).toFixed(2)} {result.unit}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SoilIcon sx={{ mr: 1, color: 'warning.main' }} />
                          <Typography variant="subtitle1" fontWeight="medium">
                            Soil Suitability
                          </Typography>
                        </Box>
                        <Typography variant="h6">
                          {result.soilSuitability}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Recommendations
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
                <PredictionIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="body1" align="center">
                  Fill in the crop details and click "Predict Yield" to get your estimate
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default YieldPrediction;