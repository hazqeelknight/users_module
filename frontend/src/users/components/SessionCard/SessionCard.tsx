import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Computer,
  Smartphone,
  Tablet,
  Delete,
  LocationOn,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { UserSession } from '../../types';
import { formatDateTime, formatRelativeTime } from '@/utils/formatters';
import { parseDeviceInfo } from '../../utils';

interface SessionCardProps {
  session: UserSession;
  onRevoke?: (sessionId: string) => void;
  showRevokeButton?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onRevoke,
  showRevokeButton = true,
}) => {
  const deviceInfo = parseDeviceInfo(session.device_info);

  const getDeviceIcon = () => {
    switch (deviceInfo.device.toLowerCase()) {
      case 'mobile':
        return <Smartphone />;
      case 'tablet':
        return <Tablet />;
      default:
        return <Computer />;
    }
  };

  const handleRevoke = () => {
    onRevoke?.(session.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        sx={{ 
          border: session.is_current ? 2 : 1,
          borderColor: session.is_current ? 'primary.main' : 'divider',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              {getDeviceIcon()}
              <Box>
                <Typography variant="h6" component="div">
                  {deviceInfo.browser} on {deviceInfo.os}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {deviceInfo.device}
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              {session.is_current && (
                <Chip label="Current Session" color="primary" size="small" />
              )}
              {showRevokeButton && !session.is_current && (
                <Tooltip title="Revoke Session">
                  <IconButton size="small" onClick={handleRevoke} color="error">
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2">
                {session.location || session.ip_address}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Schedule fontSize="small" color="action" />
              <Typography variant="body2">
                Last active: {formatRelativeTime(session.last_activity)}
              </Typography>
            </Box>
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Created: {formatDateTime(session.created_at)}
            </Typography>
            <Chip
              label={session.is_active ? 'Active' : 'Inactive'}
              color={session.is_active ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};