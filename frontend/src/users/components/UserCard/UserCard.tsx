import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert, Email, Phone, Business } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { User } from '../../types';
import { getAccountStatusColor, getAccountStatusLabel, formatPhoneNumber } from '../../utils';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onViewProfile?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onViewProfile,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(user);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(user);
    handleMenuClose();
  };

  const handleViewProfile = () => {
    onViewProfile?.(user);
    handleMenuClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ height: '100%', position: 'relative' }}>
        <CardContent>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={user.profile?.profile_picture || undefined}
                alt={user.full_name}
                sx={{ width: 56, height: 56 }}
              >
                {user.first_name[0]}{user.last_name[0]}
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {user.profile?.display_name || user.full_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
            
            {(onEdit || onDelete || onViewProfile) && (
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            )}
          </Box>

          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <Chip
              label={getAccountStatusLabel(user.account_status)}
              color={getAccountStatusColor(user.account_status)}
              size="small"
            />
            {user.is_mfa_enabled && (
              <Chip label="MFA Enabled" color="success" size="small" />
            )}
            {user.is_organizer && (
              <Chip label="Organizer" color="primary" size="small" />
            )}
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            {user.profile?.phone && (
              <Box display="flex" alignItems="center" gap={1}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2">
                  {formatPhoneNumber(user.profile.phone)}
                </Typography>
              </Box>
            )}
            
            {user.profile?.company && (
              <Box display="flex" alignItems="center" gap={1}>
                <Business fontSize="small" color="action" />
                <Typography variant="body2">
                  {user.profile.company}
                </Typography>
              </Box>
            )}
          </Box>

          {user.roles && user.roles.length > 0 && (
            <Box mt={2}>
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                Roles
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {user.roles.slice(0, 3).map((role) => (
                  <Chip
                    key={role.id}
                    label={role.name}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {user.roles.length > 3 && (
                  <Chip
                    label={`+${user.roles.length - 3} more`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {onViewProfile && (
            <MenuItem onClick={handleViewProfile}>
              View Profile
            </MenuItem>
          )}
          {onEdit && (
            <MenuItem onClick={handleEdit}>
              Edit User
            </MenuItem>
          )}
          {onDelete && (
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              Delete User
            </MenuItem>
          )}
        </Menu>
      </Card>
    </motion.div>
  );
};