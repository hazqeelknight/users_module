import React from 'react';
import { Typography } from '@mui/material';
import { PageHeader } from '@/components/core';

const SecuritySettings: React.FC = () => {
  return (
    <>
      <PageHeader
        title="Security Settings"
        subtitle="Manage your account security and authentication"
      />
      
      <Typography variant="body1">
        Security settings content will be implemented here.
      </Typography>
    </>
  );
};

export default SecuritySettings;