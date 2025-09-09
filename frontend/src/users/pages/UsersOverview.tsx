import React from 'react';
import { Typography } from '@mui/material';
import { PageHeader } from '@/components/core';

const UsersOverview: React.FC = () => {
  return (
    <>
      <PageHeader
        title="Users Overview"
        subtitle="Manage user accounts, roles, and permissions"
      />
      
      <Typography variant="body1">
        Users module content will be implemented here by the assigned developer.
      </Typography>
    </>
  );
};

export default UsersOverview;