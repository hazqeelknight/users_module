import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Login,
  Logout,
  Security,
  Person,
  Settings,
  Warning,
  Info,
} from '@mui/icons-material';
import { AuditLog } from '../../types';
import { formatDateTime, formatRelativeTime } from '@/utils/formatters';

interface AuditLogItemProps {
  log: AuditLog;
}

export const AuditLogItem: React.FC<AuditLogItemProps> = ({ log }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <Login color="success" />;
      case 'logout':
        return <Logout color="action" />;
      case 'login_failed':
        return <Warning color="error" />;
      case 'password_changed':
      case 'password_reset_completed':
      case 'mfa_enabled':
      case 'mfa_disabled':
        return <Security color="primary" />;
      case 'profile_updated':
        return <Person color="info" />;
      case 'role_assigned':
      case 'role_removed':
        return <Settings color="warning" />;
      default:
        return <Info color="action" />;
    }
  };

  const getActionColor = (action: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (action) {
      case 'login':
      case 'email_verified':
        return 'success';
      case 'login_failed':
      case 'account_locked':
        return 'error';
      case 'password_changed':
      case 'mfa_enabled':
        return 'warning';
      case 'profile_updated':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <ListItem alignItems="flex-start">
      <ListItemIcon sx={{ mt: 1 }}>
        {getActionIcon(log.action)}
      </ListItemIcon>
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Typography variant="subtitle2">
              {log.action_display}
            </Typography>
            <Chip
              label={log.action_display}
              color={getActionColor(log.action)}
              size="small"
            />
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {log.description}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {log.ip_address && `From ${log.ip_address} • `}
                {formatRelativeTime(log.created_at)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(log.created_at)}
              </Typography>
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};