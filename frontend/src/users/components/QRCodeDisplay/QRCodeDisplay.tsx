import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface QRCodeDisplayProps {
  qrCodeDataUrl: string;
  manualEntryKey: string;
  title?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeDataUrl,
  manualEntryKey,
  title = 'Scan QR Code',
}) => {
  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(manualEntryKey);
      toast.success('Manual entry key copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy key to clipboard');
    }
  };

  return (
    <Box textAlign="center">
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'inline-block',
          mb: 2,
        }}
      >
        <img
          src={qrCodeDataUrl}
          alt="QR Code for MFA setup"
          style={{ width: 200, height: 200 }}
        />
      </Paper>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Scan this QR code with your authenticator app
      </Typography>
      
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          Can't scan? Enter this key manually:
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          <Typography
            variant="body2"
            fontFamily="monospace"
            sx={{ wordBreak: 'break-all' }}
          >
            {manualEntryKey}
          </Typography>
          <Button
            size="small"
            startIcon={<ContentCopy />}
            onClick={handleCopyKey}
          >
            Copy
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};