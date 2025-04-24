import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  BarChart as ChartIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Warning as AlertIcon,
} from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getFarmerStats, getMarketTrends, getAlerts } from '../../actions/dashboardActions';
import { listMyProducts } from '../../actions/productActions';
import Message from '../ui/Message';
import AlertCard from '../ui/AlertCard';
import StatCard from '../ui/StatCard';
import RecentTransactions from './RecentTransactions';

// Register Chart.js components
Chart.register(...registerables);

const FarmerDashboard = () => {
  const [period, setPeriod] = useState('month');
  
  const dispatch = useDispatch();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const farmerStats = useSelector((state) => state.farmerStats);
  const { loading: statsLoading, error: statsError, stats } = farmerStats;
  
  const marketTrends = useSelector((state) => state.marketTrends);
  const { loading: trendsLoading, error: trendsError, trends } = marketTrends;
  
  const alertsList = useSelector((state) => state.alerts);
  const { loading: alertsLoading, error: alertsError, alerts } = alertsList;
  
  const productListMy = useSelector((state) => state.productListMy);
  const { loading: productsLoading, error: productsError, products } = productListMy;
  
  useEffect(() => {
    dispatch(getFarmerStats(period));
    dispatch(getMarketTrends());
    dispatch(getAlerts());
    dispatch(listMyProducts());
  }, [dispatch, period]);
  
  // Prepare chart data
  const salesData = {
    labels: stats?.salesChart?.labels || [],
    datasets: [
      {
        label: 'Sales',
        data: stats?.salesChart?.data || [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
    ],
  };
  
  const cropDistributionData = {
    labels: stats?.cropDistribution?.labels || [],
    datasets: [
      {
        data: stats?.cropDistribution?.data || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',