import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Box,
  Tooltip,
  Switch,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { logout } from '../../redux/slices/authSlice';
import { setSearchQuery, toggleSidebar } from '../../redux/slices/uiSlice';
import { useLocation } from 'react-router-dom';
import { SmartToy as AIIcon } from '@mui/icons-material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = ({ toggleSidebar, darkMode, toggleDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { notifications } = useSelector((state) => state.ui);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      dispatch(setSearchQuery(searchValue));
      if (location.pathname !== '/products') {
        navigate('/products');
      }
    }
  };

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationEl);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
      {user && user.role === 'seller' && (
        <MenuItem onClick={() => { handleMenuClose(); navigate('/seller/dashboard'); }}>Seller Dashboard</MenuItem>
      )}
      {user && user.role === 'admin' && (
        <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/dashboard'); }}>Admin Dashboard</MenuItem>
      )}
      <MenuItem onClick={() => { handleMenuClose(); navigate('/orders'); }}>My Orders</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const notificationMenuId = 'notification-menu';
  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={notificationMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationMenuOpen}
      onClose={handleNotificationMenuClose}
    >
      {notifications.length > 0 ? (
        notifications.slice(0, 5).map((notification) => (
          <MenuItem 
            key={notification.id} 
            onClick={() => {
              handleNotificationMenuClose();
              // Handle notification click
            }}
            sx={{ 
              backgroundColor: notification.isRead ? 'inherit' : alpha(theme.palette.primary.main, 0.1),
              borderLeft: notification.isRead ? 'none' : `4px solid ${theme.palette.primary.main}`
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Typography variant="subtitle2">{notification.title}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(notification.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </MenuItem>
        ))
      ) : (
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="body2">No notifications</Typography>
        </MenuItem>
      )}
      {notifications.length > 5 && (
        <MenuItem 
          onClick={() => {
            handleNotificationMenuClose();
            // Navigate to notifications page
          }}
        >
          <Typography variant="body2" color="primary" align="center" sx={{ width: '100%' }}>
            View all notifications
          </Typography>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            display: { xs: 'none', sm: 'block' },
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
          }}
        >
          CropMarket-Mate
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Marketplace
          </Button>
          <Button color="inherit" component={Link} to="/ai-insights">
            AI Insights
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <form onSubmit={handleSearch}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search crops…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Search>
        </form>
        <Box sx={{ display: 'flex' }}>
          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <IconButton
            color="inherit"
            component={Link}
            to="/cart"
          >
            <Badge badgeContent={cartItems.length} color="error">
              <CartIcon />
            </Badge>
          </IconButton>
          {user && (
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}
          {user ? (
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user.profileImage ? (
                <Avatar 
                  src={user.profileImage} 
                  alt={user.name} 
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
      {renderMenu}
      {renderNotificationMenu}
    </AppBar>
  );
};

const Header = () => {
  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/ai">
                <Nav.Link>
                  <AIIcon /> AI Hub
                </Nav.Link>
              </LinkContainer>
              <Nav className="ms-auto">
                {/* ... existing code ... */}
              </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;