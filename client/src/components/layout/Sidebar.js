import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Store as StoreIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Psychology as AIIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Logout as LogoutIcon,
  SupervisedUserCircle as AdminIcon,
  Agriculture as FarmerIcon,
} from '@mui/icons-material';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';

const Sidebar = ({ open, toggleSidebar }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawerWidth = 280;

  return (
    <Drawer
      open={open}
      onClose={() => dispatch(toggleSidebar())}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            CropMarket-Mate
          </Typography>
          <IconButton onClick={() => dispatch(toggleSidebar())}>
            <CloseIcon />
          </IconButton>
        </Box>

        {user && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Avatar
              src={user.profileImage}
              alt={user.name}
              sx={{ width: 64, height: 64, mb: 1 }}
            />
            <Typography variant="subtitle1" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 1,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
            >
              {user.role === 'admin' && <AdminIcon fontSize="small" sx={{ mr: 0.5 }} />}
              {user.role === 'seller' && <FarmerIcon fontSize="small" sx={{ mr: 0.5 }} />}
              {user.role === 'buyer' && <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />}
              <Typography variant="caption" textTransform="capitalize">
                {user.role}
              </Typography>
            </Box>
          </Box>
        )}

        <Divider />

        <List sx={{ flexGrow: 1 }}>
          <ListItem
            button
            component={Link}
            to="/"
            selected={isActive('/')}
            onClick={() => dispatch(toggleSidebar())}
          >
            <ListItemIcon>
              <HomeIcon color={isActive('/') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/products"
            selected={isActive('/products')}
            onClick={() => dispatch(toggleSidebar())}
          >
            <ListItemIcon>
              <StoreIcon color={isActive('/products') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Marketplace" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/cart"
            selected={isActive('/cart')}
            onClick={() => dispatch(toggleSidebar())}
          >
            <ListItemIcon>
              <CartIcon color={isActive('/cart') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/ai-insights"
            selected={isActive('/ai-insights')}
            onClick={() => dispatch(toggleSidebar())}
          >
            <ListItemIcon>
              <AIIcon color={isActive('/ai-insights') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="AI Insights" />
          </ListItem>

          {user ? (
            <>
              <ListItem
                button
                component={Link}
                to="/profile"
                selected={isActive('/profile')}
                onClick={() => dispatch(toggleSidebar())}
              >
                <ListItemIcon>
                  <PersonIcon color={isActive('/profile') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/orders"
                selected={isActive('/orders')}
                onClick={() => dispatch(toggleSidebar())}
              >
                <ListItemIcon>
                  <ReceiptIcon color={isActive('/orders') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="My Orders" />
              </ListItem>

              {user.role === 'seller' && (
                <ListItem
                  button
                  component={Link}
                  to="/seller/dashboard"
                  selected={location.pathname.startsWith('/seller')}
                  onClick={() => dispatch(toggleSidebar())}
                >
                  <ListItemIcon>
                    <DashboardIcon color={location.pathname.startsWith('/seller') ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Seller Dashboard" />
                </ListItem>
              )}

              {user.role === 'admin' && (
                <ListItem
                  button
                  component={Link}
                  to="/admin/dashboard"
                  selected={location.pathname.startsWith('/admin')}
                  onClick={() => dispatch(toggleSidebar())}
                >
                  <ListItemIcon>
                    <AdminIcon color={location.pathname.startsWith('/admin') ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              )}
            </>
          ) : (
            <>
              <ListItem
                button
                component={Link}
                to="/login"
                selected={isActive('/login')}
                onClick={() => dispatch(toggleSidebar())}
              >
                <ListItemIcon>
                  <LoginIcon color={isActive('/login') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/register"
                selected={isActive('/register')}
                onClick={() => dispatch(toggleSidebar())}
              >
                <ListItemIcon>
                  <RegisterIcon color={isActive('/register') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </>
          )}
        </List>

        <Divider />

        <List>
          <ListItem
            button
            component={Link}
            to="/help"
            selected={isActive('/help')}
            onClick={() => dispatch(toggleSidebar())}
          >
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItem>

          {user && (
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;