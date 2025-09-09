import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { getAccountStatusColor, getAccountStatusLabel } from '../../utils';

interface AccountStatusChipProps extends Omit<ChipProps, 'label' | 'color'> {
  status: string;
}

export const AccountStatusChip: React.FC<AccountStatusChipProps> = ({
  status,
  ...props
}) => {
  return (
    <Chip
      label={getAccountStatusLabel(status)}
      color={getAccountStatusColor(status)}
      {...props}
    />
  );
};