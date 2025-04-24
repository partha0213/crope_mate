import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Spa as CropIcon,
  WaterDrop as WaterIcon,
  Eco as PlantIcon,
  Grass as SeedIcon,
  LocalFlorist as FlowerIcon,
  Agriculture as HarvestIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Message from '../ui/Message';

// Calendar component
const Calendar = ({ events, month, year, onEventClick }) => {
  const theme = useTheme();
  
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Create array of day numbers
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Create array for calendar grid (including empty cells for days from previous/next month)
  const calendarGrid = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push(null);
  }
  
  // Add days of the month
  calendarGrid.push(...days);
  
  // Get events for this month
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });
  
  // Group events by day
  const eventsByDay = {};
  monthEvents.forEach(event => {
    const day = new Date(event.date).getDate();
    if (!eventsByDay[day]) {
      eventsByDay[day] = [];
    }
    eventsByDay[day].push(event);
  });
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {dayNames.map(day => (
          <Grid item xs={12/7} key={day}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 1,
              fontWeight: 'medium',
              color: 'text.secondary'
            }}>
              {day}
            </Box>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={1}>
        {calendarGrid.map((day, index) => (
          <Grid item xs={12/7} key={index}>
            {day ? (
              <Box
                sx={{
                  height: 90,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  position: 'relative',
                  bgcolor: eventsByDay[day] ? 'action.hover' : 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    position: 'absolute',
                    top: 4,
                    left: 8,
                    fontWeight: 'medium',
                  }}
                >
                  {day}
                </Typography>
                
                <Box sx={{ mt: 3, overflow: 'hidden' }}>
                  {eventsByDay[day]?.map((event, i) => (
                    <Chip
                      key={i}
                      size="small"
                      label={event.crop}
                      icon={getEventIcon(event.type)}
                      onClick={() => onEventClick(event)}
                      sx={{
                        mb: 0.5,
                        bgcolor: getEventColor(event.type, theme),
                        color: 'white',
                        width: '100%',
                        justifyContent: 'flex-start',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  height: 90,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'action.disabledBackground',
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Helper function to get event icon
const getEventIcon = (type) => {
  switch (type) {
    case 'planting':
      return <SeedIcon fontSize="small" />;
    case 'irrigation':
      return <WaterIcon fontSize="small" />;
    case 'fertilizing':
      return <PlantIcon fontSize="small" />;
    case 'flowering':
      return <FlowerIcon fontSize="small" />;
    case 'harvesting':
      return <HarvestIcon fontSize="small" />;
    default:
      return <CropIcon fontSize="small" />;
  }
};

// Helper function to get event color
const getEventColor = (type, theme) => {
  switch (type) {
    case 'planting':
      return theme.palette.success.main;
    case 'irrigation':
      return theme.palette.info.main;
    case 'fertilizing':
      return theme.palette.warning.main;
    case 'flowering':
      return theme.palette.secondary.main;
    case 'harvesting':
      return theme.palette.error.main;
    default:
      return theme.palette.primary.main;
  }
};

const PlantingCalendar = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [cropTypes, setCropTypes] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    // Fetch available crop types
    const fetchCropTypes = async () => {
      try {
        const { data } = await axios.get('/api/ai/planting-calendar/crops');
        setCropTypes(data);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to load crop data. Please try again.'
        );
      }
    };

    fetchCropTypes();
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { data } = await axios.get(
              `/api/geocode?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
            );
            setLocation(data.location);
          } catch (err) {
            console.error('Error fetching location name:', err);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleCropChange = (e) => {
    setSelectedCrops(e.target.value);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (!location || selectedCrops.length === 0) {
      setError('Please select a location and at least one crop');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/ai/planting-calendar', {
        location,
        crops: selectedCrops,
      });
      setEvents(data.events);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error generating planting calendar. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">

      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          mb: 4,
          background: `linear-gradient(45deg, ${theme.palette.success.light}, ${theme.palette.success.dark})`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Optimal Planting Calendar
        </Typography>
        <Typography variant="body1">
          Get a personalized planting schedule based on your location, climate, and selected crops.
          Our AI analyzes weather patterns and growing conditions to recommend the best times for planting, irrigation, and harvesting.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              value={location}
              onChange={handleLocationChange}
              startAdornment={<LocationIcon />}
            >
              <MenuItem value="">Select location</MenuItem>
              <MenuItem value="manual">Enter manually</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth>
            <InputLabel>Crops</InputLabel>
            <Select
              multiple
              value={selectedCrops}
              onChange={handleCropChange}
              startAdornment={<CropIcon />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {cropTypes.map((crop) => (
                <MenuItem key={crop} value={crop}>
                  {crop}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CalendarIcon />}
            fullWidth
          >
            Generate Calendar
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Box sx={{ mt: 2 }}>
          <Message variant="error">{error}</Message>
        </Box>
      )}

      {events.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Button onClick={handlePrevMonth}>&lt;</Button>
              <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
                {monthNames[currentMonth]} {currentYear}
              </Typography>
              <Button onClick={handleNextMonth}>&gt;</Button>
            </Box>
            <Calendar
              events={events}
              month={currentMonth}
              year={currentYear}
              onEventClick={handleEventClick}
            />
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          Event Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEvent && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.crop}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(selectedEvent.date).toLocaleDateString()}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
