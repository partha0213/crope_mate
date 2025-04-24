import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updatePassword } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { Container, Typography, Box, Grid, Paper, TextField, Button, Avatar, Divider, Tab, Tabs, IconButton, InputAdornment, CircularProgress, Card, CardContent, CardActions, List, ListItem, ListItemText, ListItemIcon, Chip } from '@mui/material';
import { Edit, Save, Visibility, VisibilityOff, Person, LocationOn, Phone, Email, Badge, VerifiedUser, Lock, Upload, Delete, Add } from '@mui/icons-material';
import Spinner from '../../components/layout/Spinner';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    bio: '',
    farmName: '',
    farmSize: '',
    farmLocation: '',
    farmingType: '',
    certifications: []
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address?.address || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || '',
        bio: user.bio || '',
        farmName: user.farmDetails?.name || '',
        farmSize: user.farmDetails?.size || '',
        farmLocation: user.farmDetails?.location || '',
        farmingType: user.farmDetails?.farmingType || '',
        certifications: user.farmDetails?.certifications || []
      });
    }
  }, [user]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  
  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
  };
  
  const handleAddCertification = () => {
    setProfileData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', year: '', verified: false }]
    }));
  };
  
  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...profileData.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value
    };
    
    setProfileData(prev => ({
      ...prev,
      certifications: updatedCertifications
    }));
  };
  
  const handleRemoveCertification = (index) => {
    const updatedCertifications = [...profileData.certifications];
    updatedCertifications.splice(index, 1);
    
    setProfileData(prev => ({
      ...prev,
      certifications: updatedCertifications
    }));
  };
  
  const handleSaveProfile = () => {
    // Validate inputs
    if (!profileData.name || !profileData.email) {
      toast.error('Name and email are required');
      return;
    }
    
    // Prepare form data for image upload
    const formData = new FormData();
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    
    // Add profile data
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('phone', profileData.phone);
    formData.append('bio', profileData.bio);
    
    // Add address
    const address = {
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      postalCode: profileData.postalCode,
      country: profileData.country
    };
    formData.append('address', JSON.stringify(address));
    
    // Add farm details if user is a farmer
    if (user.role === 'farmer') {
      const farmDetails = {
        name: profileData.farmName,
        size: profileData.farmSize,
        location: profileData.farmLocation,
        farmingType: profileData.farmingType,
        certifications: profileData.certifications
      };
      formData.append('farmDetails', JSON.stringify(farmDetails));
    }
    
    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully');
        setEditMode(false);
      })
      .catch(err => {
        toast.error(err || 'Failed to update profile');
      });
  };
  
  const handleUpdatePassword = () => {
    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    dispatch(updatePassword(passwordData))
      .unwrap()
      .then(() => {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      })
      .catch(err => {
        toast.error(err || 'Failed to update password');
      });
  };
  
  if (loading && !user) {
    return <Spinner />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Profile Information" />
          <Tab label="Security" />
          {user?.role === 'farmer' && <Tab label="Farm Details" />}
        </Tabs>
      </Paper>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  color={editMode ? "primary" : "secondary"}
                  startIcon={editMode ? <Save /> : <Edit />}
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                >
                  {editMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative', mr: { md: 4 }, mb: { xs: 3, md: 0 } }}>
                  {editMode ? (
                    <>
                      <Avatar
                        src={previewImage || user?.profileImage || '/images/default-avatar.jpg'}
                        alt={user?.name}
                        sx={{ width: 120, height: 120 }}
                      />
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<Upload />}
                          size="small"
                        >
                          Upload
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </Button>
                        {previewImage && (
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            size="small"
                            onClick={handleRemoveImage}
                          >
                            Remove
                          </Button>
                        )}
                      </Box>
                    </>
                  ) : (
                    <Avatar
                      src={user?.profileImage || '/images/default-avatar.jpg'}
                      alt={user?.name}
                      sx={{ width: 120, height: 120 }}
                    />
                  )}
                </Box>
                
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {user?.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Badge color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {user?.role === 'farmer' ? 'Farmer' : 'Consumer'}
                    </Typography>
                    {user?.isVerified && (
                      <Chip 
                        icon={<VerifiedUser fontSize="small" />} 
                        label="Verified" 
                        color="success" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    Member since {new Date(user?.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    multiline
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Address Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Address Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    name="state"
                    value={profileData.state}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="postalCode"
                    value={profileData.postalCode}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={profileData.country}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Password Update */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Update Password
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdatePassword}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Update Password'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Account Security */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Verification"
                    secondary={user?.isVerified ? 'Your email is verified' : 'Please verify your email'}
                  />
                  {!user?.isVerified && (
                    <Button variant="outlined" size="small">
                      Verify Now
                    </Button>
                  )}
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Verification"
                    secondary={user?.phoneVerified ? 'Your phone is verified' : 'Add and verify your phone number'}
                  />
                  {!user?.phoneVerified && (
                    <Button variant="outlined" size="small">
                      Add Phone
                    </Button>
                  )}
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Lock />
                  </ListItemIcon>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security"
                  />
                  <Button variant="outlined" size="small">
                    Setup
                  </Button>
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Login Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last login: {new Date().toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IP Address: 192.168.1.1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Device: Chrome on Windows
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 2 && user?.role === 'farmer' && (
        <Grid container spacing={3}>
          {/* Farm Details */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  color={editMode ? "primary" : "secondary"}
                  startIcon={editMode ? <Save /> : <Edit />}
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                >
                  {editMode ? 'Save Changes' : 'Edit Farm Details'}
                </Button>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Farm Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Farm Name"
                    name="farmName"
                    value={profileData.farmName}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Farm Size"
                    name="farmSize"
                    value={profileData.farmSize}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    placeholder="e.g., 5 acres, 2 hectares"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Farm Location"
                    name="farmLocation"
                    value={profileData.farmLocation}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Farming Type"
                    name="farmingType"
                    value={profileData.farmingType}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    placeholder="e.g., Organic, Traditional, Mixed"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Certifications */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Certifications & Credentials
                </Typography>
                {editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddCertification}
                  >
                    Add Certification
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              {profileData.certifications.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No certifications added yet
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {profileData.certifications.map((cert, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined">
                        <CardContent sx={{ pb: 1 }}>
                          {editMode ? (
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  label="Certification Name"
                                  value={cert.name}
                                  onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  label="Issuing Organization"
                                  value={cert.issuer}
                                  onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  label="Year"
                                  value={cert.year}
                                  onChange={(e) => handleCertificationChange(index, 'year', e.target.value)}
                                  size="small"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="subtitle1">
                                  {cert.name}
                                </Typography>
                                {cert.verified ? (
                                  <Chip 
                                    icon={<VerifiedUser fontSize="small" />} 
                                    label="Verified" 
                                    color="success" 
                                    size="small" 
                                  />
                                ) : (
                                  <Chip 
                                    label="Pending Verification" 
                                    color="warning" 
                                    size="small" 
                                  />
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Issued by {cert.issuer} in {cert.year}
                              </Typography>
                            </>
                          )}
                        </CardContent>
                        {editMode && (
                          <CardActions>
                            <Button 
                              size="small" 
                              color="error"
                              onClick={() => handleRemoveCertification(index)}
                            >
                              Remove
                            </Button>
                          </CardActions>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
          
          {/* Crop Specialization */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Crop Specialization
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Wheat" color="primary" />
                <Chip label="Rice" color="primary" />
                <Chip label="Corn" color="primary" />
                <Chip label="Vegetables" color="primary" />
                <Chip label="Fruits" color="primary" />
                {editMode && (
                  <Chip 
                    label="Add Crop" 
                    color="default" 
                    icon={<Add />} 
                    onClick={() => {}} 
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Profile;