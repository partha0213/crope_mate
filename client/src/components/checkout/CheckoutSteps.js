import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  ShoppingBag as ReviewIcon,
  CheckCircle as ConfirmIcon,
} from '@mui/icons-material';

const CheckoutSteps = ({ activeStep }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const steps = [
    {
      label: 'Shipping',
      icon: <ShippingIcon />,
      path: '/shipping',
    },
    {
      label: 'Payment',
      icon: <PaymentIcon />,
      path: '/payment',
    },
    {
      label: 'Review',
      icon: <ReviewIcon />,
      path: '/placeorder',
    },
    {
      label: 'Confirmation',
      icon: <ConfirmIcon />,
      path: '/order',
    },
  ];
  
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        sx={{ 
          '& .MuiStepConnector-line': {
            borderTopWidth: 3,
          },
        }}
      >
        {steps.map((step, index) => {
          const stepProps = {};
          const labelProps = {};
          
          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel 
                {...labelProps} 
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: index <= activeStep ? 'primary.main' : 'action.disabledBackground',
                      color: index <= activeStep ? 'primary.contrastText' : 'text.disabled',
                    }}
                  >
                    {step.icon}
                  </Box>
                )}
              >
                {index < activeStep ? (
                  <Button
                    component={Link}
                    to={step.path}
                    color="inherit"
                    sx={{ textTransform: 'none' }}
                  >
                    {step.label}
                  </Button>
                ) : (
                  <Typography
                    variant="body2"
                    color={index === activeStep ? 'primary.main' : 'text.secondary'}
                    fontWeight={index === activeStep ? 'bold' : 'normal'}
                  >
                    {step.label}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default CheckoutSteps;