import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert, Email, Schedule, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Invitation } from '../../types';
import { formatDateTime, formatRelativeTime } from '@/utils/formatters';

interface InvitationCardProps {
  invitation: Invitation;
  onResend?: (invitation: Invitation) => void;
  onCancel?: (invitation: Invitation) => void;
  showActions?: boolean;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onResend,
  onCancel,
  showActions = true,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleResend = () => {
    onResend?.(invitation);
    handleMenuClose();
  };

  const handleCancel = () => {
    onCancel?.(invitation);
    handleMenuClose();
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'declined':
      case 'expired':
        return 'error';
      default:
        return 'info';
    }
  };

  const isExpired = new Date(invitation.expires_at) < new Date();
  const isPending = invitation.status === 'pending' && !isExpired;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Email color="primary" />
              <Box>
                <Typography variant="h6" component="div">
                  {invitation.invited_email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Invited by {invitation.invited_by_name}
                </Typography>
              </Box>
            </Box>
            
            {showActions && isPending && (
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            )}
          </Box>

          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <Chip
              label={invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
              color={getStatusColor(invitation.status)}
              size="small"
            />
            <Chip
              label={invitation.role_name}
              variant="outlined"
              size="small"
            />
            {isExpired && invitation.status === 'pending' && (
              <Chip label="Expired" color="error" size="small" />
            )}
          </Box>

          {invitation.message && (
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Message:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "{invitation.message}"
              </Typography>
            </Box>
          )}

          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Schedule fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                Sent {formatRelativeTime(invitation.created_at)}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Schedule fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                Expires {formatDateTime(invitation.expires_at)}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {onResend && (
            <MenuItem onClick={handleResend}>
              Resend Invitation
            </MenuItem>
          )}
          {onCancel && (
            <MenuItem onClick={handleCancel} sx={{ color: 'error.main' }}>
              Cancel Invitation
            </MenuItem>
          )}
        </Menu>
      </Card>
    </motion.div>
  );
};