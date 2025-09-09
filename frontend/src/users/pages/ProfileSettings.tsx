import React from 'react';
import { Typography } from '@mui/material';
import { PageHeader } from '@/components/core';

const ProfileSettings: React.FC = () => {
  return (
    <>
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your personal information and preferences"
      />
      
      <Typography variant="body1">
        Profile settings content will be implemented here.
      </Typography>
    </>
  );
};

export default ProfileSettings;