import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as ProfileIcon,
  ShoppingBag as OrdersIcon,
  Settings as SettingsIcon,
  Store as SellerIcon,
  Favorite as WishlistIcon,
  LocationOn as AddressIcon,
} from '@mui/icons-material';
import { getUserProfile } from '../../redux/slices/userSlice';
import ProfileSettings from '../../components/profile/ProfileSettings';
import OrderHistory from '../../components/profile/OrderHistory';
import AddressBook from '../../components/profile/AddressBook';
import SellerDashboard from '../../components/profile/SellerDashboard';
import Wishlist from '../../components/profile/Wishlist';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  
  const { user, loading, error } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getUserProfile());
    }
  }, [dispatch, navigate, user]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const tabs = [
    { label: 'Profile', icon: <ProfileIcon />, component: <ProfileSettings /> },
    { label: 'Orders', icon: <OrdersIcon />, component: <OrderHistory /> },
    { label: 'Addresses', icon: <AddressIcon />, component: <AddressBook /> },
    { label: 'Wishlist', icon: <WishlistIcon />, component: <Wishlist /> },
  ];
  
  // Add seller dashboard tab if user is a seller
  if (user && user.isSeller) {
    tabs.push({ label: 'Seller Dashboard', icon: <SellerIcon />, component: <SellerDashboard /> });
  }
  
  if (loading) return <Loader />;
  if (error) return <Message severity="error">{error}</Message>;
  if (!user) return null;
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        My Account
      </Typography>
      
      <Grid container spacing={3}>
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  borderRight: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    py: 2,
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Paper>
          </Grid>
        )}
        
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          {isMobile && (
            <Paper elevation={2} sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Paper>
          )}
          
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            {tabs[tabValue].component}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;