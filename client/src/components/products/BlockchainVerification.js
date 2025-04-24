import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Link,
  Chip,
  Divider,
  Grid,
  useTheme,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  LocalShipping as ShippingIcon,
  Agriculture as FarmIcon,
  Factory as ProcessingIcon,
  Store as RetailIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';

const BlockchainVerification = ({ product }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  // Mock blockchain data
  const blockchainData = {
    transactionHash: '0x7d9c9456a4f7d8b3e8d8f9a1b2c3d4e5f6a7b8c9',
    blockNumber: 12345678,
    timestamp: new Date().toISOString(),
    network: 'Ethereum',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    steps: [
      {
        title: 'Farm Origin',
        date: '2023-05-15',
        location: 'Nashik, Maharashtra',
        description: 'Harvested by local farmers using sustainable farming practices',
        verifiedBy: 'FarmVerify Inc.',
        icon: <FarmIcon />,
      },
      {
        title: 'Processing',
        date: '2023-05-18',
        location: 'Pune, Maharashtra',
        description: 'Quality checked, cleaned, and packaged according to standards',
        verifiedBy: 'AgriProcess Certifications',
        icon: <ProcessingIcon />,
      },
      {
        title: 'Distribution',
        date: '2023-05-20',
        location: 'Mumbai, Maharashtra',
        description: 'Transported in temperature-controlled vehicles',
        verifiedBy: 'LogiTrack Systems',
        icon: <ShippingIcon />,
      },
      {
        title: 'Retail',
        date: '2023-05-22',
        location: 'CropMarket-Mate Platform',
        description: 'Listed on marketplace with verified quality certification',
        verifiedBy: 'CropMarket-Mate',
        icon: <RetailIcon />,
      },
    ],
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <VerifiedIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          Blockchain Verification
        </Typography>
      </Box>

      <Typography variant="body1" paragraph>
        This product has been verified on the blockchain, ensuring transparency and traceability throughout the supply chain.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Transaction Hash
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {blockchainData.transactionHash}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Block Number
            </Typography>
            <Typography variant="body2">
              {blockchainData.blockNumber}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Network
            </Typography>
            <Typography variant="body2">
              {blockchainData.network}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Supply Chain Journey
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {blockchainData.steps.map((step, index) => (
          <Step key={step.title}>
            <StepLabel
              StepIconProps={{
                icon: step.icon,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="subtitle1">{step.title}</Typography>
                <Chip
                  label={step.date}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: 'text.secondary',
                  }}
                />
              </Box>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location: {step.location}
                </Typography>
                <Typography variant="body1" paragraph>
                  {step.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified by: {step.verifiedBy}
                </Typography>
              </Box>
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  {index === blockchainData.steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      
      {activeStep === blockchainData.steps.length && (
        <Paper square elevation={0} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
          <Typography variant="body1" gutterBottom>
            You've completed the supply chain journey verification!
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            View Again
          </Button>
          <Button
            variant="outlined"
            startIcon={<QrCodeIcon />}
            sx={{ mt: 1, mr: 1 }}
          >
            View QR Certificate
          </Button>
        </Paper>
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Verify Independently
      </Typography>
      <Typography variant="body2" paragraph>
        You can independently verify this product on the blockchain by visiting the explorer link below:
      </Typography>
      <Link
        href={`https://etherscan.io/tx/${blockchainData.transactionHash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Etherscan
      </Link>
    </Box>
  );
};

export default BlockchainVerification;