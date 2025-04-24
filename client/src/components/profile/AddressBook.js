import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { saveAddress, deleteAddress, setDefaultAddress } from '../../redux/slices/userSlice';
import Message from '../ui/Message';
import Loader from '../ui/Loader';

const AddressBook = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    addressType: 'home',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });
  
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];
  
  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);
  
  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      setFormData(addresses[index]);
      setEditIndex(index);
    } else {
      setFormData({
        fullName: user.name || '',
        addressType: 'home',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: addresses.length === 0,
      });
      setEditIndex(null);
    }
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isDefault' ? checked : value,
    }));
  };
  
  const handleSubmit = () => {
    if (editIndex !== null) {
      // Update existing address
      const updatedAddresses = [...addresses];
      updatedAddresses[editIndex] = formData;
      
      // If this address is set as default, update other addresses
      if (formData.isDefault) {
        updatedAddresses.forEach((addr, idx) => {
          if (idx !== editIndex) {
            updatedAddresses[idx] = { ...addr, isDefault: false };
          }
        });
      }
      
      dispatch(saveAddress(updatedAddresses));
    } else {
      // Add new address
      const newAddresses = [...addresses];
      
      // If this address is set as default, update other addresses
      if (formData.isDefault) {
        newAddresses.forEach((addr, idx) => {
          newAddresses[idx] = { ...addr, isDefault: false };
        });
      }
      
      newAddresses.push(formData);
      dispatch(saveAddress(newAddresses));
    }
    
    handleCloseDialog();
  };
  
  const handleDelete = (index) => {
    const updatedAddresses = addresses.filter((_, idx) => idx !== index);
    
    // If the deleted address was the default, set the first address as default
    if (addresses[index].isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0] = { ...updatedAddresses[0], isDefault: true };
    }
    
    dispatch(deleteAddress(updatedAddresses));
  };
  
  const handleSetDefault = (index) => {
    const updatedAddresses = addresses.map((addr, idx) => ({
      ...addr,
      isDefault: idx === index,
    }));
    
    dispatch(setDefaultAddress(updatedAddresses));
  };
  
  const getAddressIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <HomeIcon />;
      case 'work':
        return <WorkIcon />;
      default:
        return <LocationIcon />;
    }
  };
  
  if (loading) return <Loader />;
  if (error) return <Message severity="error">{error}</Message>;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Address Book
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Address
        </Button>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {addresses.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            No addresses found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add your first address to make checkout easier.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Address
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((address, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  border: address.isDefault ? 2 : 0,
                  borderColor: 'primary.main',
                }}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'action.hover',
                          mr: 2,
                        }}
                      >
                        {getAddressIcon(address.addressType)}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {address.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          {address.addressType}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(index)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(index)}
                        disabled={address.isDefault}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" paragraph>
                      {address.address}, {address.city}, {address.state} {address.postalCode}, {address.country}
                    </Typography>
                    <Typography variant="body2">
                      Phone: {address.phoneNumber}
                    </Typography>
                  </Box>
                  
                  {!address.isDefault && (
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      onClick={() => handleSetDefault(index)}
                      sx={{ mt: 2 }}
                    >
                      Set as Default
                    </Button>
                  )}
                  
                  {address.isDefault && (
                    <Typography 
                      variant="body2" 
                      color="primary" 
                      sx={{ 
                        mt: 2, 
                        textAlign: 'center',
                        fontWeight: 'medium',
                      }}
                    >
                      Default Address
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex !== null ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Address Type</InputLabel>
                <Select
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleChange}
                  label="Address Type"
                >
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  label="State"
                >
                  {indianStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  style={{ marginRight: 8 }}
                />
                <label htmlFor="isDefault">Set as default address</label>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editIndex !== null ? 'Update' : 'Add'} Address
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressBook;