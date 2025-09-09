import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { Role } from '../../types';
import { getRoleTypeColor } from '../../utils';

interface RoleChipProps extends Omit<ChipProps, 'label' | 'color'> {
  role: Role;
  showDescription?: boolean;
}

export const RoleChip: React.FC<RoleChipProps> = ({
  role,
  showDescription = false,
  ...props
}) => {
  return (
    <Chip
      label={role.name}
      color={getRoleTypeColor(role.role_type)}
      title={showDescription ? role.description : undefined}
      {...props}
    />
  );
};