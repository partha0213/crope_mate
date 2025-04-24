import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { connectWallet, checkWalletConnection } from '../../redux/slices/blockchainSlice';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Badge, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, Notifications, AccountCircle, Dashboard, Store, ShoppingCart, BarChart, Person, ExitToApp, Add, List as ListIcon, Brightness4, Brightness7 } from '@mui/icons-material';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { connected, account } = useSelector(state => state.blockchain);
  const { unreadCount } = useSelector(state => state.alert);
  
  useEffect(() => {
    dispatch(checkWalletConnection());
  }, [dispatch]);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };
  
  const handleConnectWallet = () => {
    dispatch(connectWallet());
  };
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
  
  const notificationMenuId = 'primary-notification-menu';
  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={notificationMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(notificationAnchorEl)}
      onClose={handleNotificationMenuClose}
    >
      <MenuItem onClick={() => { handleNotificationMenuClose(); navigate('/notifications'); }}>
        View All Notifications
      </MenuItem>
    </Menu>
  );
  
  const drawerItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      auth: true
    },
    {
      text: 'Marketplace',
      icon: <Store />,
      path: '/marketplace',
      auth: false
    },
    {
      text: 'My Products',
      icon: <ListIcon />,
      path: '/my-products',
      auth: true,
      role: 'farmer'
    },
    {
      text: 'Add Product',
      icon: <Add />,
      path: '/products/add',
      auth: true,
      role: 'farmer'
    },
    {
      text: 'Transactions',
      icon: <ShoppingCart />,
      path: '/transactions',
      auth: true
    },
    {
      text: 'Predictions',
      icon: <BarChart />,
      path: '/predictions',
      auth: true
    },
    {
      text: 'Profile',
      icon: <Person />,
      path: '/profile',
      auth: true
    }
  ];
  
  const renderDrawer = (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          {drawerItems.map((item) => (
            ((!item.auth || isAuthenticated) && (!item.role || (user && user.role === item.role))) && (
              <ListItem button key={item.text} component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
          ))}
        </List>
        <Divider />
        <List>
          {isAuthenticated ? (
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <>
              <ListItem button component={Link} to="/login">
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button component={Link} to="/register">
                <ListItemText primary="Register" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
            CropMarket-Mate
          </Typography>
          
          {!isMobile && (
            <>
              <Button color="inherit" component={Link} to="/marketplace">
                Marketplace
              </Button>
              
              {isAuthenticated && (
                <>
                  <Button color="inherit" component={Link} to="/dashboard">
                    Dashboard
                  </Button>
                  
                  {user && user.role === 'farmer' && (
                    <>
                      <Button color="inherit" component={Link} to="/my-products">
                        My Products
                      </Button>
                      <Button color="inherit" component={Link} to="/products/add">
                        Add Product
                      </Button>
                    </>
                  )}
                  
                  <Button color="inherit" component={Link} to="/transactions">
                    Transactions
                  </Button>
                  
                  <Button color="inherit" component={Link} to="/predictions">
                    Predictions
                  </Button>
                </>
              )}
            </>
          )}
          
          {isAuthenticated ? (
            <>
              {!connected ? (
                <Button color="inherit" onClick={handleConnectWallet}>
                  Connect Wallet
                </Button>
              ) : (
                <Button color="inherit" disabled>
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </Button>
              )}
              
              <IconButton
                color="inherit"
                aria-label="show notifications"
                aria-controls={notificationMenuId}
                aria-haspopup="true"
                onClick={handleNotificationMenuOpen}
              >
                <Badge badgeContent={unreadCount} color="secondary">
                  <Notifications />
                </Badge>
              </IconButton>
              
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user && user.profileImage ? (
                  <Avatar alt={user.name} src={user.profileImage} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
          
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
        </AppBar>
        {renderMenu}
        {renderNotificationMenu}
        {renderDrawer}
        </>
        );
        };
        
        export default Navbar;