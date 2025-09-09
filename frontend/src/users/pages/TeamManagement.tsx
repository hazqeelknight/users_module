import React from 'react';
import { Typography } from '@mui/material';
import { PageHeader } from '@/components/core';

const TeamManagement: React.FC = () => {
  return (
    <>
      <PageHeader
        title="Team Management"
        subtitle="Manage team members, roles, and invitations"
      />
      
      <Typography variant="body1">
        Team management content will be implemented here.
      </Typography>
    </>
  );
};

export default TeamManagement;