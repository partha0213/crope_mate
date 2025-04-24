import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd as RegisterIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { register, clearError } from '../../redux/slices/authSlice';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [farmDetails, setFarmDetails] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [cropTypes, setCropTypes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { user, loading, error, success } = useSelector((state) => state.auth);

  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  // Check if role is specified in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && (roleParam === 'buyer' || roleParam === 'seller')) {
      setRole(roleParam);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const steps = ['Account Information', 'Personal Details', role === 'seller' ? 'Farm Information' : 'Preferences'];

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      if (!name || !email || !password || !confirmPassword) {
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
      setPasswordError('');
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    const userData = {
      name,
      email,
      password,
      role,
      phone,
      address,
      city,
      state,
      pincode,
    };
    
    if (role === 'seller') {
      userData.farmDetails = {
        description: farmDetails,
        size: farmSize,
        cropTypes: cropTypes.split(',').map(crop => crop.trim()),
      };
    }
    
    dispatch(register(userData));
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join CropMarket-Mate to buy and sell crops
          </Typography>
        </Box>

        {error && (
          <Message severity="error" sx={{ mb: 3 }}>
            {error}
          </Message>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
          {activeStep === 0 && (
            <Box>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={!!passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  I want to:
                </Typography>
                <RadioGroup
                  row
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <FormControlLabel value="buyer" control={<Radio />} label="Buy Crops" />
                  <FormControlLabel value="seller" control={<Radio />} label="Sell Crops" />
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                label="Address"
                fullWidth
                margin="normal"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="State"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </Grid>
              </Grid>

              <TextField
                label="Pincode"
                fullWidth
                margin="normal"
                variant="outlined"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
                sx={{ mb: 2, mt: 2 }}
              />
            </Box>
          )}

          {activeStep === 2 && role === 'seller' && (
            <Box>
              <TextField
                label="Farm Description"
                fullWidth
                margin="normal"
                variant="outlined"
                value={farmDetails}
                onChange={(e) => setFarmDetails(e.target.value)}
                required
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Farm Size</InputLabel>
                <Select
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  label="Farm Size"
                  required
                >
                  <MenuItem value="Small (< 5 acres)">Small (less than 5 acres)</MenuItem>
                  <MenuItem value="Medium (5-20 acres)">Medium (5-20 acres)</MenuItem>
                  <MenuItem value="Large (> 20 acres)">Large (more than 20 acres)</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Crop Types (comma separated)"
                fullWidth
                margin="normal"
                variant="outlined"
                value={cropTypes}
                onChange={(e) => setCropTypes(e.target.value)}
                required
                helperText="E.g. Wheat, Rice, Corn"
                sx={{ mb: 2 }}
              />
            </Box>
          )}

          {activeStep === 2 && role === 'buyer' && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Almost done! Just a few preferences to help us personalize your experience.
              </Typography>
              
              <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Preferred Crop Categories</InputLabel>
                <Select
                  multiple
                  value={cropTypes ? cropTypes.split(',').map(crop => crop.trim()) : []}
                  onChange={(e) => setCropTypes(e.target.value.join(', '))}
                  label="Preferred Crop Categories"
                >
                  <MenuItem value="Grains">Grains</MenuItem>
                  <MenuItem value="Vegetables">Vegetables</MenuItem>
                  <MenuItem value="Fruits">Fruits</MenuItem>
                  <MenuItem value="Pulses">Pulses</MenuItem>
                  <MenuItem value="Oilseeds">Oilseeds</MenuItem>
                  <MenuItem value="Spices">Spices</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={<RegisterIcon />}
                  sx={{ px: 4, py: 1.2 }}
                >
                  {loading ? <Loader size={24} text="" /> : 'Register'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{ px: 4, py: 1.2 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ py: 1.2 }}
            >
              Google
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={{ py: 1.2 }}
            >
              Facebook
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              style={{ textDecoration: 'none', color: theme.palette.primary.main }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;