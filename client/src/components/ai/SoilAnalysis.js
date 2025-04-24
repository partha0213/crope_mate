import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Grass as SoilIcon,
  Science as AnalysisIcon,
  Spa as PlantIcon,
  LocalFlorist as FertilizerIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Message from '../ui/Message';

const SoilAnalysis = () => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const { data } = await axios.post('/api/ai/soil-analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(data);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error analyzing soil image. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getNutrientLevel = (value) => {
    if (value < 30) return 'Low';
    if (value < 70) return 'Medium';
    return 'High';
  };

  const getNutrientColor = (value) => {
    if (value < 30) return theme.palette.error.main;
    if (value < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          mb: 4,
          background: `linear-gradient(45deg, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Soil Analysis
        </Typography>
        <Typography variant="body1">
          Upload an image of your soil to analyze its composition and nutrient content.
          Our AI system will provide detailed insights about your soil quality and recommend suitable crops and fertilizers.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
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
              Upload Soil Image
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 3,
                mb: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
                backgroundColor: 'action.hover',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {preview ? (
                <Box
                  component="img"
                  src={preview}
                  alt="Soil Preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" align="center">
                    Drag and drop a soil image here or click to browse
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    For best results, take a clear photo of the soil in good lighting
                  </Typography>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </Box>

            {error && <Message severity="error">{error}</Message>}

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <AnalysisIcon />}
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              sx={{ mt: 'auto' }}
            >
              {loading ? 'Analyzing...' : 'Analyze Soil'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
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
              Soil Analysis Results
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
                }}
              >
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Analyzing soil composition...
                </Typography>
              </Box>
            ) : result ? (
              <Box>
                <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SoilIcon sx={{ mr: 1, color: 'warning.main' }} />
                      <Typography variant="h6" fontWeight="medium">
                        Soil Type
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {result.soilType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {result.soilDescription}
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Nutrient Composition
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {Object.entries(result.nutrients).map(([nutrient, value]) => (
                    <Grid item xs={12} sm={6} key={nutrient}>
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{nutrient}</Typography>
                          <Typography variant="body2" fontWeight="medium" color={getNutrientColor(value)}>
                            {getNutrientLevel(value)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={value}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'action.hover',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getNutrientColor(value),
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PlantIcon sx={{ mr: 1, color: 'success.main' }} />
                          <Typography variant="subtitle1" fontWeight="medium">
                            Suitable Crops
                          </Typography>
                        </Box>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {result.suitableCrops.map((crop, index) => (
                            <li key={index}>
                              <Typography variant="body2">{crop}</Typography>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <FertilizerIcon sx={{ mr: 1, color: 'info.main' }} />
                          <Typography variant="subtitle1" fontWeight="medium">
                            Fertilizer Recommendations
                          </Typography>
                        </Box>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {result.fertilizerRecommendations.map((recommendation, index) => (
                            <li key={index}>
                              <Typography variant="body2">{recommendation}</Typography>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <SoilIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="body1" align="center">
                  Upload a soil image and click "Analyze Soil" to get detailed insights
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SoilAnalysis;