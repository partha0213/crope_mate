import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Box
            component={Link}
            to={`/products/${item.id}`}
            sx={{
              width: 100,
              height: 100,
              borderRadius: 1,
              overflow: 'hidden',
              mr: 2,
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography
                variant="subtitle1"
                component={Link}
                to={`/products/${item.id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'text.primary',
                  fontWeight: 'medium',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {item.name}
              </Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemove(item.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.category}
            </Typography>
            <Typography variant="body1" fontWeight="medium" color="primary.main" sx={{ mb: 1 }}>
              ₹{item.price.toFixed(2)} per {item.unit}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  size="small"
                  onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  sx={{ border: `1px solid ${theme.palette.divider}` }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <TextField
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0 && value <= item.countInStock) {
                      onQuantityChange(item.id, value);
                    }
                  }}
                  inputProps={{ min: 1, max: item.countInStock }}
                  sx={{ width: 40, mx: 1, '& input': { textAlign: 'center', p: 1 } }}
                />
                <IconButton
                  size="small"
                  onClick={() => onQuantityChange(item.id, Math.min(item.countInStock, item.quantity + 1))}
                  disabled={item.quantity >= item.countInStock}
                  sx={{ border: `1px solid ${theme.palette.divider}` }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="subtitle1" fontWeight="bold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;