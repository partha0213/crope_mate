import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { updateUserProfile } from '../../redux/slices/userSlice';

const ProfileSettings = () => {
  const dispatch = useDispatch();
  
  const { user, loading, success, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    // Only include password if it's provided
    const updateData = {
      name: formData.name,
      email: formData.email,
      ...(formData.password && { password: formData.password }),
    };
    
    dispatch(updateUserProfile(updateData));
    setEditMode(false);
  };
  
  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      confirmPassword: '',
      avatar: user.avatar || '',
    });
    setEditMode(false);
    setMessage(null);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Profile Settings
        </Typography>
        {!editMode && (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </Button>
        )}
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {message && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={formData.avatar}
              alt={formData.name}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            {editMode && (
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 2 }}
              >
                Change Avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    // Handle file upload logic here
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData((prev) => ({
                          ...prev,
                          avatar: reader.result,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                />
              </Grid>
              
              {editMode && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            
            {editMode && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProfileSettings;