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
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  BugReport as DiseaseIcon,
  Healing as TreatmentIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Message from '../ui/Message';

const CropDiseaseDetection = () => {
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
      const { data } = await axios.post('/api/ai/crop-disease', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(data);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error analyzing image. Please try again.'
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
          background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Crop Disease Detection
        </Typography>
        <Typography variant="body1">
          Upload an image of your crop to identify diseases and get treatment recommendations.
          Our AI system can detect common diseases in various crops and provide guidance on how to address them.
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
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Upload Crop Image
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
                  alt="Crop Preview"
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
                    Drag and drop an image here or click to browse
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
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <DiseaseIcon />}
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              sx={{ mt: 'auto' }}
            >
              {loading ? 'Analyzing...' : 'Detect Disease'}
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
              Analysis Results
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
                  Analyzing your crop image...
                </Typography>
              </Box>
            ) : result ? (
              <Box>
                <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DiseaseIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="medium">
                        Detected Disease
                      </Typography>
                    </Box>
                    <Typography variant="body1">{result.diseaseName}</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InfoIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="medium">
                        Description
                      </Typography>
                    </Box>
                    <Typography variant="body2">{result.description}</Typography>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TreatmentIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="medium">
                        Treatment Recommendations
                      </Typography>
                    </Box>
                    <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                      {result.treatments.map((treatment, index) => (
                        <li key={index}>
                          <Typography variant="body2">{treatment}</Typography>
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
                  color: 'text.secondary',
                }}
              >
                <InfoIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="body1" align="center">
                  Upload an image and click "Detect Disease" to analyze your crop
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CropDiseaseDetection;