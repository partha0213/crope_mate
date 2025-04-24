import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  Store as StoreIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { toggleSidebar } from '../../redux/slices/uiSlice';

const MobileNav = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/products')) return 1;
    if (path === '/cart') return 2;
    if (path === '/profile' || path.startsWith('/seller') || path.startsWith('/admin')) return 3;
    return 4; // Menu
  };

  if (!isMobile) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={getActiveTab()}
        sx={{ height: 60 }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Shop"
          icon={<StoreIcon />}
          component={Link}
          to="/products"
        />
        <BottomNavigationAction
          label="Cart"
          icon={
            <Badge badgeContent={cartItems.length} color="error">
              <CartIcon />
            </Badge>
          }
          component={Link}
          to="/cart"
        />
        <BottomNavigationAction
          label="Profile"
          icon={<PersonIcon />}
          component={Link}
          to={user ? '/profile' : '/login'}
        />
        <BottomNavigationAction
          label="Menu"
          icon={<MenuIcon />}
          onClick={() => dispatch(toggleSidebar())}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNav;