import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Security, SecurityOutlined } from '@mui/icons-material';

interface MFAStatusIndicatorProps {
  isEnabled: boolean;
  deviceCount?: number;
  size?: 'small' | 'medium';
}

export const MFAStatusIndicator: React.FC<MFAStatusIndicatorProps> = ({
  isEnabled,
  deviceCount = 0,
  size = 'medium',
}) => {
  if (size === 'small') {
    return (
      <Chip
        icon={isEnabled ? <Security /> : <SecurityOutlined />}
        label={isEnabled ? 'MFA Enabled' : 'MFA Disabled'}
        color={isEnabled ? 'success' : 'default'}
        size="small"
      />
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {isEnabled ? (
        <Security color="success" />
      ) : (
        <SecurityOutlined color="disabled" />
      )}
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {isEnabled ? 'MFA Enabled' : 'MFA Disabled'}
        </Typography>
        {isEnabled && deviceCount > 0 && (
          <Typography variant="caption" color="text.secondary">
            {deviceCount} device{deviceCount !== 1 ? 's' : ''} configured
          </Typography>
        )}
      </Box>
    </Box>
  );
};