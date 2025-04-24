import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const ProductFilter = ({ onFilterChange, onReset }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [isOrganic, setIsOrganic] = useState(false);
  const [quality, setQuality] = useState('');
  const [rating, setRating] = useState(0);
  
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  
  const handleOrganicChange = (event) => {
    setIsOrganic(event.target.checked);
  };
  
  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };
  
  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };
  
  const handleApplyFilters = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      isOrganic,
      quality,
      rating,
    });
  };
  
  const handleResetFilters = () => {
    setPriceRange([0, 5000]);
    setIsOrganic(false);
    setQuality('');
    setRating(0);
    onReset();
  };
  
  return (
    <Box sx={{ mb: 3 }}>
      {isMobile ? (
        <Accordion elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Filters
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <FilterContent
              priceRange={priceRange}
              isOrganic={isOrganic}
              quality={quality}
              rating={rating}
              handlePriceChange={handlePriceChange}
              handleOrganicChange={handleOrganicChange}
              handleQualityChange={handleQualityChange}
              handleRatingChange={handleRatingChange}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
            />
          </AccordionDetails>
        </Accordion>
      ) : (
        <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="medium">
              Filters
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <FilterContent
            priceRange={priceRange}
            isOrganic={isOrganic}
            quality={quality}
            rating={rating}
            handlePriceChange={handlePriceChange}
            handleOrganicChange={handleOrganicChange}
            handleQualityChange={handleQualityChange}
            handleRatingChange={handleRatingChange}
            handleApplyFilters={handleApplyFilters}
            handleResetFilters={handleResetFilters}
          />
        </Box>
      )}
    </Box>
  );
};

const FilterContent = ({
  priceRange,
  isOrganic,
  quality,
  rating,
  handlePriceChange,
  handleOrganicChange,
  handleQualityChange,
  handleRatingChange,
  handleApplyFilters,
  handleResetFilters,
}) => {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={5000}
          step={100}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">₹{priceRange[0]}</Typography>
          <Typography variant="body2">₹{priceRange[1]}</Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Product Type
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={isOrganic}
              onChange={handleOrganicChange}
              color="primary"
            />
          }
          label="Organic Products"
        />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Quality
        </Typography>
        <RadioGroup value={quality} onChange={handleQualityChange}>
          <FormControlLabel value="premium" control={<Radio />} label="Premium" />
          <FormControlLabel value="standard" control={<Radio />} label="Standard" />
          <FormControlLabel value="economy" control={<Radio />} label="Economy" />
        </RadioGroup>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Rating
        </Typography>
        <RadioGroup value={rating.toString()} onChange={handleRatingChange}>
          <FormControlLabel value="4" control={<Radio />} label="4★ & above" />
          <FormControlLabel value="3" control={<Radio />} label="3★ & above" />
          <FormControlLabel value="2" control={<Radio />} label="2★ & above" />
          <FormControlLabel value="1" control={<Radio />} label="1★ & above" />
        </RadioGroup>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyFilters}
          fullWidth
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          onClick={handleResetFilters}
          fullWidth
        >
          Reset
        </Button>
      </Box>
    </>
  );
};

export default ProductFilter;