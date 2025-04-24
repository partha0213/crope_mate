import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, IconButton, Tabs, Tab, TextField, InputAdornment, MenuItem, Menu, Divider } from '@mui/material';
import { Search, FilterList, MoreVert, Visibility, Receipt, LocalShipping, CheckCircle, Cancel, ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { getTransactions } from '../../redux/slices/transactionSlice';
import Spinner from '../../components/layout/Spinner';

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector(state => state.transaction);
  const { user } = useSelector(state => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleMenuOpen = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Filter transactions based on tab and search term
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by tab (All, Pending, Completed, Cancelled)
    if (tabValue === 1 && transaction.status !== 'pending') return false;
    if (tabValue === 2 && transaction.status !== 'completed') return false;
    if (tabValue === 3 && transaction.status !== 'cancelled') return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.product?.name?.toLowerCase().includes(searchLower) ||
        transaction._id.toLowerCase().includes(searchLower) ||
        transaction.seller?.name?.toLowerCase().includes(searchLower) ||
        transaction.buyer?.name?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'amount':
        aValue = a.totalAmount;
        bValue = b.totalAmount;
        break;
      case 'date':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'product':
        aValue = a.product?.name || '';
        bValue = b.product?.name || '';
        break;
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Get status chip color and icon
  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'warning', icon: <LocalShipping fontSize="small" />, label: 'Pending' };
      case 'completed':
        return { color: 'success', icon: <CheckCircle fontSize="small" />, label: 'Completed' };
      case 'cancelled':
        return { color: 'error', icon: <Cancel fontSize="small" />, label: 'Cancelled' };
      default:
        return { color: 'default', icon: null, label: status };
    }
  };

  if (loading && transactions.length === 0) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        {user?.role === 'farmer' ? 'Manage your sales' : 'View your purchases'}
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Transactions" />
          <Tab label="Pending" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>
      </Paper>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            placeholder="Search transactions..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
          >
            Filter
          </Button>
        </Box>
      </Paper>
      
      {sortedTransactions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No transactions found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {searchTerm 
              ? 'Try a different search term or filter' 
              : user?.role === 'farmer' 
                ? 'You haven\'t made any sales yet' 
                : 'You haven\'t made any purchases yet'
            }
          </Typography>
          {user?.role !== 'farmer' && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/marketplace"
            >
              Browse Marketplace
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleSort('date')}
                  >
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>
                  <Box 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleSort('product')}
                  >
                    Product
                    {sortField === 'product' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{user?.role === 'farmer' ? 'Buyer' : 'Seller'}</TableCell>
                <TableCell>
                  <Box 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTransactions.map((transaction) => {
                const statusChip = getStatusChip(transaction.status);
                
                return (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {transaction._id.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Link to={`/products/${transaction.product?._id}`} style={{ textDecoration: 'none' }}>
                        <Typography color="primary" variant="body2">
                          {transaction.product?.name || 'Unknown Product'}
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {user?.role === 'farmer' 
                        ? transaction.buyer?.name || 'Unknown Buyer'
                        : transaction.seller?.name || 'Unknown Seller'
                      }
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{transaction.totalAmount.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.quantity} {transaction.product?.unit || 'units'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={statusChip.icon}
                        label={statusChip.label}
                        color={statusChip.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, transaction)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Transaction Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          component={Link} 
          to={`/transactions/${selectedTransaction?._id}`}
          onClick={handleMenuClose}
        >
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem 
          component={Link} 
          to={`/products/${selectedTransaction?.product?._id}`}
          onClick={handleMenuClose}
        >
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Product
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <Receipt fontSize="small" sx={{ mr: 1 }} /> Download Receipt
        </MenuItem>
      </Menu>
    </Container>
);
};

export default Transactions;